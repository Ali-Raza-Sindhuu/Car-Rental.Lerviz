import { RequestHandler } from 'express';
import { z } from 'zod';

export function validate(schema: z.ZodType, source: 'body' | 'query' | 'params' = 'body'): RequestHandler {
  return (req, _res, next) => {
    try {
      const value = schema.parse(req[source]);
      if (source === 'body') req.body = value;
      else if (source === 'query') req.validatedQuery = value;
      next();
    } catch (error) { next(error); }
  };
}
