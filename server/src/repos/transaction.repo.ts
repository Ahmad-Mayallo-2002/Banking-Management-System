import { injectable } from 'inversify';
import { Repository } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';
import { AppDataSource } from '../data-source';
import { TransactionStatus } from '../enums/transactions.enum';

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

  async getByCustomerId(customerId: string): Promise<Transaction[]> {
    return this.transactionRepo.find({
      where: [
        { source: { customer_id: customerId } },
        { destination: { customer_id: customerId } },
      ],
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
