import { OAuth2Client } from 'google-auth-library';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import AppError from '../utils/appError';
import { NextFunction, Request, Response } from 'express';
import { config } from 'dotenv';

config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export default async function authorization(req: Request, res: Response, next: NextFunction) {
  const idToken = (req?.user as any)?.idToken || req.headers.authorization?.split(' ')[1];

  if (!idToken) {
    return next(
      new AppError(
        'Access denied. Token missing.',
        StatusCodes.UNAUTHORIZED,
        ReasonPhrases.UNAUTHORIZED,
      ),
    );
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    (req).user = payload; // Google user info
    (req as any).user.token = idToken;
    next();
  } catch (err) {
    return next(
      new AppError(
        'Invalid or expired Google token.',
        StatusCodes.UNAUTHORIZED,
        ReasonPhrases.UNAUTHORIZED,
      ),
    );
  }
}
