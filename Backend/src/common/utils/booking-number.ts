import { randomBytes } from 'node:crypto';

export function bookingNumber(now = new Date()) {
  return `CR-${now.toISOString().slice(0, 10).replaceAll('-', '')}-${randomBytes(4).toString('hex').toUpperCase()}`;
}
