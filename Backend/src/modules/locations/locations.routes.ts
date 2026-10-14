import { Router } from 'express';
import { authenticate, authorize } from '../../common/middleware/auth';
import { validate } from '../../common/middleware/validate';
import { LocationsController } from './locations.controller';
import { locationIdSchema, locationSchema, locationUpdateSchema } from './locations.schema';

const controller = new LocationsController();
export const locationPublicRoutes = Router();
export const locationAdminRoutes = Router();
locationPublicRoutes.get('/', controller.list);
locationAdminRoutes.use(authenticate, authorize('ADMIN'));
locationAdminRoutes.get('/', controller.listAdmin);
locationAdminRoutes.post('/', validate(locationSchema), controller.create);
locationAdminRoutes.get('/:id', validate(locationIdSchema, 'params'), controller.get);
locationAdminRoutes.patch('/:id', validate(locationIdSchema, 'params'), validate(locationUpdateSchema), controller.update);
locationAdminRoutes.delete('/:id', validate(locationIdSchema, 'params'), controller.remove);
