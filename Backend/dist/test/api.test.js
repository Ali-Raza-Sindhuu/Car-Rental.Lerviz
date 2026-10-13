"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const node_test_1 = require("node:test");
const strict_1 = __importDefault(require("node:assert/strict"));
const testing_1 = require("@nestjs/testing");
const app_module_1 = require("../src/app.module");
const database_service_1 = require("../src/database.service");
const setup_1 = require("../src/setup");
const config_1 = require("../src/config");
let app;
let base;
let unavailable = false;
let lastQuery;
const vehicle = {
    id: 'demo', slug: 'demo', make: 'Toyota', model: 'Corolla', modelYear: 2025, seats: 5,
    transmission: 'AUTOMATIC', fuelType: 'PETROL', baseDailyMinor: 9007199254740993n, currency: 'USD',
    branch: { slug: 'central', name: 'Central', timezone: 'UTC', address: 'Demo' },
    category: { slug: 'sedan', name: 'Sedan' }, images: [],
};
const db = {
    $queryRaw: async () => { if (unavailable)
        throw new Error('mysql://private-password@host'); return [{ value: 1 }]; },
    $transaction: async (queries) => Promise.all(queries),
    vehicle: {
        findMany: async (query) => { lastQuery = query; return [vehicle]; },
        count: async () => 1,
        findFirst: async (query) => { lastQuery = query; return query.where.slug === 'demo' ? vehicle : null; },
    },
    branch: { findMany: async () => [vehicle.branch] },
    category: { findMany: async () => [vehicle.category] },
};
(0, node_test_1.before)(async () => {
    const module = await testing_1.Test.createTestingModule({ imports: [app_module_1.AppModule] }).overrideProvider(database_service_1.DatabaseService).useValue(db).compile();
    app = module.createNestApplication({ logger: false });
    (0, setup_1.configureApp)(app, ['http://localhost:5173']);
    await app.listen(0, '127.0.0.1');
    base = await app.getUrl();
});
(0, node_test_1.after)(async () => { await app?.close(); });
(0, node_test_1.test)('liveness stays healthy while readiness sanitizes database failure', async () => {
    unavailable = true;
    try {
        strict_1.default.equal((await fetch(`${base}/health/live`)).status, 200);
        const response = await fetch(`${base}/health/ready`);
        strict_1.default.equal(response.status, 503);
        strict_1.default.equal((await response.json()).message, 'Database not ready');
    }
    finally {
        unavailable = false;
    }
    strict_1.default.equal((await fetch(`${base}/health/ready`)).status, 200);
});
(0, node_test_1.test)('fleet filters and pagination return exact money strings with a public projection', async () => {
    const response = await fetch(`${base}/api/v1/vehicles?page=2&limit=3&branch=central&seats=5&transmission=AUTOMATIC`);
    strict_1.default.equal(response.status, 200);
    const body = await response.json();
    strict_1.default.equal(body.data[0].baseDailyMinor, '9007199254740993');
    strict_1.default.deepEqual(body.pagination, { page: 2, limit: 3, total: 1 });
    strict_1.default.equal(lastQuery.skip, 3);
    strict_1.default.equal(lastQuery.where.status, 'ACTIVE');
    strict_1.default.deepEqual(lastQuery.where.branch, { active: true, slug: 'central' });
    strict_1.default.deepEqual(lastQuery.where.seats, { gte: 5 });
    strict_1.default.equal(lastQuery.select.vin, undefined);
    strict_1.default.equal(lastQuery.select.registrationNumber, undefined);
});
(0, node_test_1.test)('invalid, oversized, repeated, and unknown query inputs are rejected', async () => {
    for (const query of ['page=0', 'limit=101', 'page=1.5', 'page=no', 'page=1&page=2', 'seats=0', 'transmission=CVT', 'branch=bad%20slug', 'status=ARCHIVED', 'pickupAt=2026-10-20']) {
        strict_1.default.equal((await fetch(`${base}/api/v1/vehicles?${query}`)).status, 400, query);
    }
});
(0, node_test_1.test)('vehicle detail is restricted to active vehicles at active branches', async () => {
    strict_1.default.equal((await fetch(`${base}/api/v1/vehicles/demo`)).status, 200);
    strict_1.default.deepEqual(lastQuery.where, { slug: 'demo', status: 'ACTIVE', branch: { active: true } });
    strict_1.default.equal((await fetch(`${base}/api/v1/vehicles/missing`)).status, 404);
});
(0, node_test_1.test)('catalog lookup routes and explicit CORS origins work', async () => {
    for (const route of ['branches', 'categories'])
        strict_1.default.equal((await fetch(`${base}/api/v1/${route}`)).status, 200);
    const allowed = await fetch(`${base}/health/live`, { headers: { Origin: 'http://localhost:5173' } });
    strict_1.default.equal(allowed.headers.get('access-control-allow-origin'), 'http://localhost:5173');
    const denied = await fetch(`${base}/health/live`, { headers: { Origin: 'https://untrusted.example' } });
    strict_1.default.equal(denied.headers.get('access-control-allow-origin'), null);
});
(0, node_test_1.test)('configuration rejects malformed URLs, wildcard origins and invalid ports', () => {
    const env = { DATABASE_URL: 'mysql://app:password@localhost:3306/lerviz' };
    strict_1.default.equal((0, config_1.readConfig)(env).port, 8000);
    for (const overrides of [{ DATABASE_URL: 'postgres://localhost/db' }, { DATABASE_URL: '' }, { PORT: '0' }, { CORS_ORIGINS: '*' }, { CORS_ORIGINS: 'https://example.com/path' }]) {
        strict_1.default.throws(() => (0, config_1.readConfig)({ ...env, ...overrides }));
    }
});
//# sourceMappingURL=api.test.js.map