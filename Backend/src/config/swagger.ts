type Method = 'get' | 'post' | 'put' | 'patch' | 'delete';
type Access = 'public' | 'customer' | 'admin' | 'user';
type Operation = { method: Method; path: string; summary: string; access: Access; body?: Record<string, unknown>; query?: string[] };

const booking = {
  vehicleId: '00000000-0000-4000-8000-000000000001',
  pickupLocationId: '00000000-0000-4000-8000-000000000002',
  dropoffLocationId: '00000000-0000-4000-8000-000000000002',
  startAt: '2027-01-01T10:00:00.000Z', endAt: '2027-01-04T10:00:00.000Z', couponCode: 'WELCOME10',
};
const vehicle = {
  categoryId: '00000000-0000-4000-8000-000000000001', locationId: '00000000-0000-4000-8000-000000000002',
  make: 'Toyota', model: 'Corolla', year: 2024, plateNo: 'ABC-123', vin: '1HGCM82633A004352',
  transmission: 'AUTOMATIC', fuelType: 'PETROL', seats: 5, doors: 4, color: 'Silver', mileageKm: 12000, dailyRate: 75,
};
const profile = { dateOfBirth: '1995-05-15', drivingLicenseNo: 'DL-12345', licenseExpiry: '2030-12-31', address: '1 Main Street', city: 'Karachi', country: 'Pakistan' };
const coupon = { code: 'WELCOME10', discountType: 'PERCENT', value: 10, minDays: 1, validFrom: '2026-01-01T00:00:00.000Z', validTo: '2027-01-01T00:00:00.000Z', maxUses: 100, isActive: true };

const operations: Operation[] = [
  { method: 'post', path: '/auth/register', summary: 'Register a customer', access: 'public', body: { email: 'customer@example.com', password: 'Customer@12345', fullName: 'Jane Customer', phone: '+15550000000' } },
  { method: 'post', path: '/auth/login', summary: 'Sign in and receive access and refresh tokens', access: 'public', body: { email: 'customer@example.com', password: 'Customer@12345' } },
  { method: 'post', path: '/auth/refresh', summary: 'Rotate a refresh token', access: 'public', body: { refreshToken: 'previous-refresh-token' } },
  { method: 'post', path: '/auth/logout', summary: 'Revoke a refresh token', access: 'public', body: { refreshToken: 'current-refresh-token' } },
  { method: 'get', path: '/auth/me', summary: 'Get the signed-in account', access: 'user' },
  { method: 'patch', path: '/auth/change-password', summary: 'Change password and revoke sessions', access: 'user', body: { currentPassword: 'OldPassword123!', newPassword: 'NewPassword123!' } },
  { method: 'get', path: '/vehicles', summary: 'Search the available fleet', access: 'public', query: ['category', 'location', 'transmission', 'fuel', 'seats', 'minPrice', 'maxPrice', 'startDate', 'endDate', 'sort', 'page', 'limit'] },
  { method: 'get', path: '/vehicles/{id}', summary: 'Get vehicle details and average rating', access: 'public' },
  { method: 'get', path: '/vehicles/{id}/availability', summary: 'Get booked date ranges', access: 'public' },
  { method: 'get', path: '/vehicles/{id}/reviews', summary: 'Get public vehicle reviews', access: 'public', query: ['page', 'limit', 'sort'] },
  { method: 'get', path: '/categories', summary: 'List vehicle categories', access: 'public', query: ['page', 'limit', 'sort'] },
  { method: 'get', path: '/locations', summary: 'List active rental locations', access: 'public', query: ['page', 'limit', 'sort'] },
  { method: 'post', path: '/bookings/quote', summary: 'Preview rental pricing', access: 'public', body: booking },
  { method: 'get', path: '/customers/me/profile', summary: 'Get own rental profile', access: 'customer' },
  { method: 'put', path: '/customers/me/profile', summary: 'Complete own rental profile', access: 'customer', body: profile },
  { method: 'post', path: '/bookings', summary: 'Reserve an available vehicle', access: 'customer', body: booking },
  { method: 'get', path: '/bookings/my', summary: 'List own bookings', access: 'customer', query: ['status', 'page', 'limit', 'sort'] },
  { method: 'get', path: '/bookings/{id}', summary: 'Get own booking details', access: 'customer' },
  { method: 'post', path: '/bookings/{id}/cancel', summary: 'Cancel own reservation under refund policy', access: 'customer', body: { reason: 'Plans changed' } },
  { method: 'post', path: '/bookings/{id}/payments', summary: 'Pay rental, deposit, or late fee', access: 'customer', body: { method: 'CARD' } },
  { method: 'get', path: '/bookings/{id}/payments', summary: 'Get own booking payment history', access: 'customer' },
  { method: 'post', path: '/bookings/{id}/review', summary: 'Review a completed booking', access: 'customer', body: { rating: 5, comment: 'Clean car and excellent service.' } },
  { method: 'get', path: '/admin/dashboard', summary: 'Get fleet and revenue KPIs', access: 'admin' },
  { method: 'get', path: '/admin/reports/revenue', summary: 'Get settled revenue grouped by UTC day or month', access: 'admin', query: ['from', 'to', 'groupBy'] },
  { method: 'get', path: '/admin/reports/utilization', summary: 'Get fleet utilization within a date range', access: 'admin', query: ['from', 'to'] },
  { method: 'get', path: '/admin/bookings', summary: 'Search all bookings', access: 'admin', query: ['status', 'customerId', 'vehicleId', 'from', 'to', 'page', 'limit', 'sort'] },
  { method: 'patch', path: '/admin/bookings/{id}/confirm', summary: 'Confirm a pending booking', access: 'admin' },
  { method: 'patch', path: '/admin/bookings/{id}/reject', summary: 'Reject a pending booking', access: 'admin', body: { reason: 'Vehicle unavailable' } },
  { method: 'patch', path: '/admin/bookings/{id}/pickup', summary: 'Mark booking as active', access: 'admin' },
  { method: 'patch', path: '/admin/bookings/{id}/return', summary: 'Complete a booking and record return mileage', access: 'admin', body: { mileageKm: 12500, actualReturnAt: '2027-01-04T10:00:00.000Z' } },
  { method: 'get', path: '/admin/customers', summary: 'Search customer accounts', access: 'admin', query: ['search', 'page', 'limit', 'sort'] },
  { method: 'get', path: '/admin/customers/{id}', summary: 'Get customer profile and rental history', access: 'admin' },
  { method: 'patch', path: '/admin/customers/{id}/status', summary: 'Activate or deactivate a customer', access: 'admin', body: { isActive: false } },
  { method: 'get', path: '/admin/payments', summary: 'Search payment records', access: 'admin', query: ['status', 'from', 'to', 'page', 'limit', 'sort'] },
  { method: 'get', path: '/admin/reviews', summary: 'List customer reviews', access: 'admin', query: ['page', 'limit', 'sort'] },
  { method: 'delete', path: '/admin/reviews/{id}', summary: 'Moderate a review', access: 'admin' },
  { method: 'get', path: '/admin/vehicles', summary: 'Search all fleet vehicles', access: 'admin', query: ['category', 'location', 'transmission', 'fuel', 'seats', 'minPrice', 'maxPrice', 'sort', 'page', 'limit'] },
  { method: 'post', path: '/admin/vehicles', summary: 'Add a fleet vehicle', access: 'admin', body: vehicle },
  { method: 'get', path: '/admin/vehicles/{id}', summary: 'Get fleet vehicle details', access: 'admin' },
  { method: 'patch', path: '/admin/vehicles/{id}', summary: 'Update a fleet vehicle', access: 'admin', body: { dailyRate: 80, mileageKm: 12500 } },
  { method: 'delete', path: '/admin/vehicles/{id}', summary: 'Soft-delete a fleet vehicle', access: 'admin' },
  { method: 'post', path: '/admin/vehicles/{id}/images', summary: 'Add a vehicle image URL', access: 'admin', body: { url: 'https://example.com/car.jpg', isPrimary: true } },
  { method: 'get', path: '/admin/categories', summary: 'List categories for management', access: 'admin', query: ['page', 'limit', 'sort'] },
  { method: 'post', path: '/admin/categories', summary: 'Create a category', access: 'admin', body: { name: 'SUV', description: 'Sport utility vehicles', baseDailyRate: 95, depositAmount: 350 } },
  { method: 'get', path: '/admin/categories/{id}', summary: 'Get a category', access: 'admin' },
  { method: 'patch', path: '/admin/categories/{id}', summary: 'Update a category', access: 'admin', body: { baseDailyRate: 100 } },
  { method: 'delete', path: '/admin/categories/{id}', summary: 'Delete an unused category', access: 'admin' },
  { method: 'get', path: '/admin/locations', summary: 'List locations for management', access: 'admin', query: ['page', 'limit', 'sort'] },
  { method: 'post', path: '/admin/locations', summary: 'Create a rental location', access: 'admin', body: { name: 'Airport', city: 'Karachi', address: 'Terminal Road', phone: '+922100000000' } },
  { method: 'get', path: '/admin/locations/{id}', summary: 'Get a rental location', access: 'admin' },
  { method: 'patch', path: '/admin/locations/{id}', summary: 'Update a rental location', access: 'admin', body: { isActive: false } },
  { method: 'delete', path: '/admin/locations/{id}', summary: 'Delete an unused location', access: 'admin' },
  { method: 'get', path: '/admin/maintenance', summary: 'List maintenance logs', access: 'admin', query: ['vehicleId', 'status', 'page', 'limit', 'sort'] },
  { method: 'post', path: '/admin/maintenance', summary: 'Open a maintenance window', access: 'admin', body: { vehicleId: booking.vehicleId, type: 'SERVICE', description: 'Scheduled service', cost: 125, startDate: '2027-01-10T09:00:00.000Z' } },
  { method: 'get', path: '/admin/maintenance/{id}', summary: 'Get a maintenance log', access: 'admin' },
  { method: 'patch', path: '/admin/maintenance/{id}', summary: 'Update or close maintenance', access: 'admin', body: { status: 'CLOSED', endDate: '2027-01-11T09:00:00.000Z' } },
  { method: 'delete', path: '/admin/maintenance/{id}', summary: 'Delete a maintenance log', access: 'admin' },
  { method: 'get', path: '/admin/coupons', summary: 'List discount codes', access: 'admin', query: ['isActive', 'page', 'limit', 'sort'] },
  { method: 'post', path: '/admin/coupons', summary: 'Create a discount code', access: 'admin', body: coupon },
  { method: 'get', path: '/admin/coupons/{id}', summary: 'Get a discount code', access: 'admin' },
  { method: 'patch', path: '/admin/coupons/{id}', summary: 'Update or deactivate a discount code', access: 'admin', body: { isActive: false } },
  { method: 'delete', path: '/admin/coupons/{id}', summary: 'Delete an unused discount code', access: 'admin' },
];

const paths: Record<string, Record<string, unknown>> = {};
function exampleFor(operation: Operation) {
  const path = operation.path;
  if (path === '/auth/login') return { user: { id: booking.vehicleId, email: 'customer@example.com', role: 'CUSTOMER' }, accessToken: 'jwt-access-token', refreshToken: 'opaque-refresh-token', expiresIn: 900 };
  if (path === '/auth/refresh') return { accessToken: 'new-jwt-access-token', refreshToken: 'new-opaque-refresh-token', expiresIn: 900 };
  if (path === '/auth/logout') return { revoked: true };
  if (path === '/auth/change-password') return { changed: true };
  if (path === '/bookings/quote') return { totalDays: 3, subtotal: '225.00', discountAmount: '22.50', taxAmount: '20.25', depositAmount: '200.00', totalAmount: '222.75' };
  if (path === '/admin/dashboard') return { totalVehicles: 20, availableNow: 16, activeRentals: 2, pendingBookings: 2, customers: 3, revenue: { today: '210.00', month: '1880.00' }, fleetUtilizationPercent: 10 };
  if (path.includes('/reports/revenue')) return [{ period: '2027-01-01T00:00:00.000Z', revenue: '430.00' }];
  if (path.includes('/reports/utilization')) return { from: '2027-01-01T00:00:00.000Z', to: '2027-02-01T00:00:00.000Z', perVehicle: [], byCategory: [] };
  if (path.includes('/review')) return { id: booking.vehicleId, rating: 5, comment: 'Clean car and excellent service.' };
  if (path.includes('/payments')) return [{ id: booking.vehicleId, type: 'RENTAL', amount: '222.75', status: 'PAID' }];
  if (operation.method === 'get' && !path.includes('{id}') && path !== '/auth/me') return [];
  if (path.includes('/bookings')) return { id: booking.vehicleId, bookingNo: 'CR-20270101-ABC12345', status: 'PENDING', totalAmount: '222.75' };
  if (path.includes('/vehicles')) return { id: booking.vehicleId, make: 'Toyota', model: 'Corolla', dailyRate: '75.00' };
  return { id: booking.vehicleId };
}
for (const operation of operations) {
  const parameters = [
    ...(operation.path.includes('{id}') ? [{ in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } }] : []),
    ...(operation.query ?? []).map(name => ({ in: 'query', name, required: ['from', 'to'].includes(name) && operation.path.includes('/reports/'), schema: { type: 'string' } })),
  ];
  paths[operation.path] ??= {};
  paths[operation.path][operation.method] = {
    tags: [operation.path.split('/')[1] === 'admin' ? `admin ${operation.path.split('/')[2]}` : operation.path.split('/')[1]],
    summary: operation.summary,
    description: `Access: ${operation.access}. Responses use the standard success/error envelope.`,
    ...(operation.access !== 'public' && { security: [{ bearerAuth: [] }] }),
    ...(parameters.length && { parameters }),
    ...(operation.body && { requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', additionalProperties: true }, example: operation.body } } } }),
    responses: {
      [operation.method === 'delete' ? '204' : operation.method === 'post' && !['/auth/login', '/auth/refresh', '/auth/logout', '/bookings/quote', '/bookings/{id}/cancel'].includes(operation.path) ? '201' : '200']: { description: 'Success', ...(operation.method !== 'delete' && { content: { 'application/json': { example: { success: true, data: exampleFor(operation) } } } }) },
      '422': { description: 'Invalid input', content: { 'application/json': { example: { success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: [] } } } } },
      ...(operation.access !== 'public' && { '401': { description: 'Missing or invalid access token' }, '403': { description: 'Insufficient role' } }),
      '409': { description: 'Business rule conflict' },
    },
  };
}

export const swaggerDocument = {
  openapi: '3.0.3',
  info: { title: 'Car Rental API', version: '1.0.0', description: 'Fleet, reservations, payments, and administration.' },
  servers: [{ url: '/api/v1' }],
  components: { securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } } },
  paths,
};
