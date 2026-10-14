import { Router } from 'express';
import { authRoutes } from './modules/auth/auth.routes';
import { categoryAdminRoutes, categoryPublicRoutes } from './modules/categories/categories.routes';
import { locationAdminRoutes, locationPublicRoutes } from './modules/locations/locations.routes';
import { vehicleAdminRoutes, vehiclePublicRoutes } from './modules/vehicles/vehicles.routes';

export const apiRoutes = Router();
apiRoutes.use('/auth', authRoutes);
apiRoutes.use('/categories', categoryPublicRoutes);
apiRoutes.use('/locations', locationPublicRoutes);
apiRoutes.use('/vehicles', vehiclePublicRoutes);
apiRoutes.use('/admin/categories', categoryAdminRoutes);
apiRoutes.use('/admin/locations', locationAdminRoutes);
apiRoutes.use('/admin/vehicles', vehicleAdminRoutes);
