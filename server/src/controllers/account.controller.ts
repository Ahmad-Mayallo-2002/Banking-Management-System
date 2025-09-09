import { inject } from 'inversify';
import { injectable } from 'inversify';
import accountTypes from '../types/account.type';
import { AccountService } from '../services/account.service';

@injectable()
export class AccountController {
  constructor(@inject(accountTypes.AccountController) private accountService: AccountService) {}
}
