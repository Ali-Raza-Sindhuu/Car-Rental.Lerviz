import { Request, Response } from 'express';
import { ok } from '../../common/utils/response';
import { CategoriesService } from './categories.service';
import { categoryListSchema } from './categories.schema';

export class CategoriesController {
  constructor(private readonly service = new CategoriesService()) {}
  list = async (req: Request, res: Response) => { const result = await this.service.list(categoryListSchema.parse(req.query)); return ok(res, result.data, 200, result.meta); };
  create = async (req: Request, res: Response) => ok(res, await this.service.create(req.body), 201);
  get = async (req: Request, res: Response) => ok(res, await this.service.get(String(req.params.id)));
  update = async (req: Request, res: Response) => ok(res, await this.service.update(String(req.params.id), req.body));
  remove = async (req: Request, res: Response) => { await this.service.remove(String(req.params.id)); res.status(204).end(); };
}
