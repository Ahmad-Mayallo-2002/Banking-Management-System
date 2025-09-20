import { injectable } from 'inversify';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { AppDataSource } from '../data-source';
import AppError from '../utils/appError';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { TransactionType } from '../enums/transactions.enum';
import { Account } from '../account/account.entity';
import { TransactionInput } from './zod/create-transaction.zod';
import { inject } from 'inversify';
import loanTypes from '../types/loan.type';
import { LoanService } from '../loan/loan.service';

@injectable()
export class TransactionService {
  private transactionRepo: Repository<Transaction>;
  private accountRepo: Repository<Account>;
  constructor(@inject(loanTypes.LoanService) private loanService: LoanService) {
    this.transactionRepo = AppDataSource.getRepository(Transaction);
    this.accountRepo = AppDataSource.getRepository(Account);
  }

  async getAllTransactions(): Promise<Transaction[]> {
    const transactions = await this.transactionRepo.find();
    if (!transactions.length)
      throw new AppError('No transactions found', StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND);
    return transactions;
  }

  async getTransactionById(id: string): Promise<Transaction> {
    const transaction = await this.transactionRepo.findOne({ where: { id } });
    if (!transaction)
      throw new AppError('Transaction not found', StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND);
    return transaction;
  }

  async getTransactionsByAccountNumber(accountNumber: string): Promise<Transaction[]> {
    const transactions = await this.transactionRepo.find({
      where: [{ sourceId: accountNumber }, { destinationId: accountNumber }],
    });
    if (!transactions.length)
      throw new AppError(
        'No transactions found for this user',
        StatusCodes.NOT_FOUND,
        ReasonPhrases.NOT_FOUND,
      );
    return transactions;
  }

  async deleteTransaction(id: string): Promise<string> {
    const transaction = await this.getTransactionById(id);
    await this.transactionRepo.remove(transaction);
    return 'Transaction deleted successfully';
  }

  async createTransaction(input: TransactionInput): Promise<string> {
    const { type, amount, destinationNumber, sourceNumber } = input;
    const source = await this.accountRepo.findOne({
      where: {
        accountNumber: sourceNumber,
      },
    });

    if (!source)
      throw new AppError(
        'Invalid account number or this account not found',
        StatusCodes.NOT_FOUND,
        ReasonPhrases.NOT_FOUND,
      );

    if (type === TransactionType.DEPOSIT) {
      source.amount += amount;
      await this.accountRepo.save(source);
    } else if (type === TransactionType.WITHDRAWAL) {
      source.amount -= amount;
      await this.accountRepo.save(source);
    } else if (type === TransactionType.TAKE_LOAN) {
      const takeLoan = await this.loanService.takeLoan(amount, source.id);
      return takeLoan;
    } else if (type === TransactionType.LOAN_PAYMENT) {
      const payLoan = await this.loanService.payLoan(amount, source.id);
      return payLoan;
    } else if (type === TransactionType.TRANSFER) {
      const destination = await this.accountRepo.findOne({
        where: { accountNumber: destinationNumber },
      });

      if (!destination)
        throw new AppError(
          'Invalid account number or this account not found',
          StatusCodes.NOT_FOUND,
          ReasonPhrases.NOT_FOUND,
        );

      if (source.amount < amount)
        throw new AppError('Not enough salary', StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST);

      source.amount -= amount;
      destination.amount += amount;

      await this.accountRepo.save(source);
      await this.accountRepo.save(destination);
    } else {
      throw new AppError(
        'Error transaction type',
        StatusCodes.BAD_REQUEST,
        ReasonPhrases.BAD_REQUEST,
      );
    }

    return 'Transaction is completed';
  }
}
