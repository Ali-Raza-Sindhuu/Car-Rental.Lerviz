import { Role } from '@prisma/client';
import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { prisma } from '../../config/prisma';
import { AppError } from '../errors/app-error';

export type AuthUser = { id: string; role: Role };

export const authenticate: RequestHandler = async (req, _res, next) => {
  const token = req.headers.authorization?.match(/^Bearer (.+)$/i)?.[1];
  if (!token) return next(new AppError(401, 'UNAUTHENTICATED', 'Authentication required'));
  try {
    const claims = jwt.verify(token, env.JWT_ACCESS_SECRET) as jwt.JwtPayload;
    if (typeof claims.sub !== 'string' || !['ADMIN', 'CUSTOMER'].includes(String(claims.role))) throw new Error('Invalid claims');
    const user = await prisma.user.findFirst({ where: { id: claims.sub, role: claims.role as Role, isActive: true, deletedAt: null }, select: { id: true, role: true } });
    if (!user) throw new Error('Inactive account');
    req.user = user;
    next();
  } catch { next(new AppError(401, 'INVALID_TOKEN', 'Invalid or expired access token')); }
};

export function authorize(role: Role): RequestHandler {
  return (req, _res, next) => req.user?.role === role ? next() : next(new AppError(403, 'FORBIDDEN', 'Insufficient permission'));
}
