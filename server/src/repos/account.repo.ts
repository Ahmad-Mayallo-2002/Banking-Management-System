import { injectable } from 'inversify';
import { Repository } from 'typeorm';
import { Account } from '../entities/account.entity';
import { AppDataSource } from '../data-source';

@injectable()
export class AccountRepo {
  private accountRepo: Repository<Account>;
  constructor() {
    this.accountRepo = AppDataSource.getRepository(Account);
  }
}
