import { injectable } from 'inversify';
import { Repository } from 'typeorm';
import { Loan } from '../entities/loan.entity';
import { AppDataSource } from '../data-source';

@injectable()
export class LoanRepo {
  private loanRepo: Repository<Loan>;
  constructor() {
    this.loanRepo = AppDataSource.getRepository(Loan);
  }
}
