import { inject, injectable } from 'inversify';
import accountTypes from '../types/account.type';
import { AccountService } from './account.service';
import { NextFunction, Request, Response } from 'express';
import { accountInputSchema } from './zod/account.zod';
import sendResponse from '../utils/response';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

@injectable()
export class AccountController {
  constructor(@inject(accountTypes.AccountService) private accountService: AccountService) {}

  createAccountByUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.userId;
      const { accountNumber, password } = req.body;
      const parse = accountInputSchema.parse({ accountNumber, password });

      const result = await this.accountService.createAccount(parse, userId);
      return sendResponse(StatusCodes.CREATED, ReasonPhrases.CREATED, result, res);
    } catch (error) {
      return next(error);
    }
  };

  getAllAccounts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.accountService.getAllAccounts();
      return sendResponse(StatusCodes.OK, ReasonPhrases.OK, result, res);
    } catch (error) {
      return next(error);
    }
  };

  getAccountById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { role, userId } = (req as any).user;
      const result = await this.accountService.getAccountById(id, role, userId);
      return sendResponse(StatusCodes.OK, ReasonPhrases.OK, result, res);
    } catch (error) {
      return next(error);
    }
  };

  getAccountsByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId: ownerId } = req.params;
      const { role, userId } = (req as any).user;
      const result = await this.accountService.getAccountsByUserId(ownerId, role, userId);
      return sendResponse(StatusCodes.OK, ReasonPhrases.OK, result, res);
    } catch (error) {
      return next(error);
    }
  };

  deleteAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { role, userId } = (req as any).user;
      const result = await this.accountService.deleteAccount(id, userId, role);
      return sendResponse(StatusCodes.OK, result, null, res);
    } catch (error) {
      return next(error);
    }
  };

  updateAccountStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { isActive } = req.body;
      const result = await this.accountService.updateAccountStatus(id, isActive);
      return sendResponse(StatusCodes.OK, result, null, res);
    } catch (error) {
      return next(error);
    }
  };
}
