import "dotenv/config";
import { readFile } from "node:fs/promises";
import pool from "../src/config/database.js";

try {
  const schema = await readFile(new URL("../db/schema.sql", import.meta.url), "utf8");
  for (const statement of schema.split(";").map((part) => part.trim()).filter(Boolean)) {
    await pool.query(statement);
  }
  console.log("Database schema applied");
} catch (error) {
  console.error("Could not apply database schema:", error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
