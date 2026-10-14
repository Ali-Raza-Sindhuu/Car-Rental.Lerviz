import { randomUUID } from 'node:crypto';
import { Prisma } from '@prisma/client';
import { AppError } from '../../../common/errors/app-error';
import { PaymentGateway } from './payment-gateway.interface';

export class MockPaymentGateway implements PaymentGateway {
  async charge(amount: Prisma.Decimal) {
    if (amount.lte(0)) throw new AppError(422, 'INVALID_PAYMENT', 'Payment amount must be positive');
    return { transactionRef: `MOCK-${randomUUID()}`, paidAt: new Date() };
  }
  async refund(amount: Prisma.Decimal) {
    if (amount.lte(0)) throw new AppError(422, 'INVALID_REFUND', 'Refund amount must be positive');
    return { transactionRef: `MOCK-REFUND-${randomUUID()}`, paidAt: new Date() };
  }
}

export const mockGateway = new MockPaymentGateway();
