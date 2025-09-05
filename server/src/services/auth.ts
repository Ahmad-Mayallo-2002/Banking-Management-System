import { NextFunction, Request, Response } from 'express';
import { userRepo } from '../utils/repos';
import AppError from '../utils/appError';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import sendResponse from '../utils/response';

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  const user = await userRepo.findOneBy({ email });
  if (!user)
    throw next(new AppError('Invalid Email', StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND));

  const comparePass = await compare(password, user?.password);
  if (!comparePass)
    throw next(new AppError('Invalid Password', StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND));

  const token = sign(user, `${process.env.JWT_SECRET}`);

  return sendResponse(
    StatusCodes.OK,
    'Login is Done!',
    { token, id: user.id, role: user.role },
    res,
  );
};

export { login };
