import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { authenticate } from '../../common/middleware/auth';
import { validate } from '../../common/middleware/validate';
import { AuthController } from './auth.controller';
import { AUTH } from '../../config/constants';
import { changePasswordSchema, loginSchema, refreshSchema, registerSchema } from './auth.schema';

const controller = new AuthController();
export const authRoutes = Router();
const loginLimit = rateLimit({ windowMs: AUTH.loginWindowMinutes * 60_000, limit: AUTH.loginAttempts, standardHeaders: 'draft-7', legacyHeaders: false });
authRoutes.post('/register', validate(registerSchema), controller.register);
authRoutes.post('/login', loginLimit, validate(loginSchema), controller.login);
authRoutes.post('/refresh', validate(refreshSchema), controller.refresh);
authRoutes.post('/logout', validate(refreshSchema), controller.logout);
authRoutes.get('/me', authenticate, controller.me);
authRoutes.patch('/change-password', authenticate, validate(changePasswordSchema), controller.changePassword);
