import { Router } from 'express';
import { authenticate, authorize } from '../../common/middleware/auth';
import { validate } from '../../common/middleware/validate';
import { CategoriesController } from './categories.controller';
import { categoryIdSchema, categorySchema, categoryUpdateSchema } from './categories.schema';

const controller = new CategoriesController();
export const categoryPublicRoutes = Router();
export const categoryAdminRoutes = Router();
categoryPublicRoutes.get('/', controller.list);
categoryAdminRoutes.use(authenticate, authorize('ADMIN'));
categoryAdminRoutes.get('/', controller.list);
categoryAdminRoutes.post('/', validate(categorySchema), controller.create);
categoryAdminRoutes.get('/:id', validate(categoryIdSchema, 'params'), controller.get);
categoryAdminRoutes.patch('/:id', validate(categoryIdSchema, 'params'), validate(categoryUpdateSchema), controller.update);
categoryAdminRoutes.delete('/:id', validate(categoryIdSchema, 'params'), controller.remove);
