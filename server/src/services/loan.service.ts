import { inject } from 'inversify';
import { injectable } from 'inversify';
import loanTypes from '../types/loan.type';
import { LoanRepo } from '../repos/loan.repo';
import { Loan } from '../entities/loan.entity';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import AppError from '../utils/appError';

@injectable()
export class LoanService {
  constructor(@inject(loanTypes.LoanRepo) private loanRepo: LoanRepo) {}

  async getAllLoans(): Promise<Loan[]> {
    const loans = await this.loanRepo.getAll();
    if (!loans.length)
      throw new AppError('No loans found', StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND);
    return loans;
  }

  async getLoanById(id: string): Promise<Loan> {
    const loan = await this.loanRepo.getById(id);
    if (!loan)
      throw new AppError(
        `Loan with id ${id} not found`,
        StatusCodes.NOT_FOUND,
        ReasonPhrases.NOT_FOUND,
      );
    return loan;
  }

  async getAccountLoans(accountId: string): Promise<Loan[]> {
    const loans = await this.loanRepo.getByAccountId(accountId);
    if (!loans.length)
      throw new AppError(
        'No loans found for this account',
        StatusCodes.NOT_FOUND,
        ReasonPhrases.NOT_FOUND,
      );
    return loans;
  }

  async deleteLoan(id: string): Promise<string> {
    await this.getLoanById(id);
    await this.loanRepo.delete(id);
    return 'Loan deleted successfully';
  }

  async updateLoanIsPaid(id: string, isPaid: boolean): Promise<string> {
    const loan = await this.getLoanById(id);
    loan.isPaid = isPaid;
    await this.loanRepo.save(loan);
    return `Loan is ${isPaid ? 'paid' : 'unpaid'}`;
  }

  async createLoan(data: Partial<Loan>): Promise<Loan> {
    if (!data.borrowedAmount || data.borrowedAmount <= 0) {
      throw new AppError(
        'Borrowed amount must be greater than zero',
        StatusCodes.BAD_REQUEST,
        ReasonPhrases.BAD_REQUEST,
      );
    }
    return await this.loanRepo.create(data);
  }

  async updateRepaidAmount(id: string, amount: number): Promise<string> {
    if (amount <= 0) {
      throw new AppError(
        'Repaid amount must be greater than zero',
        StatusCodes.BAD_REQUEST,
        ReasonPhrases.BAD_REQUEST,
      );
    }
    const loan = await this.getLoanById(id);
    if (loan.isPaid)
      throw new AppError('This loan is paid', StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST);
    if (loan.repaidAmount < loan.borrowedAmount) loan.repaidAmount += amount;
    if (loan.repaidAmount === loan.borrowedAmount) {
      loan.isPaid = true;
      return `You paid $${amount} and loan now is paid`;
    }
    await this.loanRepo.save(loan);
    return `You paid $${amount}`;
  }
}
