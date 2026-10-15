import { randomUUID } from 'node:crypto';
import { Express } from 'express';
import { PrismaClient } from '@prisma/client';
import request from 'supertest';

const databaseUrl = process.env.TEST_DATABASE_URL;
const run = databaseUrl ? describe : describe.skip;
const suffix = randomUUID().replace(/-/g, '').slice(0, 12);
const start = new Date(Date.now() + 10 * 86400000);
start.setUTCHours(12, 0, 0, 0);
const end = new Date(start.getTime() + 3 * 86400000);

run('PostgreSQL rental flow', () => {
  let app: Express;
  let db: PrismaClient;
  let locationId: string;
  let categoryId: string;
  const vehicleIds: string[] = [];
  const userIds: string[] = [];
  jest.setTimeout(30000);

  beforeAll(async () => {
    if (!databaseUrl || new URL(databaseUrl).pathname !== '/car_rental_test') throw new Error('TEST_DATABASE_URL must use the disposable car_rental_test database');
    process.env.DATABASE_URL = databaseUrl;
    process.env.CORS_ORIGIN = 'http://localhost:5173';
    process.env.JWT_ACCESS_SECRET = 'integration-access-secret-at-least-32-characters';
    process.env.JWT_REFRESH_SECRET = 'integration-refresh-secret-at-least-32-characters';
    db = new PrismaClient({ datasources: { db: { url: databaseUrl } } });
    app = (await import('../../src/app')).app;
    const location = await db.location.create({ data: { name: `Test Branch ${suffix}`, city: 'Karachi', address: 'Integration Street', phone: '+922100000001' } });
    locationId = location.id;
    const category = await db.vehicleCategory.create({ data: { name: `Test Category ${suffix}`, description: 'Disposable integration category', baseDailyRate: 70, depositAmount: 200 } });
    categoryId = category.id;
    for (let i = 0; i < 2; i++) {
      const vehicle = await db.vehicle.create({ data: {
        categoryId, locationId, make: 'Toyota', model: 'Test Car', year: 2024,
        plateNo: `IT-${suffix}-${i}`, vin: `IT${suffix}${String(i).padStart(3, '0')}`,
        transmission: 'AUTOMATIC', fuelType: 'PETROL', seats: 5, doors: 4,
        color: 'Silver', mileageKm: 1000, dailyRate: 70,
      } });
      vehicleIds.push(vehicle.id);
    }
  });

  afterAll(async () => {
    if (!db) return;
    await db.review.deleteMany({ where: { vehicleId: { in: vehicleIds } } });
    await db.payment.deleteMany({ where: { booking: { vehicleId: { in: vehicleIds } } } });
    await db.booking.deleteMany({ where: { vehicleId: { in: vehicleIds } } });
    await db.vehicle.deleteMany({ where: { id: { in: vehicleIds } } });
    if (categoryId) await db.vehicleCategory.delete({ where: { id: categoryId } });
    if (locationId) await db.location.delete({ where: { id: locationId } });
    await db.user.deleteMany({ where: { id: { in: userIds } } });
    await db.$disconnect();
    const shared = (await import('../../src/config/prisma')).prisma;
    await shared.$disconnect();
  });

  it('registers, books, pays, rejects overlaps, enforces ownership, and completes a rental', async () => {
    const tokens: string[] = [];
    for (let i = 0; i < 2; i++) {
      const email = `it-${suffix}-${i}@example.com`;
      const registration = await request(app).post('/api/v1/auth/register').send({ email, password: 'Customer@12345', fullName: `Test Customer ${i}` });
      expect(registration.status).toBe(201);
      userIds.push(registration.body.data.id);
      const login = await request(app).post('/api/v1/auth/login').send({ email, password: 'Customer@12345' });
      expect(login.status).toBe(200);
      tokens.push(login.body.data.accessToken);
      const profile = await request(app).put('/api/v1/customers/me/profile').set('Authorization', `Bearer ${tokens[i]}`).send({
        dateOfBirth: '1990-01-01', drivingLicenseNo: `DL-${suffix}-${i}`,
        licenseExpiry: '2035-01-01', address: '1 Integration Street', city: 'Karachi', country: 'Pakistan',
      });
      expect(profile.status).toBe(200);
    }

    const catalog = await request(app).get('/api/v1/vehicles').query({ category: categoryId });
    expect(catalog.status).toBe(200);
    expect(catalog.body.data).toHaveLength(2);
    const input = (vehicleId: string) => ({ vehicleId, pickupLocationId: locationId, dropoffLocationId: locationId, startAt: start.toISOString(), endAt: end.toISOString() });
    const quote = await request(app).post('/api/v1/bookings/quote').send(input(vehicleIds[0]));
    expect(quote.status).toBe(200);
    expect(quote.body.data.totalDays).toBe(3);

    const first = await request(app).post('/api/v1/bookings').set('Authorization', `Bearer ${tokens[0]}`).send(input(vehicleIds[0]));
    expect(first.status).toBe(201);
    const payment = await request(app).post(`/api/v1/bookings/${first.body.data.id}/payments`).set('Authorization', `Bearer ${tokens[0]}`).send({ method: 'CARD' });
    expect(payment.status).toBe(201);
    const otherCustomer = await request(app).get(`/api/v1/bookings/${first.body.data.id}`).set('Authorization', `Bearer ${tokens[1]}`);
    expect(otherCustomer.status).toBe(404);
    const overlap = await request(app).post('/api/v1/bookings').set('Authorization', `Bearer ${tokens[1]}`).send(input(vehicleIds[0]));
    expect(overlap.status).toBe(409);

    const competing = await Promise.all(tokens.map(token => request(app).post('/api/v1/bookings').set('Authorization', `Bearer ${token}`).send(input(vehicleIds[1]))));
    expect(competing.map(result => result.status).sort()).toEqual([201, 409]);
    const winnerIndex = competing[0].status === 201 ? 0 : 1;
    const secondId = competing[winnerIndex].body.data.id as string;

    const admin = await request(app).post('/api/v1/auth/login').send({ email: 'admin@carrental.com', password: 'Admin@12345' });
    expect(admin.status).toBe(200);
    const adminAuth = `Bearer ${admin.body.data.accessToken}`;
    const confirm = await request(app).patch(`/api/v1/admin/bookings/${secondId}/confirm`).set('Authorization', adminAuth);
    expect(confirm.status).toBe(200);
    const confirmedPayment = await request(app).post(`/api/v1/bookings/${secondId}/payments`).set('Authorization', `Bearer ${tokens[winnerIndex]}`).send({ method: 'CARD' });
    expect(confirmedPayment.status).toBe(201);
    const pickup = await request(app).patch(`/api/v1/admin/bookings/${secondId}/pickup`).set('Authorization', adminAuth);
    expect(pickup.status).toBe(200);
    await db.booking.update({ where: { id: secondId }, data: { startAt: new Date(Date.now() - 3 * 86400000), endAt: new Date(Date.now() - 86400000) } });
    const returned = await request(app).patch(`/api/v1/admin/bookings/${secondId}/return`).set('Authorization', adminAuth).send({ mileageKm: 1100 });
    expect(returned.status).toBe(200);
    expect(returned.body.data.status).toBe('COMPLETED');
    const review = await request(app).post(`/api/v1/bookings/${secondId}/review`).set('Authorization', `Bearer ${tokens[winnerIndex]}`).send({ rating: 5, comment: 'Excellent test rental.' });
    expect(review.status).toBe(201);
  });
});
