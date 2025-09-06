import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import UserContainer from '../inversify/user.config';
import userTypes from '../types/userTypes.type';
import upload from '../middlewares/multer';
import validateBody from '../middlewares/validateBody';
import { userInputSchema } from '../zod/user.validation';
import isAdmin from '../middlewares/isAdmin';
import authorization from '../middlewares/authorization';

const router = Router();
const userController = UserContainer.get<UserController>(userTypes.UserController);

router.post(
  '/sign-up',
  upload.single('avatar'),
  validateBody(userInputSchema),
  userController.createUser,
);
router.get('/get-users', authorization, isAdmin, userController.getUsers);
router.get('/get-users/:id', authorization, userController.getUserById);
router.delete('/delete-user/:id', authorization, userController.deleteUser);
router.put('/update-user/:id', authorization, upload.single('avatar'), userController.updateUser);
router.post('/seed-admin', userController.seedAdmin);

export default router;
