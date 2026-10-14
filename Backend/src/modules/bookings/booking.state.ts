import { BookingStatus } from '@prisma/client';
import { AppError } from '../../common/errors/app-error';

const transitions: Record<BookingStatus, BookingStatus[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED', 'REJECTED'],
  CONFIRMED: ['ACTIVE', 'CANCELLED'],
  ACTIVE: ['COMPLETED'],
  COMPLETED: [], CANCELLED: [], REJECTED: [],
};

export function assertTransition(from: BookingStatus, to: BookingStatus) {
  if (!transitions[from].includes(to)) throw new AppError(409, 'INVALID_BOOKING_TRANSITION', `Cannot move booking from ${from} to ${to}`);
}
