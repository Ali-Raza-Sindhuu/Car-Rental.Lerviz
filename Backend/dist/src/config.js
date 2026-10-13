"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readConfig = readConfig;
require("dotenv/config");
function readConfig(env = process.env) {
    const port = Number(env.PORT ?? 8000);
    if (!Number.isInteger(port) || port < 1 || port > 65535)
        throw new Error('PORT must be between 1 and 65535');
    let database;
    try {
        database = new URL(env.DATABASE_URL ?? '');
    }
    catch {
        throw new Error('DATABASE_URL must be a MySQL connection URL');
    }
    if (database.protocol !== 'mysql:' || !database.hostname || database.pathname.length < 2) {
        throw new Error('DATABASE_URL must specify a MySQL host and database');
    }
    const origins = (env.CORS_ORIGINS ?? 'http://localhost:5173').split(',').map(value => value.trim()).filter(Boolean);
    if (!origins.length || origins.some(origin => {
        try {
            const url = new URL(origin);
            return !['http:', 'https:'].includes(url.protocol) || url.origin !== origin;
        }
        catch {
            return true;
        }
    }))
        throw new Error('CORS_ORIGINS must contain explicit HTTP origins');
    return { port, origins };
}
//# sourceMappingURL=config.js.map