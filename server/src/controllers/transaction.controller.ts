import { inject } from 'inversify';
import { injectable } from 'inversify';
import transactionTypes from '../types/transaction.type';
import { TransactionService } from '../services/transaction.service';

@injectable()
export class TransactionController {
  constructor(
    @inject(transactionTypes.TransactionService) private transactionService: TransactionService,
  ) {}
}
