import { Container } from 'inversify';
import { AccountService } from './account.service';
import accountTypes from '../types/account.type';
import { AccountController } from './account.controller';

const accountContainer = new Container();

accountContainer.bind<AccountService>(accountTypes.AccountService).to(AccountService);
accountContainer.bind<AccountController>(accountTypes.AccountController).to(AccountController);

export default accountContainer;
