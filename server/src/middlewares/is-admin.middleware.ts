import { NextFunction, Request, Response } from 'express';
import { Roles } from '../enums/roles.enum';
import AppError from '../utils/appError';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

interface CustomRequest extends Request {
  user: any;
}

function isAdmin(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;
  if (user.role === Roles.ADMIN) next();
  else
    return next(
      new AppError('Access is denied. Admins only', StatusCodes.FORBIDDEN, ReasonPhrases.FORBIDDEN),
    );
}

export default isAdmin;
