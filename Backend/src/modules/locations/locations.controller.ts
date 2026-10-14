import { Request, Response } from 'express';
import { ok } from '../../common/utils/response';
import { LocationsService } from './locations.service';
import { locationListSchema } from './locations.schema';

export class LocationsController {
  constructor(private readonly service = new LocationsService()) {}
  list = async (req: Request, res: Response) => { const result = await this.service.list(locationListSchema.parse(req.query)); return ok(res, result.data, 200, result.meta); };
  listAdmin = async (req: Request, res: Response) => { const result = await this.service.list(locationListSchema.parse(req.query), true); return ok(res, result.data, 200, result.meta); };
  get = async (req: Request, res: Response) => ok(res, await this.service.get(String(req.params.id)));
  create = async (req: Request, res: Response) => ok(res, await this.service.create(req.body), 201);
  update = async (req: Request, res: Response) => ok(res, await this.service.update(String(req.params.id), req.body));
  remove = async (req: Request, res: Response) => { await this.service.remove(String(req.params.id)); res.status(204).end(); };
}
