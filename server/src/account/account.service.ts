import { inject } from 'inversify';
import { injectable } from 'inversify';
import accountTypes from '../types/account.type';
import { hash } from 'bcryptjs';
import AppError from '../utils/appError';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { Account } from './account.entity';
import { AccountRepo } from './account.repo';

@injectable()
export class AccountService {
  constructor(@inject(accountTypes.AccountRepo) private accountRepo: AccountRepo) {}

  async createAccount(userId: string, password: string): Promise<Account> {
    const hashedPassword = await hash(password, 10);
    return this.accountRepo.createAndSave({
      password: hashedPassword,
      user_id: userId,
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

  async getAccountsByUserId(userId: string): Promise<Account[]> {
    const accounts: Account[] = await this.accountRepo.findCustomerAccounts(userId);
    if (!accounts.length)
      throw new AppError('No accounts found', StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND);
    return accounts;
  }

  async activateAccountOrDeactive(id: string, isActive: boolean): Promise<string> {
    await this.getAccountById(id);
    await this.accountRepo.updateActivation(id, isActive);
    return `Account is ${isActive ? 'active' : 'not active'}`;
  }

  async updateAccountAmount(id: string, account: Account): Promise<string> {
    await this.accountRepo.findById(id);
    await this.accountRepo.updateAccountAmount(id, account);
    return 'Account amount is updated successfully';
  }

  async deleteAccount(id: string, userId: string): Promise<string> {
    await this.getAccountById(id);
    await this.accountRepo.deleteByIdAndCustomer(id, userId);
    return 'Account is deleted';
  }
}
