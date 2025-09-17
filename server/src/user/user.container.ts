import { Container } from 'inversify';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import userTypes from '../types/user.type';

const userContainer = new Container();

userContainer.bind<UserService>(userTypes.UserService).to(UserService);
userContainer.bind<UserController>(userTypes.UserController).to(UserController);

export default userContainer;