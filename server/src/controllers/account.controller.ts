import { inject } from 'inversify';
import { injectable } from 'inversify';
import accountTypes from '../types/account.type';
import { AccountService } from '../services/account.service';
import { NextFunction, Request, Response } from 'express';
import { Account } from '../entities/account.entity';
import sendResponse from '../utils/response';
import { StatusCodes } from 'http-status-codes';

@injectable()
export class AccountController {
  constructor(@inject(accountTypes.AccountService) private accountService: AccountService) {}

  createAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result: Account = await this.accountService.createAccount(
        (req as any).user.customerId,
        req.body.password,
      );
      return sendResponse(StatusCodes.CREATED, 'Account is created', result, res);
    } catch (error) {
      next(error);
    }
  };

  getAllAccounts = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const accounts = await this.accountService.getAllAccounts();
      return sendResponse(StatusCodes.OK, 'All accounts retrieved', accounts, res);
    } catch (error) {
      next(error);
    }
  };

  getAccountById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const account = await this.accountService.getAccountById(req.params.id);
      return sendResponse(StatusCodes.OK, 'Account retrieved', account, res);
    } catch (error) {
      next(error);
    }
  };

  getAccountsByCustomerId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accounts = await this.accountService.getAccountsByCustomerId((req as any).user.customerId);
      return sendResponse(StatusCodes.OK, 'Customer accounts retrieved', accounts, res);
    } catch (error) {
      next(error);
    }
  };

  activateOrDeactivateAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const message = await this.accountService.activateAccountOrDeactive(
        req.params.id,
        req.body.isActive,
      );
      return sendResponse(StatusCodes.OK, message, null, res);
    } catch (error) {
      next(error);
    }
  };

  deleteAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const message = await this.accountService.deleteAccount(req.params.id, req.body.customerId);
      return sendResponse(StatusCodes.OK, message, null, res);
    } catch (error) {
      next(error);
    }
  };
}