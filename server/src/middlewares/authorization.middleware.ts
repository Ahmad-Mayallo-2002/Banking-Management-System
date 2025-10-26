import { OAuth2Client } from 'google-auth-library';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import AppError from '../utils/appError';
import { NextFunction, Request, Response } from 'express';
import { config } from 'dotenv';
import { log } from 'console';
import { verify } from 'jsonwebtoken';

config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export default async function authorization(req: Request, res: Response, next: NextFunction) {
  // const idToken = (req?.user as any)?.idToken || req.headers.authorization?.split(' ')[1];
  const normalToken = req.headers.authorization?.split(' ')[1];
  const googleToken: string | undefined = (req.user as any)?.idToken;

  if (!normalToken && !googleToken) {
    return next(
      new AppError(
        'Access denied. Token missing.',
        StatusCodes.UNAUTHORIZED,
        ReasonPhrases.UNAUTHORIZED,
      ),
    );
  }

  if (normalToken) {
    try {
      verify(normalToken, `${process.env.JWT_SECRET}`, (err, user) => {
        if (err) return new AppError(err.message, StatusCodes.FORBIDDEN, ReasonPhrases.FORBIDDEN);
        req.user = user;
      });
      next();
    } catch (err) {
      log(err);
      return next(
        new AppError(
          'Invalid or expired token',
          StatusCodes.UNAUTHORIZED,
          ReasonPhrases.UNAUTHORIZED,
        ),
      );
    }
  }

  if (googleToken) {
    try {
      const ticket = await client.verifyIdToken({
        idToken: googleToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      req.user = payload; // Google user info
      (req as any).user.token = googleToken;
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
}
