import { Prisma, VehicleStatus } from '@prisma/client';
import { AppError } from '../../src/common/errors/app-error';
import { assertAvailable } from '../../src/modules/bookings/availability.service';
import { assertTransition } from '../../src/modules/bookings/booking.state';
import { lateFee, priceRental, refundFraction, validateRentalDates } from '../../src/modules/bookings/pricing.service';

const dec = (value: number) => new Prisma.Decimal(value);
const start = new Date('2027-01-01T00:00:00.000Z');

describe('rental pricing and policy', () => {
  it('rounds partial days and applies tax', () => {
    const quote = priceRental(start, new Date('2027-01-02T01:00:00.000Z'), dec(100), dec(200));
    expect(quote.totalDays).toBe(2);
    expect(quote.totalAmount.toString()).toBe('220');
    expect(quote.depositAmount.toString()).toBe('200');
  });

  it('stacks a coupon after the weekly discount and caps fixed discounts', () => {
    const end = new Date('2027-01-08T00:00:00.000Z');
    const percent = priceRental(start, end, dec(100), dec(200), { discountType: 'PERCENT', value: dec(10) });
    expect(percent.discountAmount.toString()).toBe('133');
    expect(percent.totalAmount.toString()).toBe('623.7');
    const fixed = priceRental(start, end, dec(100), dec(200), { discountType: 'FIXED', value: dec(1000) });
    expect(fixed.totalAmount.toString()).toBe('0');
  });

  it('calculates all refund tiers and rounds late return to a day', () => {
    expect(refundFraction(start, new Date('2026-12-29T00:00:00Z'))).toBe(1);
    expect(refundFraction(start, new Date('2026-12-30T12:00:00Z'))).toBe(0.5);
    expect(refundFraction(start, new Date('2026-12-31T12:00:00Z'))).toBe(0);
    expect(lateFee(start, new Date('2027-01-01T01:00:00Z'), dec(100)).toString()).toBe('150');
  });

  it('rejects a rental shorter than one day', () => {
    expect(() => validateRentalDates(start, new Date('2027-01-01T23:00:00Z'), new Date('2026-01-01'))).toThrow(AppError);
  });
});

describe('booking availability and transitions', () => {
  it('accepts the intended lifecycle and rejects invalid transitions', () => {
    expect(() => assertTransition('PENDING', 'CONFIRMED')).not.toThrow();
    expect(() => assertTransition('CONFIRMED', 'ACTIVE')).not.toThrow();
    expect(() => assertTransition('ACTIVE', 'COMPLETED')).not.toThrow();
    expect(() => assertTransition('COMPLETED', 'CANCELLED')).toThrow(AppError);
  });

  it('rejects overlap while allowing adjacent half-open ranges', async () => {
    const bookingFindFirst = jest.fn().mockResolvedValueOnce(null).mockResolvedValueOnce({ id: 'booked' });
    const db = {
      vehicle: { findFirst: jest.fn().mockResolvedValue({ status: VehicleStatus.AVAILABLE }) },
      booking: { findFirst: bookingFindFirst },
      maintenanceLog: { findFirst: jest.fn().mockResolvedValue(null) },
    } as unknown as Prisma.TransactionClient;
    await expect(assertAvailable(db, 'vehicle', start, new Date('2027-01-02'))).resolves.toBeUndefined();
    expect(bookingFindFirst).toHaveBeenCalledWith(expect.objectContaining({ where: expect.objectContaining({ startAt: { lt: new Date('2027-01-02') }, endAt: { gt: start } }) }));
    await expect(assertAvailable(db, 'vehicle', start, new Date('2027-01-02'))).rejects.toMatchObject({ code: 'BOOKING_OVERLAP', status: 409 });
  });
});
