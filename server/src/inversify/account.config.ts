import { Container } from 'inversify';
import { AccountRepo } from '../repos/account.repo';
import accountTypes from '../types/account.type';
import { AccountService } from '../services/account.service';
import { AccountController } from '../controllers/account.controller';

const AccountContainer = new Container();

AccountContainer.bind<AccountRepo>(accountTypes.AccountRepo).to(AccountRepo);
AccountContainer.bind<AccountService>(accountTypes.AccountService).to(AccountService);
AccountContainer.bind<AccountController>(accountTypes.AccountController).to(AccountController);

export default AccountContainer;
