import { Request, Response } from 'express';
import { ok } from '../../common/utils/response';
import { AuthService } from './auth.service';

export class AuthController {
  constructor(private readonly service = new AuthService()) {}
  register = async (req: Request, res: Response) => ok(res, await this.service.register(req.body), 201);
  login = async (req: Request, res: Response) => ok(res, await this.service.login(req.body));
  refresh = async (req: Request, res: Response) => ok(res, await this.service.refresh(req.body.refreshToken));
  logout = async (req: Request, res: Response) => { await this.service.logout(req.body.refreshToken); return ok(res, { revoked: true }); };
  me = async (req: Request, res: Response) => ok(res, await this.service.me(req.user!.id));
  changePassword = async (req: Request, res: Response) => { await this.service.changePassword(req.user!.id, req.body); return ok(res, { changed: true }); };
}
