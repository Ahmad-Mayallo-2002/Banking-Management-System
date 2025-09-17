import { Router } from 'express';
import { authContainer } from './auth.container';
import authTypes from '../types/auth.type';
import { AuthController } from './auth.controller';
import upload from '../middlewares/multer.middleware';

const router = Router();
const controller = authContainer.get<AuthController>(authTypes.AuthController);

router.post('/login', controller.login);
router.post('/sign-up', upload.single('avatar'), controller.signUp);
router.post('/send-verification-code', controller.sendVerificationCode);
router.post('/compare-code', controller.compareCode);
router.put('/update-password', controller.updatePassword);

export default router;
