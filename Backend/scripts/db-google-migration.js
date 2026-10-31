import "dotenv/config";
import pool from "../src/config/database.js";
import { runGoogleMigration } from "./google-migration.js";

try {
  const connection = await pool.getConnection();
  try {
    await runGoogleMigration(connection);
  } finally {
    connection.release();
  }
  console.log("Google authentication migration applied");
} catch (error) {
  console.error("Could not apply Google authentication migration:", error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
