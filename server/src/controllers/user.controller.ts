import { NextFunction, Request, Response } from 'express';
import { UserService } from '../services/user.service';
import sendResponse from '../utils/response';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import AppError from '../utils/appError';

export class UserController {
  private userService: UserService;
  constructor() {
    this.userService = new UserService();
  }

  createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.createUser(req.body);
      return sendResponse(StatusCodes.CREATED, 'User is Created', user, res);
    } catch (error: any) {
      console.log(error);
      return next(error);
    }
  };

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

  getUserById = async (req: Request, res: Response, next: NextFunction) => {
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

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const success = await this.userService.updateUser(id, data);
      return sendResponse(StatusCodes.OK, 'User updated successfully', null, res);
    } catch (error: any) {
      console.log(error);
      return next(error);
    }
  };

  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.userService.deleteUser(id);
      return sendResponse(StatusCodes.OK, 'User deleted successfully', null, res);
    } catch (error: any) {
      console.log(error);
      return next(error);
    }
  };
}
