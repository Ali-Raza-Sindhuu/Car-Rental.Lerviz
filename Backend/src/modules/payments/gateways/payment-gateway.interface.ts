import { Prisma } from '@prisma/client';

export interface PaymentGateway {
  charge(amount: Prisma.Decimal): Promise<{ transactionRef: string; paidAt: Date }>;
  refund(amount: Prisma.Decimal): Promise<{ transactionRef: string; paidAt: Date }>;
}
