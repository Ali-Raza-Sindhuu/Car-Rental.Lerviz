import { createHash, randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import pool from "../config/database.js";
import { AppError } from "../lib/errors.js";
import { sendEmail } from "./mail.service.js";

const TOKEN_CONFIG = {
  password_reset_tokens: {
    expiresSeconds: 30 * 60,
    subject: "Reset your REVEX password",
    path: "/reset-password?token=",
    heading: "Reset your password",
    description: "Use the link below within 30 minutes to choose a new password.",
  },
  email_verification_tokens: {
    expiresSeconds: 24 * 60 * 60,
    subject: "Verify your REVEX email",
    path: "/verify-email?token=",
    heading: "Verify your email",
    description: "Use the link below within 24 hours to verify your email address.",
  },
};

const tokenHash = (token) => createHash("sha256").update(token).digest("hex");
const frontendUrl = () => process.env.FRONTEND_URL.replace(/\/+$/, "");

export const createAccountToken = async (table, userId) => {
  const config = TOKEN_CONFIG[table];
  if (!config) throw new Error("Unsupported account token type");

  const token = randomBytes(32).toString("hex");
  await pool.execute(
    `INSERT INTO ${table} (user_id, token_hash, expires_at) VALUES (?, ?, DATE_ADD(UTC_TIMESTAMP(), INTERVAL ? SECOND))`,
    [userId, tokenHash(token), config.expiresSeconds],
  );
  return token;
};

export const sendAccountTokenEmail = async (table, recipient, token) => {
  const config = TOKEN_CONFIG[table];
  if (!config) throw new Error("Unsupported account token type");

  const link = `${frontendUrl()}${config.path}${encodeURIComponent(token)}`;
  await sendEmail({
    to: recipient,
    subject: config.subject,
    html: `<h1>${config.heading}</h1><p>${config.description}</p><p><a href="${link}">${config.heading}</a></p>`,
    text: `${config.description}\n${link}`,
  });
};

export const createAndSendAccountToken = async (table, user) => {
  const token = await createAccountToken(table, user.id);
  await sendAccountTokenEmail(table, user.email, token);
};

export const consumeAccountToken = async (table, token, connection = pool) => {
  if (!TOKEN_CONFIG[table]) throw new Error("Unsupported account token type");
  if (typeof token !== "string" || !/^[a-f0-9]{64}$/i.test(token)) {
    throw new AppError(400, "This link is invalid or has expired.");
  }

  const [rows] = await connection.execute(
    `SELECT id, user_id FROM ${table}
     WHERE token_hash = ? AND used_at IS NULL AND expires_at > UTC_TIMESTAMP()
     LIMIT 1 FOR UPDATE`,
    [tokenHash(token)],
  );
  if (!rows.length) throw new AppError(400, "This link is invalid, expired, or has already been used.");
  return rows[0];
};

export const accountTokenHash = tokenHash;

export const forgotPassword = async (email) => {
  const [rows] = await pool.execute(
    "SELECT id, name, email FROM users WHERE LOWER(TRIM(email)) = ? LIMIT 1",
    [email.trim().toLowerCase()],
  );
  if (rows[0]) {
    try {
      await createAndSendAccountToken("password_reset_tokens", rows[0]);
    } catch (error) {
      console.error(`[account-email] reset email failed recipient_domain=${rows[0].email.split("@").at(-1)?.toLowerCase() || "unknown"} reason=${error.name || "Error"}`);
    }
  }
  return { message: "If an account exists for that email, we've sent a link." };
};

export const resetPassword = async (token, password) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const row = await consumeAccountToken("password_reset_tokens", token, connection);
    const passwordHash = await bcrypt.hash(password, 12);
    await connection.execute(
      "UPDATE users SET password_hash = ?, password_changed_at = CURRENT_TIMESTAMP WHERE id = ?",
      [passwordHash, row.user_id],
    );
    await connection.execute(
      "UPDATE password_reset_tokens SET used_at = CURRENT_TIMESTAMP WHERE id = ?",
      [row.id],
    );
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const verifyEmail = async (token) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const row = await consumeAccountToken("email_verification_tokens", token, connection);
    await connection.execute(
      "UPDATE users SET email_verified_at = COALESCE(email_verified_at, CURRENT_TIMESTAMP) WHERE id = ?",
      [row.user_id],
    );
    await connection.execute(
      "UPDATE email_verification_tokens SET used_at = CURRENT_TIMESTAMP WHERE id = ?",
      [row.id],
    );
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const resendVerification = async (userId) => {
  const [rows] = await pool.execute(
    "SELECT id, email, email_verified_at FROM users WHERE id = ? LIMIT 1",
    [userId],
  );
  const user = rows[0];
  if (user && !user.email_verified_at) {
    try {
      await createAndSendAccountToken("email_verification_tokens", user);
    } catch (error) {
      console.error(`[account-email] verification email failed recipient_domain=${user.email.split("@").at(-1)?.toLowerCase() || "unknown"} reason=${error.name || "Error"}`);
    }
  }
  return { message: "If your account needs verification, we have sent an email." };
};
