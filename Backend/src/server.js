import app from "./app.js";
import pool from "./config/database.js";

const port = Number(process.env.PORT) || 4000;

const server = app.listen(port, () => {
  console.log(`REVEX API listening on port ${port}`);
});

const shutdown = async () => {
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
