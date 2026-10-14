export const RENTAL = {
  minAge: 21,
  minDays: 1,
  maxDays: 30,
  longRentalDays: 7,
  longRentalDiscount: 0.1,
  taxRate: 0.1,
  lateFeeMultiplier: 1.5,
  freeCancellationHours: 48,
  halfRefundHours: 24,
} as const;

export const AUTH = { accessMinutes: 15, refreshDays: 7, bcryptRounds: 12, loginWindowMinutes: 15, loginAttempts: 10 } as const;
export const PAGINATION = { defaultPage: 1, defaultLimit: 10, maxLimit: 100 } as const;
