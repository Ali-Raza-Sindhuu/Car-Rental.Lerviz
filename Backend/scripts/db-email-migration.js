import "dotenv/config";
import pool from "../src/config/database.js";
import { runEmailMigration } from "./email-migration.js";

try {
  const connection = await pool.getConnection();
  try {
    await runEmailMigration(connection);
  } finally {
    connection.release();
  }
  console.log("Password reset and email verification migration applied");
} catch (error) {
  console.error("Could not apply password reset and email verification migration:", error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
