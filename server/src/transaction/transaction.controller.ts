import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import transactionTypes from '../types/transaction.type';
import { TransactionService } from './transaction.service';
import { transactionInputSchema } from './zod/create-transaction.zod';
import sendResponse from '../utils/response';

@injectable()
export class TransactionController {
  constructor(
    @inject(transactionTypes.TransactionService)
    private transactionService: TransactionService,
  ) {}

  getAllTransactions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const transactions = await this.transactionService.getAllTransactions();
      return sendResponse(200, 'Transactions retrieved successfully', transactions, res);
    } catch (error) {
      return next(error);
    }
  };

  getTransactionById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const transaction = await this.transactionService.getTransactionById(req.params.id);
      return sendResponse(200, 'Transaction retrieved successfully', transaction, res);
    } catch (error) {
      return next(error);
    }
  };

  getTransactionsByAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const transactions = await this.transactionService.getTransactionsByAccountNumber(
        req.params.accountNumber,
      );
      return sendResponse(200, 'Transactions retrieved successfully', transactions, res);
    } catch (error) {
      return next(error);
    }
  };

  createTransaction = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedInput = transactionInputSchema.parse(req.body);
      const message = await this.transactionService.createTransaction(validatedInput);
      return sendResponse(201, message, null, res);
    } catch (error) {
      return next(error);
    }
  };

  deleteTransaction = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const message = await this.transactionService.deleteTransaction(req.params.id);
      return sendResponse(200, message, null, res);
    } catch (error) {
      return next(error);
    }
  };
}
