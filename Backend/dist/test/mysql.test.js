"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const node_crypto_1 = require("node:crypto");
const node_test_1 = require("node:test");
const strict_1 = __importDefault(require("node:assert/strict"));
const testing_1 = require("@nestjs/testing");
const app_module_1 = require("../src/app.module");
const database_service_1 = require("../src/database.service");
const setup_1 = require("../src/setup");
(0, node_test_1.test)('MySQL: migrations, catalog filtering, visibility and public responses', { skip: !process.env.TEST_DATABASE_URL }, async () => {
    const url = process.env.TEST_DATABASE_URL;
    if (new URL(url).pathname !== '/lerviz_api_test')
        throw new Error('Integration tests require the isolated lerviz_api_test database');
    const db = new database_service_1.DatabaseService({ datasources: { db: { url } } });
    const key = (0, node_crypto_1.randomUUID)();
    const module = await testing_1.Test.createTestingModule({ imports: [app_module_1.AppModule] }).overrideProvider(database_service_1.DatabaseService).useValue(db).compile();
    const app = module.createNestApplication({ logger: false });
    (0, setup_1.configureApp)(app, ['http://localhost:5173']);
    try {
        const branch = await db.branch.create({ data: { slug: key, name: 'Test', timezone: 'UTC', address: 'Test' } });
        const category = await db.category.create({ data: { slug: key, name: key } });
        const common = { make: 'Test', model: 'Sedan', modelYear: 2025, seats: 5,
            transmission: 'AUTOMATIC', fuelType: 'HYBRID',
            baseDailyMinor: 9007199254740993n, currency: 'USD', branchId: branch.id, categoryId: category.id };
        for (const [index, status] of ['ACTIVE', 'MAINTENANCE', 'ARCHIVED'].entries()) {
            await db.vehicle.create({ data: { ...common, slug: `${key}-${index}`, status,
                    vin: `${key.replaceAll('-', '').slice(0, 16)}${index}`, registrationNumber: `${key.slice(0, 20)}-${index}` } });
        }
        await app.listen(0, '127.0.0.1');
        const base = await app.getUrl();
        strict_1.default.equal((await fetch(`${base}/health/ready`)).status, 200);
        const list = await fetch(`${base}/api/v1/vehicles?branch=${key}&category=${key}&fuelType=HYBRID`);
        strict_1.default.equal(list.status, 200);
        const body = await list.json();
        strict_1.default.equal(body.pagination.total, 1);
        strict_1.default.equal(body.data[0].baseDailyMinor, '9007199254740993');
        strict_1.default.equal('vin' in body.data[0], false);
        strict_1.default.equal('registrationNumber' in body.data[0], false);
        strict_1.default.equal((await (await fetch(`${base}/api/v1/vehicles?branch=${key}&seats=6`)).json()).pagination.total, 0);
        strict_1.default.equal((await (await fetch(`${base}/api/v1/vehicles?branch=${key}&page=2&limit=1`)).json()).data.length, 0);
        for (const index of [1, 2])
            strict_1.default.equal((await fetch(`${base}/api/v1/vehicles/${key}-${index}`)).status, 404);
        await db.branch.update({ where: { id: branch.id }, data: { active: false } });
        strict_1.default.equal((await fetch(`${base}/api/v1/vehicles/${key}-0`)).status, 404);
        strict_1.default.equal((await (await fetch(`${base}/api/v1/vehicles?branch=${key}`)).json()).pagination.total, 0);
    }
    finally {
        await db.vehicle.deleteMany({ where: { branch: { slug: key } } });
        await db.branch.deleteMany({ where: { slug: key } });
        await db.category.deleteMany({ where: { slug: key } });
        await app.close();
        await db.$disconnect();
    }
});
//# sourceMappingURL=mysql.test.js.map