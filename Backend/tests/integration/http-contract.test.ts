import jwt from 'jsonwebtoken';
import request from 'supertest';

jest.mock('../../src/config/env', () => ({ env: {
  NODE_ENV: 'test', PORT: 8000, CORS_ORIGIN: 'http://localhost:5173',
  DATABASE_URL: 'postgresql://unused:unused@localhost:5432/unused',
  JWT_ACCESS_SECRET: 'test-access-secret-at-least-32-characters-long',
  JWT_REFRESH_SECRET: 'test-refresh-secret-at-least-32-characters-long',
} }));
jest.mock('../../src/config/prisma', () => ({ prisma: { user: { findFirst: jest.fn() } } }));

import { app } from '../../src/app';
import { prisma } from '../../src/config/prisma';

const userLookup = prisma.user.findFirst as jest.Mock;
const token = (role: 'CUSTOMER' | 'ADMIN') => jwt.sign({ role }, 'test-access-secret-at-least-32-characters-long', { subject: '00000000-0000-4000-8000-000000000001', expiresIn: '15m' });

describe('HTTP contract', () => {
  it('serves OpenAPI for the full route set', async () => {
    const response = await request(app).get('/api/docs.json');
    expect(response.status).toBe(200);
    expect(response.body.openapi).toBe('3.0.3');
    expect(response.body.paths['/admin/coupons/{id}'].patch.security).toEqual([{ bearerAuth: [] }]);
    expect(response.body.paths['/bookings/{id}/payments'].post).toBeDefined();
  });

  it('requires authentication on admin modules', async () => {
    const response = await request(app).get('/api/v1/admin/coupons');
    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe('UNAUTHENTICATED');
  });

  it('rejects a customer at admin routes', async () => {
    userLookup.mockResolvedValue({ id: '00000000-0000-4000-8000-000000000001', role: 'CUSTOMER' });
    const response = await request(app).get('/api/v1/admin/dashboard').set('Authorization', `Bearer ${token('CUSTOMER')}`);
    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe('FORBIDDEN');
  });

  it('validates public booking quotes before hitting the database', async () => {
    const response = await request(app).post('/api/v1/bookings/quote').send({ vehicleId: 'invalid' });
    expect(response.status).toBe(422);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });
});
