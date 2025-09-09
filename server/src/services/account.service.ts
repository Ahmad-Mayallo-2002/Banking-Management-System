import { inject } from 'inversify';
import { injectable } from 'inversify';
import accountTypes from '../types/account.type';
import { AccountRepo } from '../repos/account.repo';

@injectable()
export class AccountService {
  constructor(@inject(accountTypes.AccountRepo) private accountRepo: AccountRepo) {}
}
