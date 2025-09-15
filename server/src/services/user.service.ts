import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import AppError from '../utils/appError';
import { inject } from 'inversify';
import { injectable } from 'inversify';
import { UserRepo } from '../repos/user.repo';
import { User } from '../entities/user.entity';
import { UserInput } from '../zod/user.validation';
import userTypes from '../types/user.type';
import { hash } from 'bcryptjs';
import { Roles } from '../enums/roles.enum';
import { v2 } from 'cloudinary';
import { sendMail } from '../utils/sendMail';
import { redis } from '../utils/redis';
import { UploaderContext } from '../utils/uploader';
import { config } from 'dotenv';

config();

@injectable()
export class UserService {
  constructor(@inject(userTypes.UserRepo) private repo: UserRepo) {}

  async createUser(data: UserInput): Promise<User> {
    const exists = await this.repo.findByEmail(data.email);
    if (exists)
      throw new AppError(
        'Email already exists',
        StatusCodes.BAD_REQUEST,
        ReasonPhrases.BAD_REQUEST,
      );

    const uploader = new UploaderContext();
    const { secure_url, public_id } = await uploader.setStrategy('cloudinary', data.avatar);
    const hashedPassword = await hash(data.password, 10);

    const user = await this.repo.create({
      ...data,
      password: hashedPassword,
      avatar: {
        public_id,
        url: secure_url,
      },
    });

    return user;
  }

  async getUsers(): Promise<User[]> {
    const users = await this.repo.findAll();
    if (!users.length)
      throw new AppError('Users not found', StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND);
    return users;
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.repo.findById(id);
    if (!user) throw new AppError('User not found', StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND);
    return user;
  }

  async updateUser(id: string, data: Partial<UserInput>): Promise<string> {
    const user = await this.getUserById(id);
    const updateData: Partial<User> = {};

    if (data.email) {
      const exists = await this.repo.findByEmail(data.email);
      if (exists)
        throw new AppError('Email already in use', StatusCodes.CONFLICT, ReasonPhrases.CONFLICT);
      updateData.email = data.email;
    }

    if (data.password) {
      updateData.password = await hash(data.password, 10);
    }

    if (data.avatar) {
      v2.api.delete_all_resources([user.avatar.public_id]);
      const uploader = new UploaderContext();
      const { secure_url, public_id } = await uploader.setStrategy('cloudinary', data.avatar);
      updateData.avatar = { url: secure_url, public_id };
    }

    await this.repo.update(id, updateData);

    return 'User updated successfully';
  }

  async deleteUser(id: string): Promise<string> {
    const user = await this.getUserById(id);
    if (user.role === Roles.ADMIN) {
      throw new AppError(
        'You cannot delete an Admin',
        StatusCodes.BAD_REQUEST,
        ReasonPhrases.BAD_REQUEST,
      );
    }
    v2.api.delete_all_resources([user.avatar.public_id]);
    await this.repo.delete(id);
    return 'User deleted successfully';
  }

  async seedAdmin(): Promise<string> {
    const admin = await this.repo.findByEmail(process.env.ADMIN_EMAIL!);
    if (admin && admin.role === Roles.ADMIN) {
      throw new AppError(
        'No more than one admin allowed',
        StatusCodes.BAD_REQUEST,
        ReasonPhrases.BAD_REQUEST,
      );
    }
    const hashedPassword = await hash(`${process.env.ADMIN_PASSWORD}`, 10);
    await this.repo.create({
      username: process.env.ADMIN_USERNAME,
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      phone: process.env.ADMIN_PHONE,
      role: Roles.ADMIN,
    });
    return 'Admin is created';
  }

  async sendVerificationCode(email: string): Promise<string> {
    const user = await this.repo.findByEmail(email);
    // if (!user) throw new AppError('User not found', StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND);
    const code = await sendMail(email);
    await redis.set('code', code);
    await redis.set('email', email);
    return 'Verification code is sent successfully';
  }

  async validateCode(code: string): Promise<string> {
    const cachedCode = await redis.get('code');
    if (code !== cachedCode)
      throw new AppError(
        'Invalid verification code',
        StatusCodes.BAD_REQUEST,
        ReasonPhrases.BAD_REQUEST,
      );
    await redis.del('code');
    return 'Code is validated successfully';
  }

  async updatePassword(password: string, confirmPassword: string): Promise<string> {
    const email = (await redis.get('email')) as string;
    await this.repo.updatePassword(email, password);
    return 'Password is updated successfully';
  }
}
