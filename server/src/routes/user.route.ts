import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import UserContainer from '../inversify/user.config';
import userTypes from '../types/userTypes.type';

const router = Router();
const userController = UserContainer.get<UserController>(userTypes.UserController);

router.post('/create-user', userController.createUser);
router.get('/get-users', userController.getUsers);
router.get('/get-users/:id', userController.getUserById);
router.delete('/delete-user/:id', userController.deleteUser);
router.put('/update-user/:id', userController.updateUser);

export default router;
