import { inject } from 'inversify';
import { injectable } from 'inversify';
import transactionTypes from '../types/transaction.type';
import { NextFunction, Request, Response } from 'express';
import { TransactionStatus } from '../enums/transactions.enum';
import sendResponse from '../utils/response';
import { StatusCodes } from 'http-status-codes';
import { TransactionService } from './transaction.service';

@injectable()
export class TransactionController {
  constructor(
    @inject(transactionTypes.TransactionService) private transactionService: TransactionService,
  ) {}

  getAllTransactions = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const transactions = await this.transactionService.getAllTransactions();
      return sendResponse(StatusCodes.OK, 'Transactions fetched successfully', transactions, res);
    } catch (err) {
      next(err);
    }
  };

  getTransactionById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const transaction = await this.transactionService.getTransactionById(id);
      return sendResponse(StatusCodes.OK, 'Transaction fetched successfully', transaction, res);
    } catch (err) {
      next(err);
    }
  };

  getCustomerTransactions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const transactions = await this.transactionService.getUserTransactions(
        (req as any).user.customerId,
      );
      return sendResponse(
        StatusCodes.OK,
        'Customer transactions fetched successfully',
        transactions,
        res,
      );
    } catch (err) {
      next(err);
    }
  };

  updateTransactionStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!Object.values(TransactionStatus).includes(status))
        return sendResponse(StatusCodes.BAD_REQUEST, 'Invalid transaction status', null, res);

      const message = await this.transactionService.updateTransactionStatus(id, status);
      return sendResponse(StatusCodes.OK, message, null, res);
    } catch (err) {
      next(err);
    }
  };

  deleteTransaction = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const message = await this.transactionService.deleteTransaction(id);
      return sendResponse(StatusCodes.OK, message, null, res);
    } catch (err) {
      next(err);
    }
  };

  createTransaction = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = req.body;
      const transaction = await this.transactionService.create(input);
      return sendResponse(
        StatusCodes.CREATED,
        'Transaction created successfully',
        transaction,
        res,
      );
    } catch (err) {
      next(err);
    }
  };
}
