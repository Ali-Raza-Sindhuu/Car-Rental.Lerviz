import { Router } from 'express';
import { authenticate, authorize } from '../../common/middleware/auth';
import { validate } from '../../common/middleware/validate';
import { MaintenanceController } from './maintenance.controller';
import { maintenanceIdSchema, maintenanceSchema, maintenanceUpdateSchema } from './maintenance.schema';

const controller = new MaintenanceController();
export const maintenanceAdminRoutes = Router();
maintenanceAdminRoutes.use(authenticate, authorize('ADMIN'));
maintenanceAdminRoutes.get('/', controller.list);
maintenanceAdminRoutes.post('/', validate(maintenanceSchema), controller.create);
maintenanceAdminRoutes.get('/:id', validate(maintenanceIdSchema, 'params'), controller.get);
maintenanceAdminRoutes.patch('/:id', validate(maintenanceIdSchema, 'params'), validate(maintenanceUpdateSchema), controller.update);
maintenanceAdminRoutes.delete('/:id', validate(maintenanceIdSchema, 'params'), controller.remove);
