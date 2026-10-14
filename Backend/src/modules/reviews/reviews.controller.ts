import { Request, Response } from 'express';
import { ok } from '../../common/utils/response';
import { ReviewsService } from './reviews.service';
import { reviewListSchema } from './reviews.schema';

export class ReviewsController {
  constructor(private readonly service = new ReviewsService()) {}
  create = async (req: Request, res: Response) => ok(res, await this.service.create(req.user!.id, String(req.params.id), req.body), 201);
  vehicleReviews = async (req: Request, res: Response) => { const result = await this.service.vehicleReviews(String(req.params.id), reviewListSchema.parse(req.query)); return ok(res, result.data, 200, result.meta); };
  list = async (req: Request, res: Response) => { const result = await this.service.list(reviewListSchema.parse(req.query)); return ok(res, result.data, 200, result.meta); };
  remove = async (req: Request, res: Response) => { await this.service.remove(String(req.params.id)); res.status(204).end(); };
}
