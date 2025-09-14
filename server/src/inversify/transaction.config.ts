import { Container } from 'inversify';
import { TransactionRepo } from '../repos/transaction.repo';
import transactionTypes from '../types/transaction.type';
import { TransactionService } from '../services/transaction.service';
import { TransactionController } from '../controllers/transaction.controller';
import { LoanService } from '../services/loan.service';
import loanTypes from '../types/loan.type';
import { LoanRepo } from '../repos/loan.repo';
import accountTypes from '../types/account.type';
import { AccountService } from '../services/account.service';
import { AccountRepo } from '../repos/account.repo';

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
