import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import pool from "../config/database.js";
import { AppError } from "../lib/errors.js";
import { createAndSendAccountToken } from "./account-token.service.js";

let googleCredentialVerifier;

export const setGoogleCredentialVerifier = (verifier) => {
  googleCredentialVerifier = verifier;
};

const publicUser = (row) => row && ({
  id: String(row.id),
  name: row.name,
  fullName: row.name,
  email: row.email,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  emailVerifiedAt: row.email_verified_at || null,
});

const issueToken = (userId) => jwt.sign(
  { sub: String(userId) },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRES_IN || "1h" },
);

export const getUserById = async (userId) => {
  const [rows] = await pool.execute(
    "SELECT id, name, email, email_verified_at, created_at, updated_at FROM users WHERE id = ? LIMIT 1",
    [userId],
  );
  return publicUser(rows[0]);
};

export const signup = async ({ name, fullName, email, password }) => {
  const normalizedName = (name || fullName).trim();
  const [existing] = await pool.execute("SELECT id FROM users WHERE email = ? LIMIT 1", [email]);
  if (existing.length) throw new AppError(409, "An account with this email already exists");

  const passwordHash = await bcrypt.hash(password, 12);
  try {
    const [result] = await pool.execute(
      "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
      [normalizedName, email, passwordHash],
    );
    const user = await getUserById(result.insertId);
    const token = issueToken(user.id);
    try {
      await createAndSendAccountToken("email_verification_tokens", user);
    } catch (error) {
      console.error(`[account-email] signup verification setup failed recipient_domain=${email.split("@").at(-1)?.toLowerCase() || "unknown"} reason=${error.name || "Error"}`);
    }
    return { user, token, accessToken: token, message: "Account created successfully" };
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      throw new AppError(409, "An account with this email already exists");
    }
    throw error;
  }
};

export const login = async ({ email, password }) => {
  const [rows] = await pool.execute(
    "SELECT id, name, email, password_hash, email_verified_at, created_at, updated_at FROM users WHERE email = ? LIMIT 1",
    [email],
  );
  const row = rows[0];
  if (!row || !row.password_hash || !(await bcrypt.compare(password, row.password_hash))) {
    throw new AppError(401, "Invalid email or password");
  }
  const user = publicUser(row);
  const token = issueToken(user.id);
  return { user, token, accessToken: token };
};

export const updateProfile = async (userId, { name, currentPassword, newPassword }) => {
  const [rows] = await pool.execute(
    "SELECT id, name, email, password_hash, email_verified_at, created_at, updated_at FROM users WHERE id = ? LIMIT 1",
    [userId],
  );
  const row = rows[0];
  if (!row) throw new AppError(404, "User not found");

  let passwordHash = row.password_hash;
  if (newPassword) {
    if (!row.password_hash || !(await bcrypt.compare(currentPassword || "", row.password_hash))) {
      throw new AppError(401, "Current password is incorrect");
    }
    passwordHash = await bcrypt.hash(newPassword, 12);
  }

  if (newPassword) {
    await pool.execute(
      "UPDATE users SET name = ?, password_hash = ?, password_changed_at = CURRENT_TIMESTAMP WHERE id = ?",
      [name || row.name, passwordHash, userId],
    );
  } else {
    await pool.execute(
      "UPDATE users SET name = ? WHERE id = ?",
      [name || row.name, userId],
    );
  }
  return getUserById(userId);
};

const findGoogleUserByEmail = async (email) => {
  const [rows] = await pool.execute(
    `SELECT id, name, email, google_sub, email_verified_at, created_at, updated_at
     FROM users WHERE LOWER(TRIM(email)) = ? LIMIT 1`,
    [email],
  );
  return rows[0];
};

const issueGoogleSession = async (row) => {
  const user = publicUser(row);
  const token = issueToken(user.id);
  return { user, token };
};

export const loginWithGoogle = async (credential) => {
  let payload;
  try {
    if (googleCredentialVerifier) {
      payload = await googleCredentialVerifier(credential, process.env.GOOGLE_CLIENT_ID);
    } else {
      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    }
  } catch {
    throw new AppError(401, "Invalid Google credential");
  }

  const email = typeof payload?.email === "string" ? payload.email.trim().toLowerCase() : "";
  const subject = typeof payload?.sub === "string" ? payload.sub : "";
  if (!email || !subject || payload.email_verified !== true) {
    throw new AppError(401, "Invalid Google credential");
  }

  const existing = await findGoogleUserByEmail(email);
  if (existing) {
    if (existing.google_sub && existing.google_sub !== subject) {
      throw new AppError(401, "Google account does not match this user");
    }
    if (!existing.google_sub) {
      try {
        await pool.execute(
          "UPDATE users SET google_sub = ? WHERE id = ? AND google_sub IS NULL",
          [subject, existing.id],
        );
      } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
          throw new AppError(401, "Invalid Google credential");
        }
        throw error;
      }
      const linked = await findGoogleUserByEmail(email);
      if (!linked || linked.google_sub !== subject) {
        throw new AppError(401, "Google account does not match this user");
      }
      return issueGoogleSession(linked);
    }
    return issueGoogleSession(existing);
  }

  const name = payload.name?.trim()
    || [payload.given_name, payload.family_name].filter(Boolean).join(" ").trim()
    || email.split("@")[0];
  try {
    const [result] = await pool.execute(
      `INSERT INTO users (name, email, password_hash, google_sub, email_verified_at)
       VALUES (?, ?, NULL, ?, CURRENT_TIMESTAMP)`,
      [name.slice(0, 120), email, subject],
    );
    const user = await getUserById(result.insertId);
    return { user, token: issueToken(user.id) };
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      const racedUser = await findGoogleUserByEmail(email);
      if (racedUser && (!racedUser.google_sub || racedUser.google_sub === subject)) {
        if (!racedUser.google_sub) {
          try {
            await pool.execute(
              "UPDATE users SET google_sub = ? WHERE id = ? AND google_sub IS NULL",
              [subject, racedUser.id],
            );
          } catch (linkError) {
            if (linkError.code === "ER_DUP_ENTRY") {
              throw new AppError(401, "Invalid Google credential");
            }
            throw linkError;
          }
        }
        const linked = await findGoogleUserByEmail(email);
        if (linked?.google_sub === subject) return issueGoogleSession(linked);
      }
      throw new AppError(401, "Invalid Google credential");
    }
    throw error;
  }
};
