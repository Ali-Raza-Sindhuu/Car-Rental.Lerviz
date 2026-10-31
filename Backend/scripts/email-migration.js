import { readFile } from "node:fs/promises";

export const runEmailMigration = async (connection) => {
  const migration = await readFile(
    new URL("../db/migrations/002_password_reset_verification.sql", import.meta.url),
    "utf8",
  );
  for (const statement of migration.split(";").map((part) => part.trim()).filter(Boolean)) {
    await connection.query(statement);
  }
};
