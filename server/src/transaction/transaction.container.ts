import { Container } from 'inversify';
import { TransactionService } from './transaction.service';
import transactionTypes from '../types/transaction.type';
import { TransactionController } from './transaction.controller';
import { LoanService } from '../loan/loan.service';
import loanTypes from '../types/loan.type';

const transactionContainer = new Container();

transactionContainer
  .bind<TransactionService>(transactionTypes.TransactionService)
  .to(TransactionService);
transactionContainer
  .bind<TransactionController>(transactionTypes.TransactionController)
  .to(TransactionController);
transactionContainer.bind<LoanService>(loanTypes.LoanService).to(LoanService);

export default transactionContainer;
