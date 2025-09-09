import { inject } from 'inversify';
import { injectable } from 'inversify';
import transactionTypes from '../types/transaction.type';
import { TransactionRepo } from '../repos/transaction.repo';

@injectable()
export class TransactionService {
  constructor(@inject(transactionTypes.TransactionRepo) private transactionRepo: TransactionRepo) {}
}
