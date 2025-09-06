import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

function validateBody(schema: z.ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: error._zod.def,
        });
      }
      next(error);
    }
  };
}

export default validateBody;
