import { Request, Response } from 'express';
import { ok } from '../../common/utils/response';
import { BookingsService } from './bookings.service';
import { BookingAdminService } from './booking-admin.service';
import { bookingListSchema } from './bookings.schema';

export class BookingsController {
  constructor(private readonly service = new BookingsService(), private readonly admin = new BookingAdminService()) {}
  quote = async (req: Request, res: Response) => ok(res, await this.service.quote(req.body));
  create = async (req: Request, res: Response) => ok(res, await this.service.create(req.user!.id, req.body), 201);
  mine = async (req: Request, res: Response) => { const result = await this.service.mine(req.user!.id, bookingListSchema.parse(req.query)); return ok(res, result.data, 200, result.meta); };
  detail = async (req: Request, res: Response) => ok(res, await this.service.detail(req.user!.id, String(req.params.id)));
  cancel = async (req: Request, res: Response) => ok(res, await this.service.cancel(req.user!.id, String(req.params.id), req.body.reason));
  listAdmin = async (req: Request, res: Response) => { const result = await this.admin.list(bookingListSchema.parse(req.query)); return ok(res, result.data, 200, result.meta); };
  confirm = async (req: Request, res: Response) => ok(res, await this.admin.confirm(String(req.params.id)));
  reject = async (req: Request, res: Response) => ok(res, await this.admin.reject(String(req.params.id), req.body.reason));
  pickup = async (req: Request, res: Response) => ok(res, await this.admin.pickup(String(req.params.id)));
  returnVehicle = async (req: Request, res: Response) => ok(res, await this.admin.returnVehicle(String(req.params.id), req.body.mileageKm, req.body.actualReturnAt ? new Date(req.body.actualReturnAt) : undefined));
}
