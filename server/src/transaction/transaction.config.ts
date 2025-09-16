import { Container } from 'inversify';
import transactionTypes from '../types/transaction.type';
import loanTypes from '../types/loan.type';
import accountTypes from '../types/account.type';
import { TransactionRepo } from './transaction.repo';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { LoanService } from '../loan/loan.service';
import { LoanRepo } from '../loan/loan.repo';
import { AccountService } from '../account/account.service';
import { AccountRepo } from '../account/account.repo';

const TransactionContainer = new Container();

TransactionContainer.bind<TransactionRepo>(transactionTypes.TransactionRepo).to(TransactionRepo);
TransactionContainer.bind<TransactionService>(transactionTypes.TransactionService).to(
  TransactionService,
);
TransactionContainer.bind<TransactionController>(transactionTypes.TransactionController).to(
  TransactionController,
);

// For using Loan Service for transaction take or pay loan
TransactionContainer.bind<LoanService>(loanTypes.LoanService).to(LoanService);
TransactionContainer.bind<LoanRepo>(loanTypes.LoanRepo).to(LoanRepo);

// For using Loan Service for transaction take or pay loan
TransactionContainer.bind<AccountService>(accountTypes.AccountService).to(AccountService);
TransactionContainer.bind<AccountRepo>(accountTypes.AccountRepo).to(AccountRepo);

export default TransactionContainer;
