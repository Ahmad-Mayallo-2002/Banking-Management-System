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

  async getAll(): Promise<Loan[]> {
    return this.loanRepo.find({ relations: ['account'] });
  }

  async getById(id: string): Promise<Loan | null> {
    return this.loanRepo.findOne({ where: { id }, relations: ['account'] });
  }

  async getByAccountId(accountId: string): Promise<Loan | null> {
    return this.loanRepo.findOne({ where: { account: { id: accountId } }, relations: ['account'] });
  }

  async delete(id: string): Promise<void> {
    await this.loanRepo.delete(id);
  }

  async create(data: Partial<Loan>): Promise<Loan> {
    return this.loanRepo.save(this.loanRepo.create(data));
  }

  async save(loan: Loan): Promise<Loan> {
    return this.loanRepo.save(loan);
  }
}
