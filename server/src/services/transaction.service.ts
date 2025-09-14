import { inject } from 'inversify';
import { injectable } from 'inversify';
import transactionTypes from '../types/transaction.type';
import { TransactionRepo } from '../repos/transaction.repo';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import AppError from '../utils/appError';
import { TransactionStatus, TransactionType } from '../enums/transactions.enum';
import { Transaction } from '../entities/transaction.entity';
import loanTypes from '../types/loan.type';
import { LoanService } from './loan.service';
import accountTypes from '../types/account.type';
import { AccountService } from './account.service';

@injectable()
export class TransactionService {
  constructor(
    @inject(transactionTypes.TransactionRepo) private transactionRepo: TransactionRepo,
    @inject(loanTypes.LoanService) private loanService: LoanService,
    @inject(accountTypes.AccountService) private accountService: AccountService,
  ) {}

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

  async getUserTransactions(customerId: string): Promise<Transaction[]> {
    const transactions = await this.transactionRepo.getByUserId(customerId);
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

  async create(input: Partial<Transaction>): Promise<string> {
    const { type, amount, source_id, destination_id } = input;

    if (!amount)
      throw new AppError('Not enough balance', StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST);

    const account = await this.accountService.getAccountById(source_id as string);

    if (type === TransactionType.DEPOSIT || type === TransactionType.WITHDRAWAL) {
      if (type === TransactionType.WITHDRAWAL && amount > account.amount) {
        throw new AppError(
          'Not enough balance',
          StatusCodes.BAD_REQUEST,
          ReasonPhrases.BAD_REQUEST,
        );
      }

      account.amount += type === TransactionType.DEPOSIT ? amount : -amount;
      await this.accountService.updateAccountAmount(source_id as string, account);

      await this.transactionRepo.create({
        type,
        amount,
        status: TransactionStatus.COMPLETED,
        source: account,
        source_id,
      });
    } else if (type === TransactionType.TRANSFER) {
      // Transfer logic placeholder
      const destination = await this.accountService.getAccountById(destination_id as string);
      account.amount -= amount;
      destination.amount += amount;
      await this.accountService.updateAccountAmount(source_id as string, account);
      await this.accountService.updateAccountAmount(destination.id, destination);
    } else if (type === TransactionType.TAKE_LOAN) {
      // Loan logic placeholder
    } else if (type === TransactionType.LOAN_PAYMENT) {
      // Loan payment logic placeholder
    } else {
      throw new AppError(
        'Invalid Transaction Type',
        StatusCodes.BAD_REQUEST,
        ReasonPhrases.BAD_REQUEST,
      );
    }
    return `${type} transaction is completed`;
  }
}
