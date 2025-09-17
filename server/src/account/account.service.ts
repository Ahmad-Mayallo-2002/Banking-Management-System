import { injectable } from 'inversify';
import { Repository } from 'typeorm';
import { Account } from './account.entity';
import { AppDataSource } from '../data-source';
import AppError from '../utils/appError';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { AccountInput } from './zod/account.zod';
import { hash } from 'bcryptjs';
import { Roles } from '../enums/roles.enum';

const { NOT_FOUND, BAD_REQUEST, FORBIDDEN } = StatusCodes;

@injectable()
export class AccountService {
  private accountRepo: Repository<Account>;

  constructor() {
    this.accountRepo = AppDataSource.getRepository(Account);
  }

  async createAccount(input: AccountInput, userId: string): Promise<Account> {
    const { accountNumber, password } = input;
    const account = this.accountRepo.create({
      accountNumber,
      password: await hash(password, 10),
      userId,
    });
    return await this.accountRepo.save(account);
  }

  async getAllAccounts(): Promise<Account[]> {
    const accounts = await this.accountRepo.find();
    if (!accounts.length)
      throw new AppError('Accounts not found', NOT_FOUND, ReasonPhrases.NOT_FOUND);
    return accounts;
  }

  async getAccountById(id: string, role: Roles, ownerId: string): Promise<Account> {
    const account = await this.accountRepo.findOneBy({ id });
    if (!account) throw new AppError('Account not found', NOT_FOUND, ReasonPhrases.NOT_FOUND);
    if (account.userId !== ownerId && role !== Roles.ADMIN)
      throw new AppError('Access is denied', FORBIDDEN, ReasonPhrases.FORBIDDEN);
    return account;
  }

  async getAccountsByUserId(userId: string, role: Roles, ownerId: string): Promise<Account[]> {
    const accounts = await this.accountRepo.find({ where: { userId } });
    if (!accounts.length)
      throw new AppError('No accounts found for this user', NOT_FOUND, ReasonPhrases.NOT_FOUND);
    if (accounts[0].userId !== ownerId && role !== Roles.ADMIN)
      throw new AppError('Access is denied', FORBIDDEN, ReasonPhrases.FORBIDDEN);

    return accounts;
  }

  async deleteAccount(id: string, ownerId: string, role: Roles): Promise<string> {
    const account = await this.getAccountById(id, role, ownerId);
    await this.accountRepo.remove(account);
    return 'Account deleted successfully';
  }

  async updateAccountStatus(id: string, isActive: boolean): Promise<string> {
    const account = await this.accountRepo.findOneBy({ id });
    if (!account) throw new AppError('Account not found', NOT_FOUND, ReasonPhrases.NOT_FOUND);
    account.isActive = isActive;
    await this.accountRepo.save(account);
    return `This account now is ${isActive ? 'active' : 'not active'}`;
  }
}
