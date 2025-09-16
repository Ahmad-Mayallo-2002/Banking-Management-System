import { Router } from 'express';
import transactionTypes from '../types/transaction.type';
import authorization from '../middlewares/authorization.middleware';
import isAdmin from '../middlewares/is-admin.middleware';
import TransactionContainer from './transaction.config';
import { TransactionController } from './transaction.controller';

const router = Router();
const transactionController = TransactionContainer.get<TransactionController>(
  transactionTypes.TransactionController,
);

router.get('/get-transactions/:id', authorization, transactionController.getTransactionById);
router.get(
  '/get-customer-transactions',
  authorization,
  transactionController.getCustomerTransactions,
);
router.post('/create-transaction', authorization, transactionController.createTransaction);

// Admin APIs
router.delete(
  '/delete-transaction/:id',
  authorization,
  isAdmin,
  transactionController.deleteTransaction,
);
router.put(
  '/update-transaction-status/:id',
  authorization,
  isAdmin,
  transactionController.updateTransactionStatus,
);
router.get('/get-transactions', authorization, isAdmin, transactionController.getAllTransactions);

export default router;
