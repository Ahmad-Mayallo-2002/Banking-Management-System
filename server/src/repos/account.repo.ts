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

  async createAndSave(account: Partial<Account>): Promise<Account> {
    return this.accountRepo.save(this.accountRepo.create(account));
  }

  async findAll(): Promise<Account[]> {
    return this.accountRepo.find({ relations: ['user'] });
  }

  async findById(id: string): Promise<Account | null> {
    return this.accountRepo.findOne({ where: { id }, relations: ['user'] });
  }

  async findCustomerAccounts(userId: string): Promise<Account[]> {
    return await this.accountRepo.find({
      where: { user_id: userId },
      relations: ['user'],
    });
  }

  async updateAccountAmount(id: string, account: Account): Promise<void> {
    await this.accountRepo.save(this.accountRepo.merge(account));
  }

  async updateActivation(id: string, isActive: boolean): Promise<void> {
    await this.accountRepo.update({ id }, { isActive });
  }

  async deleteByIdAndCustomer(id: string, userId: string): Promise<void> {
    await this.accountRepo.delete({ id, user_id: userId });
  }
}
