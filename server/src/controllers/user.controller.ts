import { NextFunction, Request, Response } from 'express';
import { UserService } from '../services/user.service';
import sendResponse from '../utils/response';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import AppError from '../utils/appError';

const userService = new UserService();

export class UserController {
  // Handles the creation of a new user from the request body.
  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.createUser(req.body);
      return sendResponse(StatusCodes.CREATED, 'User is Created', user, res);
    } catch (error: any) {
      return next(
        new AppError('Error creating user', StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST),
      );
    }
  }

  // Retrieves a list of all users.
  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getUsers();
      if (!users.length)
        return next(
          new AppError('Users not found', StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND),
        );

      return sendResponse(StatusCodes.OK, 'Users retrieved successfully', users, res);
    } catch (error: any) {
      console.log(error);
      return next(
        new AppError(
          'Error retrieving users',
          StatusCodes.INTERNAL_SERVER_ERROR,
          ReasonPhrases.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  // Retrieves a single user by their ID from the request parameters.
  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);

      if (!user)
        return next(new AppError('User not found', StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND));

      return sendResponse(StatusCodes.OK, 'User retrieved successfully', user, res);
    } catch (error: any) {
      return next(
        new AppError(
          'Error retrieving user',
          StatusCodes.INTERNAL_SERVER_ERROR,
          ReasonPhrases.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  // Updates an existing user by their ID with data from the request body.
  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = req.body;
      const success = await userService.updateUser(id, data);

      if (!success) {
        return next(
          new AppError(
            'User not found or no changes made',
            StatusCodes.NOT_FOUND,
            ReasonPhrases.NOT_FOUND,
          ),
        );
      }

      return sendResponse(StatusCodes.OK, 'User updated successfully', null, res);
    } catch (error: any) {
      return next(
        new AppError('Error updating user', StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST),
      );
    }
  }

  // Deletes a user by their ID from the request parameters.
  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const success = await userService.deleteUser(id);

      if (!success) {
        return next(new AppError('User not found', StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND));
      }

      return sendResponse(StatusCodes.OK, 'User deleted successfully', null, res);
    } catch (error: any) {
      return next(
        new AppError(
          'Error deleting user',
          StatusCodes.INTERNAL_SERVER_ERROR,
          ReasonPhrases.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }
}
