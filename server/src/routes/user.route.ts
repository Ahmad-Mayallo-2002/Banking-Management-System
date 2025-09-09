import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import UserContainer from '../inversify/user.config';
import userTypes from '../types/user-types.type';
import upload from '../middlewares/multer.middleware';
import isAdmin from '../middlewares/is-admin.middleware';
import authorization from '../middlewares/authorization.middleware';

const router = Router();
const userController = UserContainer.get<UserController>(userTypes.UserController);

router.post('/sign-up', upload.single('avatar'), userController.createUser);
router.get('/get-user', authorization, userController.getUserById);
router.delete('/delete-user', authorization, userController.deleteUser);
router.put('/update-user', authorization, upload.single('avatar'), userController.updateUser);
router.post('/seed-admin', userController.seedAdmin);

// Admin APIs
router.get('/get-users', userController.getUsers);
router.get('/get-users/:id', userController.getUserByIdByAdmin);
router.delete('/delete-user/:id', userController.deleteUserByAdmin);
router.put(
  '/update-user/:id',

  upload.single('avatar'),
  userController.updateUserByAdmin,
);

export default router;
