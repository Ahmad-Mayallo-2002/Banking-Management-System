import { inject } from 'inversify';
import { injectable } from 'inversify';
import loanTypes from '../types/loan.type';
import { NextFunction, Request, Response } from 'express';
import sendResponse from '../utils/response';
import { StatusCodes } from 'http-status-codes';
import { LoanService } from './loan.service';

@injectable()
export class LoanController {
  constructor(@inject(loanTypes.LoanService) private loanService: LoanService) {}

  getAllLoans = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const loans = await this.loanService.getAllLoans();
      return sendResponse(StatusCodes.OK, 'Loans fetched successfully', loans, res);
    } catch (err) {
      next(err);
    }
  };

  getLoanById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const loan = await this.loanService.getLoanById(id);
      return sendResponse(StatusCodes.OK, 'Loan fetched successfully', loan, res);
    } catch (err) {
      next(err);
    }
  };

  getAccountLoans = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { accountId } = req.params;
      const loans = await this.loanService.getAccountLoan(accountId);
      return sendResponse(StatusCodes.OK, 'Account loans fetched successfully', loans, res);
    } catch (err) {
      next(err);
    }
  };

  deleteLoan = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const message = await this.loanService.deleteLoan(id);
      return sendResponse(StatusCodes.OK, message, null, res);
    } catch (err) {
      next(err);
    }
  };

  updateLoanIsPaid = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { isPaid } = req.body;
      const message = await this.loanService.updateLoanIsPaid(id, isPaid);
      return sendResponse(StatusCodes.OK, message, null, res);
    } catch (err) {
      next(err);
    }
  };

  createLoan = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const loan = await this.loanService.createLoan(data);
      return sendResponse(StatusCodes.CREATED, 'Loan created successfully', loan, res);
    } catch (err) {
      next(err);
    }
  };

  updateRepaidAmount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { amount } = req.body;
      const message = await this.loanService.updateRepaidAmount(id, amount);
      return sendResponse(StatusCodes.OK, message, null, res);
    } catch (err) {
      next(err);
    }
  };
}
