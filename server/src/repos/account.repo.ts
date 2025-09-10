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
    return this.accountRepo.find({ relations: ['customer'] });
  }

  async findById(id: string): Promise<Account | null> {
    return this.accountRepo.findOne({ where: { id }, relations: ['customer'] });
  }

  async findCustomerAccounts(customerId: string): Promise<Account[]> {
    return await this.accountRepo.find({
      where: { customer_id: customerId },
      relations: ['customers'],
    });
  }

  async updateActivation(id: string, isActive: boolean): Promise<void> {
    await this.accountRepo.update({ id }, { isActive });
  }

  async deleteByIdAndCustomer(id: string, customerId: string): Promise<void> {
    await this.accountRepo.delete({ id, customer_id: customerId });
  }
}
