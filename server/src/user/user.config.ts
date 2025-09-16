import { Container } from 'inversify';
import userTypes from '../types/user.type';
import { UserRepo } from './user.repo';
import { UserService } from './user.service';
import { UserController } from './user.controller';

const UserContainer = new Container();

UserContainer.bind<UserRepo>(userTypes.UserRepo).to(UserRepo);
UserContainer.bind<UserService>(userTypes.UserService).to(UserService);
UserContainer.bind<UserController>(userTypes.UserController).to(UserController);

export default UserContainer;
