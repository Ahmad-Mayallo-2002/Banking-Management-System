import { injectable } from 'inversify';
import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { TransactionStatus } from '../enums/transactions.enum';
import { Transaction } from './transaction.entity';

@injectable()
export class TransactionRepo {
  private transactionRepo: Repository<Transaction>;
  constructor() {
    this.transactionRepo = AppDataSource.getRepository(Transaction);
  }

  async getAll(): Promise<Transaction[]> {
    return this.transactionRepo.find({
      relations: ['source', 'destination'],
    });
  }

  async getById(id: string): Promise<Transaction | null> {
    return this.transactionRepo.findOne({
      where: { id },
      relations: ['source', 'destination'],
    });
  }

  async getByUserId(userId: string): Promise<Transaction[]> {
    return this.transactionRepo.find({
      where: [{ source: { user_id: userId } }, { destination: { user_id: userId } }],
      relations: ['source', 'destination'],
    });
  }

  async updateStatus(id: string, status: TransactionStatus): Promise<void> {
    await this.transactionRepo.update(id, { status });
  }

  async delete(id: string): Promise<void> {
    await this.transactionRepo.delete(id);
  }

  async create(input: Partial<Transaction>): Promise<Transaction> {
    return await this.transactionRepo.save(this.transactionRepo.create(input));
  }
}
