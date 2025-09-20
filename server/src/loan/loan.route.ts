import { Router } from 'express';
import loanContainer from './loan.container';
import loanTypes from '../types/loan.type';
import { LoanController } from './loan.controller';
import authorization from '../middlewares/authorization.middleware';
import isAdmin from '../middlewares/is-admin.middleware';
import ownLoanOrAdmin from '../middlewares/own-loan-or-admin.middleware';

const router = Router();
const container = loanContainer.get<LoanController>(loanTypes.LoanController);

router.get('/get-loans/:id', authorization, ownLoanOrAdmin, container.getLoanById);
router.get(
  '/get-account-loans/:accountId',
  authorization,
  ownLoanOrAdmin,
  container.getLoansByAccountId,
);

// For admin only
router.get('/get-loans', authorization, isAdmin, container.getAllLoans);
router.delete('/delete-loan/:id', authorization, isAdmin, container.deleteLoan);

export default router;
