import { NextFunction, Request, Response } from 'express';
import AppError from './appError';

function globalErrorHandler(
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  const statusCode: number = (err as AppError).statusCode || 500;
  const msg: string = (err as AppError).message || 'Internal Server Error';
  const error = (err as AppError).error || 'Server Error';

  res.status(statusCode).json({
    msg,
    statusCode,
    error,
  });
}

export default globalErrorHandler;
