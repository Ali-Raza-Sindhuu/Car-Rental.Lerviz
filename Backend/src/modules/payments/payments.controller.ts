import { Request, Response } from 'express';
import { ok } from '../../common/utils/response';
import { PaymentsService } from './payments.service';
import { paymentListSchema } from './payments.schema';

export class PaymentsController {
  constructor(private readonly service = new PaymentsService()) {}
  pay = async (req: Request, res: Response) => ok(res, await this.service.pay(req.user!.id, String(req.params.id), req.body.method), 201);
  mine = async (req: Request, res: Response) => ok(res, await this.service.mine(req.user!.id, String(req.params.id)));
  list = async (req: Request, res: Response) => { const result = await this.service.list(paymentListSchema.parse(req.query)); return ok(res, result.data, 200, result.meta); };
}
