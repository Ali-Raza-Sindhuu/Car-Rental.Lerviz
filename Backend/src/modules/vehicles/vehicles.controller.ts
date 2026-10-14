import { Request, Response } from 'express';
import { ok } from '../../common/utils/response';
import { VehiclesService } from './vehicles.service';
import { vehicleSearchSchema } from './vehicles.schema';

export class VehiclesController {
  constructor(private readonly service = new VehiclesService()) {}
  search = async (req: Request, res: Response) => { const result = await this.service.search(vehicleSearchSchema.parse(req.query)); return ok(res, result.data, 200, result.meta); };
  searchAdmin = async (req: Request, res: Response) => { const result = await this.service.search(vehicleSearchSchema.parse(req.query), true); return ok(res, result.data, 200, result.meta); };
  get = async (req: Request, res: Response) => ok(res, await this.service.get(String(req.params.id)));
  getAdmin = async (req: Request, res: Response) => ok(res, await this.service.get(String(req.params.id), true));
  availability = async (req: Request, res: Response) => ok(res, await this.service.availability(String(req.params.id)));
  create = async (req: Request, res: Response) => ok(res, await this.service.create(req.body), 201);
  update = async (req: Request, res: Response) => ok(res, await this.service.update(String(req.params.id), req.body));
  remove = async (req: Request, res: Response) => { await this.service.remove(String(req.params.id)); res.status(204).end(); };
  addImage = async (req: Request, res: Response) => ok(res, await this.service.addImage(String(req.params.id), req.body), 201);
}
