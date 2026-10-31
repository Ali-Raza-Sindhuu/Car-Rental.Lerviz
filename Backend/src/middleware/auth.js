import jwt from "jsonwebtoken";
import { AppError } from "../lib/errors.js";
import pool from "../config/database.js";

export const authenticate = async (req, res, next) => {
  const authorization = req.get("authorization") || "";
  const [scheme, token, extra] = authorization.split(" ");
  if (scheme !== "Bearer" || !token || extra) {
    return next(new AppError(401, "Authentication required"));
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload || typeof payload !== "object" || !payload.sub) {
      throw new Error("JWT subject missing");
    }
  } catch {
    return next(new AppError(401, "Authentication required"));
  }

  const [rows] = await pool.execute(
    "SELECT UNIX_TIMESTAMP(password_changed_at) AS changed_at FROM users WHERE id = ? LIMIT 1",
    [payload.sub],
  );
  if (!rows.length) return next(new AppError(401, "Authentication required"));
  const changedAt = rows[0].changed_at === null ? null : Number(rows[0].changed_at);
  if (changedAt !== null && (!payload.iat || payload.iat < changedAt)) {
    return next(new AppError(401, "Authentication required"));
  }

  req.userId = String(payload.sub);
  next();
};
