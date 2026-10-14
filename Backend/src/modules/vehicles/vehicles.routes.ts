import { Router } from 'express';
import { authenticate, authorize } from '../../common/middleware/auth';
import { validate } from '../../common/middleware/validate';
import { VehiclesController } from './vehicles.controller';
import { vehicleIdSchema, vehicleImageSchema, vehicleSchema, vehicleUpdateSchema } from './vehicles.schema';

const controller = new VehiclesController();
export const vehiclePublicRoutes = Router();
export const vehicleAdminRoutes = Router();
vehiclePublicRoutes.get('/', controller.search);
vehiclePublicRoutes.get('/:id/availability', validate(vehicleIdSchema, 'params'), controller.availability);
vehiclePublicRoutes.get('/:id', validate(vehicleIdSchema, 'params'), controller.get);
vehicleAdminRoutes.use(authenticate, authorize('ADMIN'));
vehicleAdminRoutes.get('/', controller.searchAdmin);
vehicleAdminRoutes.post('/', validate(vehicleSchema), controller.create);
vehicleAdminRoutes.get('/:id', validate(vehicleIdSchema, 'params'), controller.getAdmin);
vehicleAdminRoutes.patch('/:id', validate(vehicleIdSchema, 'params'), validate(vehicleUpdateSchema), controller.update);
vehicleAdminRoutes.delete('/:id', validate(vehicleIdSchema, 'params'), controller.remove);
vehicleAdminRoutes.post('/:id/images', validate(vehicleIdSchema, 'params'), validate(vehicleImageSchema), controller.addImage);
