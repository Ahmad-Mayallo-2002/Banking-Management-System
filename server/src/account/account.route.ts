import { Router } from 'express';
import accountContainer from './account.container';
import accountTypes from '../types/account.type';
import { AccountController } from './account.controller';
import authorization from '../middlewares/authorization.middleware';
import isAdmin from '../middlewares/is-admin.middleware';

const router = Router();
const controller = accountContainer.get<AccountController>(accountTypes.AccountController);

router.post('/create-account', authorization, controller.createAccountByUser);
router.delete('/delete-account/:id', authorization, controller.deleteAccount);
router.get('/get-accounts/:id', authorization, controller.getAccountById);
router.get('/get-user-accounts/:userId', authorization, controller.getAccountsByUserId);

// For admin only
router.put('/update-account-status/:id', authorization, isAdmin, controller.updateAccountStatus);
router.get('/get-accounts', authorization, isAdmin, controller.getAllAccounts);

export default router;
