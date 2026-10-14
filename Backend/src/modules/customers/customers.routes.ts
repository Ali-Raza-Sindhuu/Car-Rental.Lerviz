import { Router } from 'express';
import { authenticate, authorize } from '../../common/middleware/auth';
import { validate } from '../../common/middleware/validate';
import { CustomersController } from './customers.controller';
import { customerIdSchema, customerStatusSchema, profileSchema } from './customers.schema';

const controller = new CustomersController();
export const customerRoutes = Router();
export const customerAdminRoutes = Router();
customerRoutes.use(authenticate, authorize('CUSTOMER'));
customerRoutes.get('/me/profile', controller.myProfile);
customerRoutes.put('/me/profile', validate(profileSchema), controller.updateProfile);
customerAdminRoutes.use(authenticate, authorize('ADMIN'));
customerAdminRoutes.get('/', controller.list);
customerAdminRoutes.get('/:id', validate(customerIdSchema, 'params'), controller.detail);
customerAdminRoutes.patch('/:id/status', validate(customerIdSchema, 'params'), validate(customerStatusSchema), controller.status);
