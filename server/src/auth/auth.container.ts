import { Container } from 'inversify';
import authTypes from '../types/auth.type';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

export const authContainer = new Container();

authContainer.bind<AuthService>(authTypes.AuthService).to(AuthService);
authContainer.bind<AuthController>(authTypes.AuthController).to(AuthController);
