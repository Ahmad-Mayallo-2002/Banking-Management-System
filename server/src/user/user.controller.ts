import { NextFunction, Request, Response } from 'express';
import sendResponse from '../utils/response';
import { StatusCodes } from 'http-status-codes';
import { injectable } from 'inversify';
import { inject } from 'inversify';
import userTypes from '../types/user.type';
import { userInputSchema } from '../zod/user.validation';
import { ZodError } from 'zod';
import { UserService } from './user.service';

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
      const success = await this.userService.updateUser((req as any).user.id, req.body);
      return sendResponse(StatusCodes.OK, 'User updated successfully', null, res);
    } catch (error: any) {
      console.log(error);
      return next(error);
    }
  };

  sendVerificationCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.userService.sendVerificationCode(req.body.email);
      return sendResponse(StatusCodes.OK, result, null, res);
    } catch (error) {
      console.log(error);
      return next(error);
    }
  };

  validateCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.userService.validateCode(req.body.code);
      return sendResponse(StatusCodes.OK, result, null, res);
    } catch (error) {
      console.log(error);
      return next(error);
    }
  };

  updatePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.userService.updatePassword(
        req.body.password,
        req.body.confirmPassword,
      );
      return sendResponse(StatusCodes.OK, result, null, res);
    } catch (error) {
      console.log(error);
      return next(error);
    }
  };

  // Admin Only

  getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.userService.getUsers();
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
      return sendResponse(StatusCodes.OK, 'User retrieved successfully', user, res);
    } catch (error: any) {
      console.log(error);
      return next(error);
    }
  };

  updateUserByAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body.avatar = req.file;
      const result = await this.userService.updateUser(req.params.id, req.body);
      return sendResponse(StatusCodes.OK, result, null, res);
    } catch (error: any) {
      console.log(error);
      return next(error);
    }
  };

  deleteUserByAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.userService.deleteUser(req.params.id);
      return sendResponse(StatusCodes.OK, result, null, res);
    } catch (error: any) {
      console.log(error);
      return next(error);
    }
  };

  seedAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.userService.seedAdmin();
      return sendResponse(StatusCodes.CREATED, result, null, res);
    } catch (error: any) {
      console.log(error);
      return next(error);
    }
  };
}
