import { createHash, randomBytes } from 'node:crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Prisma, PrismaClient, Role } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { env } from '../../config/env';
import { AUTH } from '../../config/constants';
import { AppError } from '../../common/errors/app-error';
import { z } from 'zod';
import { changePasswordSchema, loginSchema, registerSchema } from './auth.schema';

type Register = z.infer<typeof registerSchema>;
type Login = z.infer<typeof loginSchema>;
type ChangePassword = z.infer<typeof changePasswordSchema>;

export class AuthService {
  constructor(private readonly db: PrismaClient = prisma) {}

  private publicUser(user: { id: string; email: string; fullName: string; role: Role; phone: string | null }) {
    return { id: user.id, email: user.email, fullName: user.fullName, role: user.role, phone: user.phone };
  }

  private async tokens(user: { id: string; role: Role }, db: PrismaClient | Prisma.TransactionClient = this.db) {
    const accessToken = jwt.sign({ role: user.role }, env.JWT_ACCESS_SECRET, { subject: user.id, expiresIn: AUTH.accessMinutes * 60 });
    const refreshToken = randomBytes(48).toString('base64url');
    await db.refreshToken.create({ data: { userId: user.id, tokenHash: createHash('sha256').update(refreshToken).digest('hex'), expiresAt: new Date(Date.now() + AUTH.refreshDays * 86400000) } });
    return { accessToken, refreshToken, expiresIn: AUTH.accessMinutes * 60 };
  }

  /** Creates only CUSTOMER accounts; ADMIN accounts are seeded. */
  async register(input: Register) {
    const email = input.email.toLowerCase();
    const passwordHash = await bcrypt.hash(input.password, AUTH.bcryptRounds);
    const user = await this.db.user.create({ data: { email, passwordHash, fullName: input.fullName, phone: input.phone, role: 'CUSTOMER' } });
    return this.publicUser(user);
  }

  /** Issues a short-lived access token and a persisted, hashed refresh token. */
  async login(input: Login) {
    const user = await this.db.user.findUnique({ where: { email: input.email.toLowerCase() } });
    if (!user || !user.isActive || user.deletedAt || !(await bcrypt.compare(input.password, user.passwordHash))) throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
    return { user: this.publicUser(user), ...(await this.tokens(user)) };
  }

  /** Revokes the old refresh token atomically before issuing a replacement. */
  async refresh(raw: string) {
    const tokenHash = createHash('sha256').update(raw).digest('hex');
    const record = await this.db.refreshToken.findUnique({ where: { tokenHash }, include: { user: true } });
    if (!record || record.revokedAt || record.expiresAt <= new Date() || !record.user.isActive || record.user.deletedAt) throw new AppError(401, 'INVALID_REFRESH_TOKEN', 'Refresh token is invalid or expired');
    return this.db.$transaction(async tx => {
      const changed = await tx.refreshToken.updateMany({ where: { id: record.id, revokedAt: null }, data: { revokedAt: new Date() } });
      if (!changed.count) throw new AppError(401, 'INVALID_REFRESH_TOKEN', 'Refresh token has already been used');
      return this.tokens(record.user, tx);
    });
  }

  /** Revokes the presented refresh token. */
  async logout(raw: string) {
    await this.db.refreshToken.updateMany({ where: { tokenHash: createHash('sha256').update(raw).digest('hex'), revokedAt: null }, data: { revokedAt: new Date() } });
  }

  async me(id: string) {
    const user = await this.db.user.findFirst({ where: { id, isActive: true, deletedAt: null } });
    if (!user) throw new AppError(401, 'UNAUTHENTICATED', 'Account is inactive');
    return this.publicUser(user);
  }

  async changePassword(id: string, input: ChangePassword) {
    const user = await this.db.user.findUnique({ where: { id } });
    if (!user || !(await bcrypt.compare(input.currentPassword, user.passwordHash))) throw new AppError(401, 'INVALID_CREDENTIALS', 'Current password is incorrect');
    const passwordHash = await bcrypt.hash(input.newPassword, AUTH.bcryptRounds);
    await this.db.$transaction([
      this.db.user.update({ where: { id }, data: { passwordHash } }),
      this.db.refreshToken.updateMany({ where: { userId: id, revokedAt: null }, data: { revokedAt: new Date() } }),
    ]);
  }
}
