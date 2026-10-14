import { Router } from 'express';
import { authenticate, authorize } from '../../common/middleware/auth';
import { validate } from '../../common/middleware/validate';
import { PaymentsController } from './payments.controller';
import { paymentBookingIdSchema, paymentSchema } from './payments.schema';

const controller = new PaymentsController();
export const paymentRoutes = Router();
export const paymentAdminRoutes = Router();
paymentRoutes.post('/bookings/:id/payments', authenticate, authorize('CUSTOMER'), validate(paymentBookingIdSchema, 'params'), validate(paymentSchema), controller.pay);
paymentRoutes.get('/bookings/:id/payments', authenticate, authorize('CUSTOMER'), validate(paymentBookingIdSchema, 'params'), controller.mine);
paymentAdminRoutes.use(authenticate, authorize('ADMIN'));
paymentAdminRoutes.get('/', controller.list);
