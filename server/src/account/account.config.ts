import { Container } from 'inversify';
import accountTypes from '../types/account.type';
import { AccountRepo } from './account.repo';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';

const AccountContainer = new Container();

AccountContainer.bind<AccountRepo>(accountTypes.AccountRepo).to(AccountRepo);
AccountContainer.bind<AccountService>(accountTypes.AccountService).to(AccountService);
AccountContainer.bind<AccountController>(accountTypes.AccountController).to(AccountController);

export default AccountContainer;
