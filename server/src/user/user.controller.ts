import { injectable } from 'inversify';
import { UserService } from './user.service';
import { inject } from 'inversify';
import userTypes from '../types/user.type';
import { NextFunction, Request, Response } from 'express';
import sendResponse from '../utils/response';
import { StatusCodes } from 'http-status-codes';
import { userInputSchema } from './zod/user.zod';
import { ZodError } from 'zod';

@injectable()
export class UserController {
  constructor(@inject(userTypes.UserService) private userService: UserService) {}

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.userService.getAll();
      return sendResponse(StatusCodes.OK, 'Done', users, res);
    } catch (error) {
      return next(error);
    }
  };

  getByIdByUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.getById((req as any).user.id);
      return sendResponse(StatusCodes.OK, 'Done', user, res);
    } catch (error) {
      return next(error);
    }
  };

  getByIdByAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.getById(req.params.id);
      return sendResponse(StatusCodes.OK, 'Done', user, res);
    } catch (error) {
      return next(error);
    }
  };

  deleteByUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const message = await this.userService.delete((req as any).user.id);
      return sendResponse(StatusCodes.OK, message, null, res);
    } catch (error) {
      return next(error);
    }
  };

  deleteByAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const message = await this.userService.delete(req.params.id);
      return sendResponse(StatusCodes.OK, message, null, res);
    } catch (error) {
      return next(error);
    }
  };

  updateByUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.file) req.body.avatar = req.file;
      if (req.body.address) req.body.address = JSON.parse(req.body.address);
      const parsedBody = userInputSchema.parse(req.body);
      const message = await this.userService.update(parsedBody, (req as any).user.id);
      return sendResponse(StatusCodes.OK, message, null, res);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          status: 'Error',
          message: 'Validation failed',
          errors: error._zod.def,
        });
      }
      return next(error);
    }
  };

  updateByAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.file) req.body.avatar = req.file;
      if (req.body.address) req.body.address = JSON.parse(req.body.address);
      const parsedBody = userInputSchema.parse(req.body);
      const message = await this.userService.update(parsedBody, req.params.id);
      return sendResponse(StatusCodes.OK, message, null, res);
    } catch (error) {
      return next(error);
    }
  };
}
