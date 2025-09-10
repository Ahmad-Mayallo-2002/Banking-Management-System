import { inject } from 'inversify';
import { injectable } from 'inversify';
import accountTypes from '../types/account.type';
import { AccountRepo } from '../repos/account.repo';
import { hash } from 'bcryptjs';
import { Account } from '../entities/account.entity';
import AppError from '../utils/appError';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

@injectable()
export class AccountService {
  constructor(@inject(accountTypes.AccountRepo) private accountRepo: AccountRepo) {}

  async createAccount(customerId: string, password: string): Promise<Account> {
    const hashedPassword = await hash(password, 10);
    return this.accountRepo.createAndSave({
      password: hashedPassword,
      customer_id: customerId,
    });
  }

  async getAllAccounts(): Promise<Account[]> {
    const accounts: Account[] = await this.accountRepo.findAll();
    if (!accounts.length)
      throw new AppError('No accounts found', StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND);
    return accounts;
  }

  async getAccountById(id: string): Promise<Account> {
    const account = await this.accountRepo.findById(id);
    if (!account)
      throw new AppError('Account not found', StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND);
    return account;
  }

  async getAccountsByCustomerId(customerId: string): Promise<Account[]> {
    const accounts: Account[] = await this.accountRepo.findCustomerAccounts(customerId);
    if (!accounts.length)
      throw new AppError('No accounts found', StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND);
    return accounts;
  }

  async activateAccountOrDeactive(id: string, isActive: boolean): Promise<string> {
    await this.getAccountById(id);
    await this.accountRepo.updateActivation(id, isActive);
    return `Account is ${isActive ? 'active' : 'not active'}`;
  }

  async deleteAccount(id: string, customerId: string): Promise<string> {
    await this.getAccountById(id);
    await this.accountRepo.deleteByIdAndCustomer(id, customerId);
    return 'Account is deleted'
  }
}
