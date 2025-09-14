import { Router } from 'express';
import AccountContainer from '../inversify/account.config';
import { AccountController } from '../controllers/account.controller';
import authorization from '../middlewares/authorization.middleware';
import isAdmin from '../middlewares/is-admin.middleware';
import accountTypes from '../types/account.type';

const router = Router();
const accountController = AccountContainer.get<AccountController>(accountTypes.AccountController);

router.post('/create-account', authorization, accountController.createAccount);
router.get('/get-user-accounts', authorization, accountController.getAccountsByUserId);
router.get('/get-accounts/:id', authorization, accountController.getAccountById);


// Admin APIs
router.get('/get-accounts', authorization, isAdmin, accountController.getAllAccounts);
router.put(
  '/activate-or-deactivate-account/:id',
  authorization,
  isAdmin,
  accountController.activateOrDeactivateAccount,
);
router.delete('/delete-account/:id', authorization, isAdmin, accountController.deleteAccount);

export default router;
