import { Request, Response } from 'express';
import { ok } from '../../common/utils/response';
import { MaintenanceService } from './maintenance.service';
import { maintenanceListSchema } from './maintenance.schema';

export class MaintenanceController {
  constructor(private readonly service = new MaintenanceService()) {}
  list = async (req: Request, res: Response) => { const result = await this.service.list(maintenanceListSchema.parse(req.query)); return ok(res, result.data, 200, result.meta); };
  get = async (req: Request, res: Response) => ok(res, await this.service.get(String(req.params.id)));
  create = async (req: Request, res: Response) => ok(res, await this.service.create(req.body), 201);
  update = async (req: Request, res: Response) => ok(res, await this.service.update(String(req.params.id), req.body));
  remove = async (req: Request, res: Response) => { await this.service.remove(String(req.params.id)); res.status(204).end(); };
}
