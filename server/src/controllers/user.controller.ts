import { NextFunction, Request, Response } from 'express';
import { UserService } from '../services/user.service';
import sendResponse from '../utils/response';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import AppError from '../utils/appError';
import { injectable } from 'inversify';
import { inject } from 'inversify';
import userTypes from '../types/userTypes.type';
import { userInputSchema } from '../zod/user.validation';
import { ZodError } from 'zod';

@injectable()
export class UserController {
  private userService: UserService;
  constructor(@inject(userTypes.UserService) userService: UserService) {
    this.userService = userService;
  }

  createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body.avatar = req.file;
      req.body.address = JSON.parse(req.body.address);
      const validateBody = userInputSchema.parse(req.body);
      const user = await this.userService.createUser(validateBody);
      return sendResponse(StatusCodes.CREATED, 'User is Created', user, res);
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: error._zod.def,
        });
      }
      return next(error);
    }
  };

  getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.getUserById((req as any).user.id);
      if (!user)
        return next(new AppError('User not found', StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND));
      return sendResponse(StatusCodes.OK, 'User retrieved successfully', user, res);
    } catch (error: any) {
      console.log(error);
      return next(error);
    }
  };

  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.userService.deleteUser((req as any).user.id);
      return sendResponse(StatusCodes.OK, 'User deleted successfully', null, res);
    } catch (error: any) {
      console.log(error);
      return next(error);
    }
  };

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = req.body;
      const success = await this.userService.updateUser((req as any).user.id, input);
      return sendResponse(StatusCodes.OK, 'User updated successfully', null, res);
    } catch (error: any) {
      console.log(error);
      return next(error);
    }
  };

  // Admin Only

  getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.userService.getUsers();
      if (!users.length)
        return next(
          new AppError('Users not found', StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND),
        );
      return sendResponse(StatusCodes.OK, 'Users retrieved successfully', users, res);
    } catch (error: any) {
      console.log(error);
      return next(error);
    }
  };

  getUserByIdByAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = await this.userService.getUserById(id);
      if (!user)
        return next(new AppError('User not found', StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND));
      return sendResponse(StatusCodes.OK, 'User retrieved successfully', user, res);
    } catch (error: any) {
      console.log(error);
      return next(error);
    }
  };

  updateUserByAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body.avatar = req.file;
      const success = await this.userService.updateUser(req.params.id, req.body);
      return sendResponse(StatusCodes.OK, 'User updated successfully', null, res);
    } catch (error: any) {
      console.log(error);
      return next(error);
    }
  };

  deleteUserByAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.userService.deleteUser(req.params.id);
      return sendResponse(StatusCodes.OK, 'User deleted successfully', null, res);
    } catch (error: any) {
      console.log(error);
      return next(error);
    }
  };

  seedAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.userService.seedAdmin();
      return sendResponse(StatusCodes.CREATED, 'Admin is created', null, res);
    } catch (error: any) {
      console.log(error);
      return next(error);
    }
  };
}
