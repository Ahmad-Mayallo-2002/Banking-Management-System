import { config } from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import AppError from '../utils/appError';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
config();

function authorization(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token: string | undefined = authHeader?.split(' ')[1];
  if (!token) {
    return next(
      new AppError(
        'Access denied. Token missing.',
        StatusCodes.UNAUTHORIZED,
        ReasonPhrases.UNAUTHORIZED,
      ),
    );
  }

  verify(token, `${process.env.JWT_SECRET}`, (err, decoded) => {
    if (err) {
      return next(
        new AppError(
          'Invalid or expired token.',
          StatusCodes.UNAUTHORIZED,
          ReasonPhrases.UNAUTHORIZED,
        ),
      );
    }

    console.log(decoded);
    // req.user = decoded;
    next();
  });
}

export default authorization;
