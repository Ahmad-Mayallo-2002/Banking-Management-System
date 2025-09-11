import { inject } from 'inversify';
import { injectable } from 'inversify';
import transactionTypes from '../types/transaction.type';
import { TransactionRepo } from '../repos/transaction.repo';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import AppError from '../utils/appError';
import { TransactionStatus } from '../enums/transactions.enum';
import { Transaction } from '../entities/transaction.entity';

@injectable()
export class TransactionService {
  constructor(@inject(transactionTypes.TransactionRepo) private transactionRepo: TransactionRepo) {}

  async getAllTransactions(): Promise<Transaction[]> {
    const transactions = await this.transactionRepo.getAll();
    if (!transactions.length)
      throw new AppError('No transactions found', StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND);
    return transactions;
  }

  async getTransactionById(id: string): Promise<Transaction> {
    const transaction = await this.transactionRepo.getById(id);
    if (!transaction)
      throw new AppError(
        `Transaction with id ${id} not found`,
        StatusCodes.NOT_FOUND,
        ReasonPhrases.NOT_FOUND,
      );
    return transaction;
  }

  async getCustomerTransactions(customerId: string): Promise<Transaction[]> {
    const transactions = await this.transactionRepo.getByCustomerId(customerId);
    if (!transactions.length)
      throw new AppError(
        'No transactions found for this customer',
        StatusCodes.NOT_FOUND,
        ReasonPhrases.NOT_FOUND,
      );
    return transactions;
  }

  async updateTransactionStatus(id: string, status: TransactionStatus): Promise<string> {
    await this.getTransactionById(id);
    await this.transactionRepo.updateStatus(id, status);
    return `Transaction is updated successfully`;
  }

  async deleteTransaction(id: string): Promise<string> {
    await this.getTransactionById(id);
    await this.transactionRepo.delete(id);
    return 'Transaction is deleted successfully';
  }

  async create(input: Partial<Transaction>): Promise<Transaction> {
    return await this.transactionRepo.create(input);
  }
}
