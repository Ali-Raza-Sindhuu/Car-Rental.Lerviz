import 'reflect-metadata';
import { randomUUID } from 'node:crypto';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { DatabaseService } from '../src/database.service';
import { configureApp } from '../src/setup';

test('MySQL: migrations, catalog filtering, visibility and public responses', { skip: !process.env.TEST_DATABASE_URL }, async () => {
  const url = process.env.TEST_DATABASE_URL!;
  if (new URL(url).pathname !== '/lerviz_api_test') throw new Error('Integration tests require the isolated lerviz_api_test database');
  const db = new DatabaseService({ datasources: { db: { url } } });
  const key = randomUUID();
  const module = await Test.createTestingModule({ imports: [AppModule] }).overrideProvider(DatabaseService).useValue(db).compile();
  const app = module.createNestApplication({ logger: false });
  configureApp(app, ['http://localhost:5173']);
  try {
    const branch = await db.branch.create({ data: { slug: key, name: 'Test', timezone: 'UTC', address: 'Test' } });
    const category = await db.category.create({ data: { slug: key, name: key } });
    const common = { make: 'Test', model: 'Sedan', modelYear: 2025, seats: 5,
      transmission: 'AUTOMATIC' as const, fuelType: 'HYBRID' as const,
      baseDailyMinor: 9007199254740993n, currency: 'USD', branchId: branch.id, categoryId: category.id };
    for (const [index, status] of (['ACTIVE', 'MAINTENANCE', 'ARCHIVED'] as const).entries()) {
      await db.vehicle.create({ data: { ...common, slug: `${key}-${index}`, status,
        vin: `${key.replaceAll('-', '').slice(0, 16)}${index}`, registrationNumber: `${key.slice(0, 20)}-${index}` } });
    }
    await app.listen(0, '127.0.0.1');
    const base = await app.getUrl();
    assert.equal((await fetch(`${base}/health/ready`)).status, 200);
    const list = await fetch(`${base}/api/v1/vehicles?branch=${key}&category=${key}&fuelType=HYBRID`);
    assert.equal(list.status, 200);
    const body = await list.json();
    assert.equal(body.pagination.total, 1);
    assert.equal(body.data[0].baseDailyMinor, '9007199254740993');
    assert.equal('vin' in body.data[0], false);
    assert.equal('registrationNumber' in body.data[0], false);
    assert.equal((await (await fetch(`${base}/api/v1/vehicles?branch=${key}&seats=6`)).json()).pagination.total, 0);
    assert.equal((await (await fetch(`${base}/api/v1/vehicles?branch=${key}&page=2&limit=1`)).json()).data.length, 0);
    for (const index of [1, 2]) assert.equal((await fetch(`${base}/api/v1/vehicles/${key}-${index}`)).status, 404);
    await db.branch.update({ where: { id: branch.id }, data: { active: false } });
    assert.equal((await fetch(`${base}/api/v1/vehicles/${key}-0`)).status, 404);
    assert.equal((await (await fetch(`${base}/api/v1/vehicles?branch=${key}`)).json()).pagination.total, 0);
  } finally {
    await db.vehicle.deleteMany({ where: { branch: { slug: key } } });
    await db.branch.deleteMany({ where: { slug: key } });
    await db.category.deleteMany({ where: { slug: key } });
    await app.close();
    await db.$disconnect();
  }
});
