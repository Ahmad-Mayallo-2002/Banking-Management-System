import { Container } from 'inversify';
import { TransactionRepo } from '../repos/transaction.repo';
import transactionTypes from '../types/transaction.type';
import { TransactionService } from '../services/transaction.service';
import { TransactionController } from '../controllers/transaction.controller';

const TransactionContainer = new Container();

TransactionContainer.bind<TransactionRepo>(transactionTypes.TransactionRepo).to(TransactionRepo);
TransactionContainer.bind<TransactionService>(transactionTypes.TransactionService).to(
  TransactionService,
);
TransactionContainer.bind<TransactionController>(transactionTypes.TransactionController).to(
  TransactionController,
);

export default TransactionContainer;