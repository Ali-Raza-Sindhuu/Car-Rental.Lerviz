import { readFile } from "node:fs/promises";

export const runGoogleMigration = async (connection) => {
  const migration = await readFile(
    new URL("../db/migrations/001_google_auth.sql", import.meta.url),
    "utf8",
  );
  for (const statement of migration.split(";").map((part) => part.trim()).filter(Boolean)) {
    await connection.query(statement);
  }
};
