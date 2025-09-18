import { injectable } from 'inversify';
import { Repository } from 'typeorm';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { Loan } from './loan.entity';
import { AppDataSource } from '../data-source';
import AppError from '../utils/appError';
import { Account } from '../account/account.entity';
import { Roles } from '../enums/roles.enum';

@injectable()
export class LoanService {
  private loanRepo: Repository<Loan>;
  private accountRepo: Repository<Account>;
  constructor() {
    this.loanRepo = AppDataSource.getRepository(Loan);
  }

  async getAllLoans(): Promise<Loan[]> {
    const loans = await this.loanRepo.find();
    if (!loans.length)
      throw new AppError('Loans not found', StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND);
    return loans;
  }

  async getLoanById(id: string, ownerId: string, role: Roles): Promise<Loan> {
    const loan = await this.loanRepo.findOne({ where: { id } });
    if (!loan) throw new AppError('Loan not found', StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND);
    return loan;
  }

  async getLoansByAccountId(accountId: string, ownerId: string, role: Roles): Promise<Loan[]> {
    const loans = await this.loanRepo.find({ where: { accountId } });
    if (!loans.length)
      throw new AppError(
        'Loans not found for this account',
        StatusCodes.NOT_FOUND,
        ReasonPhrases.NOT_FOUND,
      );
    return loans;
  }

  async deleteLoan(id: string): Promise<string> {
    const loan = await this.loanRepo.findOneBy({ id });
    if (!loan) throw new AppError('Loan not found', StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND);
    await this.loanRepo.remove(loan);
    return 'Loan deleted successfully';
  }

  async updateLoanPaymentStatus(id: string, isPaid: boolean): Promise<string> {
    const loan = await this.loanRepo.findOneBy({ id });
    if (!loan) throw new AppError('Loan not found', StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND);
    loan.isPaid = isPaid;
    await this.loanRepo.save(loan);
    return `Loan now is ${isPaid ? 'paid' : 'not paid'}`;
  }
}
