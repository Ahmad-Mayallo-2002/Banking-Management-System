import { Container } from 'inversify';
import { UserRepo } from '../repos/user.repo';
import userTypes from '../types/user-types.type';
import { UserService } from '../services/user.service';
import { UserController } from '../controllers/user.controller';

const UserContainer = new Container();

UserContainer.bind<UserRepo>(userTypes.UserRepo).to(UserRepo);
UserContainer.bind<UserService>(userTypes.UserService).to(UserService);
UserContainer.bind<UserController>(userTypes.UserController).to(UserController);

export default UserContainer;
