import { Router } from 'express';
import { authenticate, authorize } from '../../common/middleware/auth';
import { validate } from '../../common/middleware/validate';
import { CouponsController } from './coupons.controller';
import { couponIdSchema, couponSchema, couponUpdateSchema } from './coupons.schema';

const controller = new CouponsController();
export const couponAdminRoutes = Router();
couponAdminRoutes.use(authenticate, authorize('ADMIN'));
couponAdminRoutes.get('/', controller.list);
couponAdminRoutes.post('/', validate(couponSchema), controller.create);
couponAdminRoutes.get('/:id', validate(couponIdSchema, 'params'), controller.get);
couponAdminRoutes.patch('/:id', validate(couponIdSchema, 'params'), validate(couponUpdateSchema), controller.update);
couponAdminRoutes.delete('/:id', validate(couponIdSchema, 'params'), controller.remove);
