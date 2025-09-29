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

  async takeLoan(amount: number, accountId: string): Promise<string> {
    const loan = await this.loanRepo.findOne({ where: { accountId } });
    if (!loan) {
      const newLoan = this.loanRepo.create({
        amount,
        accountId,
      });
      await this.loanRepo.save(newLoan);
    } else {
      loan.amount += amount;
      await this.loanRepo.save(loan);
    }
    return 'Loan taked successfully';
  }

  async payLoan(amount: number, accountId: string): Promise<string> {
    const loan = await this.loanRepo.findOne({ where: { accountId } });

    if (!loan)
      throw new AppError(
        'No loan found for this account',
        StatusCodes.NOT_FOUND,
        ReasonPhrases.NOT_FOUND,
      );

    if (amount <= 0) {
      throw new AppError(
        'Payment amount must be greater than zero',
        StatusCodes.BAD_REQUEST,
        ReasonPhrases.BAD_REQUEST,
      );
    }

    if (amount > Number(loan.amount)) {
      throw new AppError(
        'Payment amount exceeds remaining loan balance',
        StatusCodes.BAD_REQUEST,
        ReasonPhrases.BAD_REQUEST,
      );
    }

    loan.amount -= Number(loan.amount) - amount;

    if (!loan.amount) return 'Loan fully repaid. Congratulations';

    await this.loanRepo.save(loan);

    return 'Loan payment successful';
  }
}
