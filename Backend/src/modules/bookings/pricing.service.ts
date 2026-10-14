import { Prisma } from '@prisma/client';
import { RENTAL } from '../../config/constants';
import { AppError } from '../../common/errors/app-error';

const money = (value: Prisma.Decimal | number | string) => new Prisma.Decimal(value).toDecimalPlaces(2);

export type PricingCoupon = { discountType: 'PERCENT' | 'FIXED'; value: Prisma.Decimal };

/** Uses decimal arithmetic and snapshots the quoted daily rate. */
export function priceRental(start: Date, end: Date, dailyRate: Prisma.Decimal, deposit: Prisma.Decimal, coupon?: PricingCoupon) {
  const totalDays = Math.ceil((end.getTime() - start.getTime()) / 86400000);
  const subtotal = money(dailyRate.mul(totalDays));
  const longDiscount = totalDays >= RENTAL.longRentalDays ? money(subtotal.mul(RENTAL.longRentalDiscount)) : money(0);
  const afterLong = subtotal.sub(longDiscount);
  const couponDiscount = coupon ? money(coupon.discountType === 'PERCENT' ? afterLong.mul(coupon.value).div(100) : Prisma.Decimal.min(afterLong, coupon.value)) : money(0);
  const discountAmount = money(longDiscount.add(couponDiscount));
  const taxable = subtotal.sub(discountAmount);
  const taxAmount = money(taxable.mul(RENTAL.taxRate));
  return { dailyRateSnapshot: money(dailyRate), totalDays, subtotal, discountAmount, taxAmount, depositAmount: money(deposit), totalAmount: money(taxable.add(taxAmount)) };
}

/** Charges a rounded-up extra day at the configured late-return multiplier. */
export function lateFee(end: Date, actual: Date, dailyRate: Prisma.Decimal) {
  if (actual <= end) return money(0);
  const extraDays = Math.ceil((actual.getTime() - end.getTime()) / 86400000);
  return money(dailyRate.mul(extraDays).mul(RENTAL.lateFeeMultiplier));
}

export function refundFraction(start: Date, cancelledAt: Date) {
  const hours = (start.getTime() - cancelledAt.getTime()) / 3600000;
  if (hours >= RENTAL.freeCancellationHours) return 1;
  if (hours >= RENTAL.halfRefundHours) return 0.5;
  return 0;
}

export function validateRentalDates(start: Date, end: Date, now = new Date()) {
  const duration = end.getTime() - start.getTime();
  if (!Number.isFinite(duration) || start <= now || duration < RENTAL.minDays * 86400000 || duration > RENTAL.maxDays * 86400000) throw new AppError(422, 'INVALID_RENTAL_DATES', `Rental must start in the future and last ${RENTAL.minDays}–${RENTAL.maxDays} days`);
}
