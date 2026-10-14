import { Request, Response } from 'express';
import { ok } from '../../common/utils/response';
import { CustomersService } from './customers.service';
import { customerSearchSchema } from './customers.schema';

export class CustomersController {
  constructor(private readonly service = new CustomersService()) {}
  myProfile = async (req: Request, res: Response) => ok(res, await this.service.profile(req.user!.id));
  updateProfile = async (req: Request, res: Response) => ok(res, await this.service.updateProfile(req.user!.id, req.body));
  list = async (req: Request, res: Response) => { const result = await this.service.list(customerSearchSchema.parse(req.query)); return ok(res, result.data, 200, result.meta); };
  detail = async (req: Request, res: Response) => ok(res, await this.service.detail(String(req.params.id)));
  status = async (req: Request, res: Response) => ok(res, await this.service.status(String(req.params.id), req.body.isActive));
}
