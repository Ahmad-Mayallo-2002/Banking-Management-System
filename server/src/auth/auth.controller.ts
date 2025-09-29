import { inject } from 'inversify';
import { injectable } from 'inversify';
import authTypes from '../types/auth.type';
import { AuthService } from './auth.service';
import { NextFunction, Request, Response } from 'express';
import sendResponse from '../utils/response';
import { StatusCodes } from 'http-status-codes';
import { loginInputSchema } from './zod/login.zod';
import { ZodError } from 'zod';
import { signUpInputSchema } from './zod/signUp.zod';
import { updatePasswordInputSchema } from './zod/updatePassword.zod';
import { emailInputSchema } from './zod/sendVerificationCode.zod';

@injectable()
export class AuthController {
  constructor(@inject(authTypes.AuthService) private authService: AuthService) {}

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const parse = loginInputSchema.parse({ email, password });
      const result = await this.authService.login(parse);
      return sendResponse(StatusCodes.OK, 'OK', result, res);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          status: StatusCodes.BAD_REQUEST,
          message: 'Validation Error',
          errors: error._zod.def,
        });
      }
      return next(error);
    }
  };

  signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, email, password, phone, address } = req.body;
      const parse = signUpInputSchema.parse({
        username,
        email,
        password,
        phone,
        address: JSON.parse(address),
        avatar: req.file,
      });
      const result = await this.authService.signUp(parse);
      return sendResponse(StatusCodes.CREATED, 'OK', result, res);
    } catch (error: any) {
      return next(error);
    }
  };

  sendVerificationCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parse = emailInputSchema.parse(req.body.email);
      const result = await this.authService.sendVerificationCode(parse.email);
      return sendResponse(StatusCodes.OK, result, null, res);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          status: StatusCodes.BAD_REQUEST,
          message: 'Validation Error',
          errors: error._zod.def,
        });
      }
      return next(error);
    }
  };

  compareCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.authService.compareCode(req.body.code);
      return sendResponse(StatusCodes.OK, 'OK', result, res);
    } catch (error: any) {
      return next(error);
    }
  };

  updatePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { newPassword, confirmNewPassword } = req.body;
      const parse = updatePasswordInputSchema.parse({ newPassword, confirmNewPassword });
      const result = await this.authService.updatePassword(parse.newPassword);
      return sendResponse(StatusCodes.OK, result, null, res);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          status: StatusCodes.BAD_REQUEST,
          message: 'Validation Error',
          errors: error._zod.def,
        });
      }
      return next(error);
    }
  };
}
