import 'reflect-metadata';
import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { DatabaseService } from '../src/database.service';
import { configureApp } from '../src/setup';
import { readConfig } from '../src/config';

let app: INestApplication;
let base: string;
let unavailable = false;
let lastQuery: any;
const vehicle = {
  id: 'demo', slug: 'demo', make: 'Toyota', model: 'Corolla', modelYear: 2025, seats: 5,
  transmission: 'AUTOMATIC', fuelType: 'PETROL', baseDailyMinor: 9007199254740993n, currency: 'USD',
  branch: { slug: 'central', name: 'Central', timezone: 'UTC', address: 'Demo' },
  category: { slug: 'sedan', name: 'Sedan' }, images: [],
};
const db = {
  $queryRaw: async () => { if (unavailable) throw new Error('mysql://private-password@host'); return [{ value: 1 }]; },
  $transaction: async (queries: Promise<unknown>[]) => Promise.all(queries),
  vehicle: {
    findMany: async (query: unknown) => { lastQuery = query; return [vehicle]; },
    count: async () => 1,
    findFirst: async (query: any) => { lastQuery = query; return query.where.slug === 'demo' ? vehicle : null; },
  },
  branch: { findMany: async () => [vehicle.branch] },
  category: { findMany: async () => [vehicle.category] },
};

before(async () => {
  const module = await Test.createTestingModule({ imports: [AppModule] }).overrideProvider(DatabaseService).useValue(db).compile();
  app = module.createNestApplication({ logger: false });
  configureApp(app, ['http://localhost:5173']);
  await app.listen(0, '127.0.0.1');
  base = await app.getUrl();
});
after(async () => { await app?.close(); });

test('liveness stays healthy while readiness sanitizes database failure', async () => {
  unavailable = true;
  try {
    assert.equal((await fetch(`${base}/health/live`)).status, 200);
    const response = await fetch(`${base}/health/ready`);
    assert.equal(response.status, 503);
    assert.equal((await response.json()).message, 'Database not ready');
  } finally { unavailable = false; }
  assert.equal((await fetch(`${base}/health/ready`)).status, 200);
});

test('fleet filters and pagination return exact money strings with a public projection', async () => {
  const response = await fetch(`${base}/api/v1/vehicles?page=2&limit=3&branch=central&seats=5&transmission=AUTOMATIC`);
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.data[0].baseDailyMinor, '9007199254740993');
  assert.deepEqual(body.pagination, { page: 2, limit: 3, total: 1 });
  assert.equal(lastQuery.skip, 3);
  assert.equal(lastQuery.where.status, 'ACTIVE');
  assert.deepEqual(lastQuery.where.branch, { active: true, slug: 'central' });
  assert.deepEqual(lastQuery.where.seats, { gte: 5 });
  assert.equal(lastQuery.select.vin, undefined);
  assert.equal(lastQuery.select.registrationNumber, undefined);
});

test('invalid, oversized, repeated, and unknown query inputs are rejected', async () => {
  for (const query of ['page=0', 'limit=101', 'page=1.5', 'page=no', 'page=1&page=2', 'seats=0', 'transmission=CVT', 'branch=bad%20slug', 'status=ARCHIVED', 'pickupAt=2026-10-20']) {
    assert.equal((await fetch(`${base}/api/v1/vehicles?${query}`)).status, 400, query);
  }
});

test('vehicle detail is restricted to active vehicles at active branches', async () => {
  assert.equal((await fetch(`${base}/api/v1/vehicles/demo`)).status, 200);
  assert.deepEqual(lastQuery.where, { slug: 'demo', status: 'ACTIVE', branch: { active: true } });
  assert.equal((await fetch(`${base}/api/v1/vehicles/missing`)).status, 404);
});

test('catalog lookup routes and explicit CORS origins work', async () => {
  for (const route of ['branches', 'categories']) assert.equal((await fetch(`${base}/api/v1/${route}`)).status, 200);
  const allowed = await fetch(`${base}/health/live`, { headers: { Origin: 'http://localhost:5173' } });
  assert.equal(allowed.headers.get('access-control-allow-origin'), 'http://localhost:5173');
  const denied = await fetch(`${base}/health/live`, { headers: { Origin: 'https://untrusted.example' } });
  assert.equal(denied.headers.get('access-control-allow-origin'), null);
});

test('configuration rejects malformed URLs, wildcard origins and invalid ports', () => {
  const env = { DATABASE_URL: 'mysql://app:password@localhost:3306/lerviz' };
  assert.equal(readConfig(env).port, 8000);
  for (const overrides of [{ DATABASE_URL: 'postgres://localhost/db' }, { DATABASE_URL: '' }, { PORT: '0' }, { CORS_ORIGINS: '*' }, { CORS_ORIGINS: 'https://example.com/path' }]) {
    assert.throws(() => readConfig({ ...env, ...overrides }));
  }
});
