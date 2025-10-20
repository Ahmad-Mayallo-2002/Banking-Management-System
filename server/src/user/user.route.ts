import { Router } from 'express';
import authorization from '../middlewares/authorization.middleware';
import isAdmin from '../middlewares/is-admin.middleware';
import userContainer from './user.container';
import userTypes from '../types/user.type';
import { UserController } from './user.controller';

const router = Router();
const controller = userContainer.get<UserController>(userTypes.UserController);

router.get('/get-user', authorization, controller.getByIdByUser);
router.delete('/delete-user', authorization, controller.deleteByUser);
router.put('/update-user', authorization, controller.updateByUser);

// For Admin Only
router.get('/get-users', authorization, isAdmin, controller.getAll);
router.get('/get-users/:id', authorization, isAdmin, controller.getByIdByAdmin);
router.delete('/delete-user/:id', authorization, isAdmin, controller.deleteByAdmin);
router.put('/update-user/:id', authorization, isAdmin, controller.updateByAdmin);

export default router;
