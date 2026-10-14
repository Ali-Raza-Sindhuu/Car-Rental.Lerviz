import { Response } from 'express';

export function ok(res: Response, data: unknown, status = 200, meta?: unknown) {
  return res.status(status).json({ success: true, data, ...(meta ? { meta } : {}) });
}
