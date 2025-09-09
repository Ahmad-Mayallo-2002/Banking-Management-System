import { injectable } from 'inversify';
import { Repository } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';
import { AppDataSource } from '../data-source';

@injectable()
export class TransactionRepo {
  private transactionRepo: Repository<Transaction>;
  constructor() {
    this.transactionRepo = AppDataSource.getRepository(Transaction);
  }
}
