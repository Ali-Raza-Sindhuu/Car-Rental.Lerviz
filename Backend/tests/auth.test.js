import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { after, before, test } from "node:test";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import mysql from "mysql2/promise";

dotenv.config();

const testDatabase = process.env.TEST_DB_NAME || "revex_test";
let server;
let baseUrl;
let pool;
let email;
let token;
let googleCredentials;
let sentEmails;

before(async () => {
  if (!process.env.DB_NAME || testDatabase === process.env.DB_NAME) {
    throw new Error("TEST_DB_NAME must identify a database separate from DB_NAME");
  }
  const databasePattern = /^[A-Za-z0-9_]+$/;
  if (!databasePattern.test(testDatabase)) throw new Error("TEST_DB_NAME contains unsupported characters");

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${testDatabase}\``);
  await connection.end();

  process.env.DB_NAME = testDatabase;
  process.env.JWT_SECRET = process.env.JWT_SECRET || "test-only-secret-for-revex-auth-tests";
  process.env.GOOGLE_CLIENT_ID = "test-google-client-id";
  process.env.CLOUDINARY_CLOUD_NAME = "test-cloud";
  process.env.CLOUDINARY_API_KEY = "test-cloudinary-key";
  process.env.CLOUDINARY_API_SECRET = "test-cloudinary-secret";
  process.env.EMAIL_MODE = "console";
  process.env.FRONTEND_URL = "http://localhost:5173";
  process.env.JWT_EXPIRES_IN = "1h";
  pool = (await import("../src/config/database.js")).default;
  const schema = await readFile(new URL("../db/schema.sql", import.meta.url), "utf8");
  for (const statement of schema.split(";").map((part) => part.trim()).filter(Boolean)) {
    await pool.query(statement);
  }
  const { runGoogleMigration } = await import("../scripts/google-migration.js");
  const migrationConnection = await pool.getConnection();
  try {
    await runGoogleMigration(migrationConnection);
    const { runEmailMigration } = await import("../scripts/email-migration.js");
    await runEmailMigration(migrationConnection);
  } finally {
    migrationConnection.release();
  }

  await pool.execute("DELETE FROM cars WHERE id LIKE 'module2-test-%'");
  for (let index = 0; index < 30; index += 1) {
    await pool.execute(
      `INSERT INTO cars
        (id, make, model, year_range, year, \`condition\`, listing_type, price,
         body_type, fuel, transmission, cc, bhp, mileage, colour, image_url, status)
       VALUES (?, 'Module Test', ?, '2020-2021', ?, 'used', ?, 1000, 'Sedan',
         'Petrol', 'Automatic', 1000, 100, 10000, 'Blue', ?, 'available')
       ON DUPLICATE KEY UPDATE model = VALUES(model)`,
      [
        `module2-test-car-${String(index).padStart(2, "0")}`,
        `Car ${String(index).padStart(2, "0")}`,
        2020 + (index % 5),
        index < 7 ? "rent" : "buy",
        `https://images.example.test/module2-${index}.jpg`,
      ],
    );
  }
  await pool.execute(
    `INSERT INTO cars
      (id, make, model, year_range, year, \`condition\`, listing_type, price,
       body_type, fuel, transmission, cc, bhp, mileage, colour, image_url, status)
     VALUES ('module2-test-sold', 'Module Sold', 'Sold Car', '2020-2021', 2021,
       'used', 'buy', 1000, 'Sedan', 'Petrol', 'Automatic', 1000, 100, 10000,
       'Blue', 'https://images.example.test/sold.jpg', 'sold')
     ON DUPLICATE KEY UPDATE status = 'sold'`,
  );
  await pool.execute(
    `INSERT INTO car_details (car_id, description, specs, dealer, vin)
     VALUES ('module2-test-car-00', 'Test detail', '{}', '{}', 'MODULE2-TEST-VIN')
     ON DUPLICATE KEY UPDATE description = VALUES(description)`,
  );
  await pool.execute(
    `INSERT INTO car_features (car_id, label, sort_order)
     VALUES ('module2-test-car-00', 'Test feature', 0)
     ON DUPLICATE KEY UPDATE label = VALUES(label)`,
  );
  await pool.execute(
    `INSERT INTO car_gallery (car_id, image_url, image_public_id, sort_order)
     VALUES ('module2-test-car-00', 'https://images.example.test/gallery.jpg', 'module2/gallery', 0)
     ON DUPLICATE KEY UPDATE image_url = VALUES(image_url)`,
  );

  sentEmails = [];
  const { setMailSender } = await import("../src/services/mail.service.js");
  setMailSender(async (message) => {
    sentEmails.push(message);
    return { id: `test-mail-${sentEmails.length}` };
  });
  const authService = await import("../src/services/auth.service.js");
  googleCredentials = new Map();
  authService.setGoogleCredentialVerifier(async (credential, audience) => {
    assert.equal(audience, process.env.GOOGLE_CLIENT_ID);
    if (!googleCredentials.has(credential)) throw new Error("Unrecognized test credential");
    return googleCredentials.get(credential);
  });
  const app = (await import("../src/app.js")).default;
  app.set("trust proxy", 1);
  server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
  email = `auth-test-${randomUUID()}@example.test`;
});

after(async () => {
  if (server) await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  if (pool) await pool.end();
});

const request = (path, options = {}) => fetch(`${baseUrl}${path}`, options);
let clientSequence = 0;
const postJson = (path, body, authToken, clientIp) => {
  const headers = {
    "content-type": "application/json",
    "x-forwarded-for": clientIp || `198.51.100.${++clientSequence}`,
  };
  if (authToken) headers.authorization = `Bearer ${authToken}`;
  return request(path, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
};
const getTokenFromEmail = (message, page) => {
  const match = message.text.match(new RegExp(`${page}\\?token=([a-f0-9]{64})`));
  assert.ok(match, `Expected ${page} token link in mocked email`);
  return match[1];
};

test("signup returns a public user and token", async () => {
  const response = await postJson("/api/auth/signup", {
    name: "Test Driver",
    email,
    password: "Password123",
  });
  const body = await response.json();
  assert.equal(response.status, 201);
  assert.ok(body.user);
  assert.ok(body.token);
  assert.equal(body.user.email, email);
  assert.equal("password_hash" in body.user, false);
  token = body.token;
});

test("frontend register alias accepts fullName and returns accessToken and message", async () => {
  const response = await postJson("/api/auth/register", {
    fullName: "Frontend Driver",
    email: `frontend-${randomUUID()}@example.test`,
    password: "Password123",
    confirmPassword: "Password123",
  });
  const body = await response.json();
  assert.equal(response.status, 201);
  assert.equal(body.message, "Account created successfully");
  assert.ok(body.accessToken);
});

test("duplicate email returns 409", async () => {
  const response = await postJson("/api/auth/signup", {
    name: "Test Driver",
    email,
    password: "Password123",
  });
  assert.equal(response.status, 409);
});

test("weak password returns 400 with a field error", async () => {
  const response = await postJson("/api/auth/signup", {
    name: "Test Driver",
    email: `weak-${randomUUID()}@example.test`,
    password: "short",
  });
  const body = await response.json();
  assert.equal(response.status, 400);
  assert.ok(body.errors.password);
});

test("login succeeds with correct credentials", async () => {
  const response = await postJson("/api/auth/login", { email, password: "Password123" });
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.ok(body.token);
  assert.ok(body.accessToken);
  assert.equal(body.user.email, email);
});

test("wrong password and unknown email return the same 401", async () => {
  const wrongPassword = await postJson("/api/auth/login", { email, password: "WrongPass123" });
  const unknownEmail = await postJson("/api/auth/login", {
    email: `unknown-${randomUUID()}@example.test`,
    password: "WrongPass123",
  });
  assert.equal(wrongPassword.status, 401);
  assert.equal(unknownEmail.status, 401);
  assert.equal((await wrongPassword.json()).message, (await unknownEmail.json()).message);
});

test("/api/auth/me requires a valid bearer token", async () => {
  const anonymous = await request("/api/auth/me");
  const authenticated = await request("/api/auth/me", { headers: { authorization: `Bearer ${token}` } });
  const body = await authenticated.json();
  assert.equal(anonymous.status, 401);
  assert.equal(authenticated.status, 200);
  assert.equal(body.user.email, email);
  assert.equal("password_hash" in body.user, false);
});

test("PATCH /api/users/me rejects a wrong current password", async () => {
  const response = await request("/api/users/me", {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ newPassword: "NewPassword123", currentPassword: "WrongPass123" }),
  });
  assert.equal(response.status, 401);
});

test("logout responds successfully without server-side token state", async () => {
  const response = await postJson("/api/auth/logout", {});
  assert.equal(response.status, 200);
  assert.equal((await response.json()).message, "Logged out successfully");
});

const postGoogle = (credential) => postJson("/api/auth/google", { credential });

test("Google login creates a passwordless user and returns a safe user", async () => {
  const googleEmail = `google-new-${randomUUID()}@example.test`;
  const googleSub = `google-sub-${randomUUID()}`;
  googleCredentials.set("google-new-user", {
    sub: googleSub,
    email: googleEmail,
    email_verified: true,
    name: "Google New User",
  });
  const response = await postGoogle("google-new-user");
  const body = await response.json();
  assert.equal(response.status, 200, JSON.stringify(body));
  assert.equal(body.user.email, googleEmail);
  assert.ok(body.token);
  assert.equal("password_hash" in body.user, false);
  const [rows] = await pool.execute(
    "SELECT password_hash, google_sub, email_verified_at FROM users WHERE email = ?",
    [googleEmail],
  );
  assert.equal(rows[0].password_hash, null);
  assert.equal(rows[0].google_sub, googleSub);
  assert.ok(rows[0].email_verified_at);
});

test("Google login links an existing email account without creating a duplicate", async () => {
  const linkedEmail = `google-link-${randomUUID()}@example.test`;
  const googleSub = `google-sub-${randomUUID()}`;
  const signupResponse = await postJson("/api/auth/signup", {
    name: "Existing Email User",
    email: linkedEmail,
    password: "Password123",
  });
  assert.equal(signupResponse.status, 201);
  const [{ id: existingId }] = await pool.execute(
    "SELECT id FROM users WHERE email = ?",
    [linkedEmail],
  ).then(([rows]) => rows);
  googleCredentials.set("google-link-existing", {
    sub: googleSub,
    email: ` ${linkedEmail.toUpperCase()} `,
    email_verified: true,
    name: "Google Profile Name",
  });
  const response = await postGoogle("google-link-existing");
  const body = await response.json();
  const [rows] = await pool.execute(
    "SELECT id, google_sub FROM users WHERE LOWER(TRIM(email)) = ?",
    [linkedEmail],
  );
  assert.equal(response.status, 200);
  assert.equal(String(rows[0].id), String(existingId));
  assert.equal(rows[0].google_sub, googleSub);
  assert.equal(rows.length, 1);
  assert.equal(body.user.name, "Existing Email User");
});

test("Google login rejects unverified email", async () => {
  googleCredentials.set("google-unverified", {
    sub: "google-sub-unverified",
    email: `unverified-${randomUUID()}@example.test`,
    email_verified: false,
    name: "Unverified User",
  });
  const response = await postGoogle("google-unverified");
  assert.equal(response.status, 401);
});

test("Google login rejects an invalid credential", async () => {
  const response = await postGoogle("invalid-google-credential");
  assert.equal(response.status, 401);
});

test("Google login rejects a different subject for an already-linked email", async () => {
  const linkedEmail = `google-mismatch-${randomUUID()}@example.test`;
  googleCredentials.set("google-first-subject", {
    sub: `google-sub-${randomUUID()}`,
    email: linkedEmail,
    email_verified: true,
    name: "Linked User",
  });
  const firstLogin = await postGoogle("google-first-subject");
  assert.equal(firstLogin.status, 200);
  googleCredentials.set("google-different-subject", {
    sub: `google-sub-${randomUUID()}`,
    email: linkedEmail,
    email_verified: true,
    name: "Different Google User",
  });
  const secondLogin = await postGoogle("google-different-subject");
  assert.equal(secondLogin.status, 401);
});

test("email login for a Google-only user returns the generic 401", async () => {
  const googleEmail = `google-passwordless-${randomUUID()}@example.test`;
  googleCredentials.set("google-passwordless", {
    sub: `google-sub-${randomUUID()}`,
    email: googleEmail,
    email_verified: true,
    name: "Google Passwordless",
  });
  const googleResponse = await postGoogle("google-passwordless");
  assert.equal(googleResponse.status, 200);
  const response = await postJson("/api/auth/login", {
    email: googleEmail,
    password: "Password123",
  });
  assert.equal(response.status, 401);
  assert.equal((await response.json()).message, "Invalid email or password");
});

test("11th login request within the window is rate limited", async () => {
  let lastResponse;
  for (let attempt = 0; attempt < 11; attempt += 1) {
    lastResponse = await postJson("/api/auth/login", {
      email: `rate-limit-${randomUUID()}@example.test`,
      password: "Password123",
    }, undefined, "203.0.113.12");
  }
  assert.equal(lastResponse.status, 429);
});

test("signup sends a verification email while preserving the original signup response", async () => {
  const emailAddress = `verify-signup-${randomUUID()}@example.test`;
  const response = await postJson("/api/auth/signup", {
    name: "Verification Signup",
    email: emailAddress,
    password: "Password123",
  });
  const body = await response.json();
  assert.equal(response.status, 201);
  assert.ok(body.token);
  assert.equal("verificationToken" in body, false);
  const message = sentEmails.find((item) => item.to === emailAddress);
  assert.ok(message);
  assert.match(message.text, /verify-email\?token=/);
});

test("forgot-password returns identical responses for known and unknown emails", async () => {
  const knownEmail = `forgot-known-${randomUUID()}@example.test`;
  const signupResponse = await postJson("/api/auth/signup", {
    name: "Forgot Password User",
    email: knownEmail,
    password: "Password123",
  });
  assert.equal(signupResponse.status, 201);

  const knownResponse = await postJson("/api/auth/forgot-password", { email: knownEmail });
  const knownBody = await knownResponse.json();
  const unknownResponse = await postJson("/api/auth/forgot-password", {
    email: `forgot-unknown-${randomUUID()}@example.test`,
  });
  const unknownBody = await unknownResponse.json();
  assert.equal(knownResponse.status, 200);
  assert.equal(unknownResponse.status, 200);
  assert.deepEqual(knownBody, unknownBody);
  assert.equal(knownBody.message, "If an account exists for that email, we've sent a link.");

  const mail = sentEmails.findLast((item) => item.to === knownEmail && item.subject.includes("Reset"));
  const rawToken = getTokenFromEmail(mail, "/reset-password");
  const [rows] = await pool.execute(
    "SELECT token_hash FROM password_reset_tokens WHERE user_id = (SELECT id FROM users WHERE email = ?)",
    [knownEmail],
  );
  assert.equal(rows.length, 1);
  assert.equal(rows[0].token_hash, createHash("sha256").update(rawToken).digest("hex"));
  assert.notEqual(rows[0].token_hash, rawToken);
});

test("reset token succeeds once and a second use is rejected", async () => {
  const userEmail = `reset-once-${randomUUID()}@example.test`;
  await postJson("/api/auth/signup", { name: "Reset Once User", email: userEmail, password: "Password123" });
  const forgotResponse = await postJson("/api/auth/forgot-password", { email: userEmail });
  assert.equal(forgotResponse.status, 200);
  const message = sentEmails.findLast((item) => item.to === userEmail && item.subject.includes("Reset"));
  const rawToken = getTokenFromEmail(message, "/reset-password");

  const first = await postJson("/api/auth/reset-password", { token: rawToken, password: "NewPassword123" });
  const second = await postJson("/api/auth/reset-password", { token: rawToken, password: "NextPassword123" });
  assert.equal(first.status, 200);
  assert.equal(second.status, 400);
});

test("expired reset token returns 400", async () => {
  const userEmail = `reset-expired-${randomUUID()}@example.test`;
  await postJson("/api/auth/signup", { name: "Expired Reset User", email: userEmail, password: "Password123" });
  await postJson("/api/auth/forgot-password", { email: userEmail });
  const message = sentEmails.findLast((item) => item.to === userEmail && item.subject.includes("Reset"));
  const rawToken = getTokenFromEmail(message, "/reset-password");
  const hash = createHash("sha256").update(rawToken).digest("hex");
  await pool.execute(
    "UPDATE password_reset_tokens SET expires_at = DATE_SUB(UTC_TIMESTAMP(), INTERVAL 1 MINUTE) WHERE token_hash = ?",
    [hash],
  );
  const response = await postJson("/api/auth/reset-password", { token: rawToken, password: "NewPassword123" });
  assert.equal(response.status, 400);
});

test("password reset invalidates JWTs issued before the reset", async () => {
  const userEmail = `reset-jwt-${randomUUID()}@example.test`;
  const signupResponse = await postJson("/api/auth/signup", {
    name: "JWT Reset User",
    email: userEmail,
    password: "Password123",
  });
  const signupBody = await signupResponse.json();
  const oldToken = jwt.sign(
    { sub: signupBody.user.id, iat: Math.floor(Date.now() / 1000) - 60 },
    process.env.JWT_SECRET,
  );
  await postJson("/api/auth/forgot-password", { email: userEmail });
  const message = sentEmails.findLast((item) => item.to === userEmail && item.subject.includes("Reset"));
  const rawToken = getTokenFromEmail(message, "/reset-password");
  const resetResponse = await postJson("/api/auth/reset-password", { token: rawToken, password: "ChangedPassword123" });
  assert.equal(resetResponse.status, 200);

  const me = await request("/api/auth/me", { headers: { authorization: `Bearer ${oldToken}` } });
  assert.equal(me.status, 401);
});

test("JWT issued in the same second as a password change remains valid", async () => {
  const signupResponse = await postJson("/api/auth/signup", {
    name: "Same Second JWT User",
    email: `same-second-jwt-${randomUUID()}@example.test`,
    password: "Password123",
  });
  const signupBody = await signupResponse.json();
  const issuedAt = Math.floor(Date.now() / 1000);
  await pool.execute(
    "UPDATE users SET password_changed_at = FROM_UNIXTIME(?) WHERE id = ?",
    [issuedAt, signupBody.user.id],
  );
  const tokenIssuedAtChange = jwt.sign(
    { sub: signupBody.user.id, iat: issuedAt },
    process.env.JWT_SECRET,
  );
  const reserve = await cartJson(
    "/api/cart/items",
    "POST",
    { carId: "module2-test-car-10", listingType: "buy" },
    tokenIssuedAtChange,
  );
  assert.equal(reserve.status, 201);
});

test("verification token sets email_verified_at and is single use", async () => {
  const userEmail = `verify-token-${randomUUID()}@example.test`;
  const signupResponse = await postJson("/api/auth/signup", {
    name: "Verify Token User",
    email: userEmail,
    password: "Password123",
  });
  assert.equal(signupResponse.status, 201);
  const message = sentEmails.findLast((item) => item.to === userEmail && item.subject.includes("Verify"));
  const rawToken = getTokenFromEmail(message, "/verify-email");

  const first = await postJson("/api/auth/verify-email", { token: rawToken });
  const second = await postJson("/api/auth/verify-email", { token: rawToken });
  const [rows] = await pool.execute("SELECT email_verified_at FROM users WHERE email = ?", [userEmail]);
  assert.equal(first.status, 200);
  assert.equal(second.status, 400);
  assert.ok(rows[0].email_verified_at);
});

test("forgot-password is rate limited after five requests", async () => {
  let response;
  for (let attempt = 0; attempt < 6; attempt += 1) {
    response = await postJson("/api/auth/forgot-password", {
      email: `limit-forgot-${randomUUID()}@example.test`,
    }, undefined, "203.0.113.10");
  }
  assert.equal(response.status, 429);
});

test("resend-verification is rate limited after five requests", async () => {
  const userEmail = `limit-resend-${randomUUID()}@example.test`;
  const signupResponse = await postJson("/api/auth/signup", {
    name: "Rate Limit User",
    email: userEmail,
    password: "Password123",
  });
  const signupBody = await signupResponse.json();
  let response;
  for (let attempt = 0; attempt < 6; attempt += 1) {
    response = await postJson("/api/auth/resend-verification", {}, signupBody.token, "203.0.113.11");
  }
  assert.equal(response.status, 429);
});

const signupCartUser = async () => {
  const response = await postJson("/api/auth/signup", {
    name: "Module Two User",
    email: `module2-${randomUUID()}@example.test`,
    password: "Password123",
  });
  assert.equal(response.status, 201);
  return response.json();
};

const futureDate = (offsetDays) => {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() + offsetDays);
  return date.toISOString().slice(0, 10);
};

const cartJson = (path, method, body, authToken) => request(path, {
  method,
  headers: {
    "content-type": "application/json",
    authorization: `Bearer ${authToken}`,
  },
  ...(body === undefined ? {} : { body: JSON.stringify(body) }),
});

test("cars API supports page 2 and rental-only results", async () => {
  const pageResponse = await request("/api/cars?page=2&pageSize=9&make=Module%20Test");
  const pageBody = await pageResponse.json();
  assert.equal(pageResponse.status, 200);
  assert.equal(pageBody.items.length, 9);
  assert.equal(pageBody.total, 30);
  assert.equal(pageBody.page, 2);

  const rentResponse = await request("/api/cars?listingType=rent&make=Module%20Test");
  const rentBody = await rentResponse.json();
  assert.equal(rentResponse.status, 200);
  assert.equal(rentBody.items.length, 7);
  assert.ok(rentBody.items.every((car) => car.listing_type === "rent"));
  const firstRentIndex = Number(rentBody.items[0].id.split("-").at(-1));
  assert.equal(
    rentBody.items[0].image_url,
    `https://images.example.test/module2-${firstRentIndex}.jpg`,
  );

  const purchasePriceResponse = await request(
    "/api/cars?minPrice=100000&maxPrice=200000&make=Module%20Test",
  );
  const purchasePriceBody = await purchasePriceResponse.json();
  assert.equal(purchasePriceResponse.status, 200);
  assert.equal(purchasePriceBody.items.length, 7);
  assert.ok(purchasePriceBody.items.every((car) => car.listing_type === "rent"));
});

test("car facets, details, availability, and not-found responses", async () => {
  const facetsResponse = await request("/api/cars/facets");
  const facets = await facetsResponse.json();
  assert.equal(facetsResponse.status, 200);
  assert.ok(facets.makes.includes("Module Test"));
  assert.ok(facets.modelsByMake["Module Test"].includes("Car 00"));

  const carId = "module2-test-car-00";
  const detailsResponse = await request(`/api/cars/${carId}`);
  const details = await detailsResponse.json();
  assert.equal(detailsResponse.status, 200);
  assert.equal(details.image_url, "https://images.example.test/module2-0.jpg");
  assert.equal(details.details.description, "Test detail");
  assert.deepEqual(details.features, ["Test feature"]);
  assert.equal(details.gallery[0].image_url, "https://images.example.test/gallery.jpg");

  const startDate = futureDate(10);
  const endDate = futureDate(11);
  const signup = await signupCartUser();
  await pool.execute(
    `INSERT INTO bookings (car_id, user_id, start_date, end_date, status)
     VALUES (?, ?, ?, ?, 'confirmed'), (?, ?, ?, ?, 'pending')`,
    [
      carId, signup.user.id, startDate, endDate,
      carId, signup.user.id, startDate, endDate,
    ],
  );
  const availability = await request(
    `/api/cars/${carId}/availability?from=${startDate}&to=${endDate}`,
  );
  const availabilityBody = await availability.json();
  assert.equal(availability.status, 200);
  assert.deepEqual(availabilityBody.bookedRanges, [{ startDate, endDate }]);

  const missing = await request("/api/cars/no-such-module2-car");
  assert.equal(missing.status, 404);
});

test("cart endpoints require authentication", async () => {
  const responses = await Promise.all([
    request("/api/cart"),
    request("/api/cart/items", { method: "POST", headers: { "content-type": "application/json" }, body: "{}" }),
    request("/api/cart/merge", { method: "POST", headers: { "content-type": "application/json" }, body: '{"items":[]}' }),
    request("/api/cart/items/1", { method: "DELETE" }),
  ]);
  assert.ok(responses.every((response) => response.status === 401));
});

test("sold cars are rejected and a duplicate cart item returns 409", async () => {
  const signup = await signupCartUser();
  const sold = await cartJson("/api/cart/items", "POST", {
    carId: "module2-test-sold",
    listingType: "buy",
  }, signup.token);
  assert.equal(sold.status, 409);

  const item = { carId: "module2-test-car-10", listingType: "buy" };
  const first = await cartJson("/api/cart/items", "POST", item, signup.token);
  const duplicate = await cartJson("/api/cart/items", "POST", item, signup.token);
  assert.equal(first.status, 201);
  assert.equal(duplicate.status, 409);
  assert.equal((await duplicate.json()).error.message, "Already in your garage");
});

test("rental cart validation enforces dates, max length, and confirmed availability", async () => {
  const signup = await signupCartUser();
  const carId = "module2-test-car-00";
  const startDate = futureDate(15);
  const laterDate = futureDate(16);
  const reversed = await cartJson("/api/cart/items", "POST", {
    carId,
    listingType: "rent",
    startDate: laterDate,
    endDate: startDate,
  }, signup.token);
  assert.equal(reversed.status, 400);

  const tooLong = await cartJson("/api/cart/items", "POST", {
    carId,
    listingType: "rent",
    startDate,
    endDate: futureDate(45),
  }, signup.token);
  assert.equal(tooLong.status, 400);

  const past = await cartJson("/api/cart/items", "POST", {
    carId,
    listingType: "rent",
    startDate: futureDate(-1),
    endDate: futureDate(0),
  }, signup.token);
  assert.equal(past.status, 400);

  const adjacentStart = futureDate(17);
  const adjacent = await cartJson("/api/cart/items", "POST", {
    carId,
    listingType: "rent",
    startDate: adjacentStart,
    endDate: adjacentStart,
  }, signup.token);
  assert.equal(adjacent.status, 201);

  const overlapUser = await signupCartUser();
  const conflictStart = futureDate(20);
  const conflictEnd = futureDate(21);
  await pool.execute(
    `INSERT INTO bookings (car_id, user_id, start_date, end_date, status)
     VALUES (?, ?, ?, ?, 'confirmed')`,
    [carId, overlapUser.user.id, conflictStart, conflictEnd],
  );
  const overlap = await cartJson("/api/cart/items", "POST", {
    carId,
    listingType: "rent",
    startDate: conflictEnd,
    endDate: futureDate(22),
  }, overlapUser.token);
  assert.equal(overlap.status, 409);
});

test("guest cart merge skips invalid items and is idempotent", async () => {
  const signup = await signupCartUser();
  const valid = { carId: "module2-test-car-11", listingType: "buy" };
  const items = [
    valid,
    { carId: "module2-test-sold", listingType: "buy" },
    { carId: "module2-test-car-00", listingType: "rent", startDate: "2000-01-01", endDate: "2000-01-02" },
    valid,
  ];
  const response = await cartJson("/api/cart/merge", "POST", { items }, signup.token);
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(body.added, 1);
  assert.equal(body.skipped.length, 3);
  assert.ok(body.skipped.some((item) => item.reason.includes("sold")));

  const repeated = await cartJson("/api/cart/merge", "POST", { items }, signup.token);
  const repeatedBody = await repeated.json();
  assert.equal(repeated.status, 200);
  assert.equal(repeatedBody.added, 0);
  const cartResponse = await cartJson("/api/cart", "GET", undefined, signup.token);
  const cart = await cartResponse.json();
  assert.equal(cart.cart.items.filter((item) => item.car.id === valid.carId).length, 1);
});

test("cart deletion only removes the current user's cart item", async () => {
  const firstUser = await signupCartUser();
  const secondUser = await signupCartUser();
  const add = await cartJson("/api/cart/items", "POST", {
    carId: "module2-test-car-12",
    listingType: "buy",
  }, firstUser.token);
  const { item } = await add.json();

  const forbidden = await cartJson(`/api/cart/items/${item.id}`, "DELETE", undefined, secondUser.token);
  assert.equal(forbidden.status, 404);
  const removed = await cartJson(`/api/cart/items/${item.id}`, "DELETE", undefined, firstUser.token);
  assert.equal(removed.status, 200);
});
