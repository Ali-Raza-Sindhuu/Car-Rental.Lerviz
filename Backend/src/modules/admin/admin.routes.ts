import { Router } from 'express';
import { authenticate, authorize } from '../../common/middleware/auth';
import { AdminController } from './admin.controller';

const controller = new AdminController();
export const adminRoutes = Router();
adminRoutes.use(authenticate, authorize('ADMIN'));
adminRoutes.get('/dashboard', controller.dashboard);
adminRoutes.get('/reports/revenue', controller.revenue);
adminRoutes.get('/reports/utilization', controller.utilization);
