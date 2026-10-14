import { Router } from 'express';
import { authenticate, authorize } from '../../common/middleware/auth';
import { validate } from '../../common/middleware/validate';
import { ReviewsController } from './reviews.controller';
import { reviewIdSchema, reviewSchema } from './reviews.schema';

const controller = new ReviewsController();
export const reviewRoutes = Router();
export const reviewAdminRoutes = Router();
reviewRoutes.get('/vehicles/:id/reviews', validate(reviewIdSchema, 'params'), controller.vehicleReviews);
reviewRoutes.post('/bookings/:id/review', authenticate, authorize('CUSTOMER'), validate(reviewIdSchema, 'params'), validate(reviewSchema), controller.create);
reviewAdminRoutes.use(authenticate, authorize('ADMIN'));
reviewAdminRoutes.get('/', controller.list);
reviewAdminRoutes.delete('/:id', validate(reviewIdSchema, 'params'), controller.remove);
