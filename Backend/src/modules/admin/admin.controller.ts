import { Request, Response } from 'express';
import { ok } from '../../common/utils/response';
import { AdminService } from './admin.service';
import { revenueSchema, utilizationSchema } from './admin.schema';

export class AdminController {
  constructor(private readonly service = new AdminService()) {}
  dashboard = async (_req: Request, res: Response) => ok(res, await this.service.dashboard());
  revenue = async (req: Request, res: Response) => ok(res, await this.service.revenue(revenueSchema.parse(req.query)));
  utilization = async (req: Request, res: Response) => ok(res, await this.service.utilization(utilizationSchema.parse(req.query)));
}
