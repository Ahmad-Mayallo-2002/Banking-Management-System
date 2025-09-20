import { inject } from 'inversify';
import { injectable } from 'inversify';
import loanTypes from '../types/loan.type';
import { LoanService } from './loan.service';
import { NextFunction, Request, Response } from 'express';
import sendResponse from '../utils/response';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

@injectable()
export class LoanController {
  constructor(@inject(loanTypes.LoanService) private loanService: LoanService) {}

  getAllLoans = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const loans = await this.loanService.getAllLoans();
      return sendResponse(StatusCodes.OK, ReasonPhrases.OK, loans, res);
    } catch (err) {
      return next(err);
    }
  };

  getLoanById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = (req as any).user;
      const loan = await this.loanService.getLoanById(id, user.userId, user.role);
      return sendResponse(StatusCodes.OK, ReasonPhrases.OK, loan, res);
    } catch (err) {
      return next(err);
    }
  };

  getLoansByAccountId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { accountId } = req.params;
      const user = (req as any).user;
      const loans = await this.loanService.getLoansByAccountId(accountId, user.userId, user.role);
      return sendResponse(StatusCodes.OK, ReasonPhrases.OK, loans, res);
    } catch (err) {
      return next(err);
    }
  };

  deleteLoan = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await this.loanService.deleteLoan(id);
      return sendResponse(StatusCodes.NO_CONTENT, result, null, res);
    } catch (err) {
      return next(err);
    }
  };

}
