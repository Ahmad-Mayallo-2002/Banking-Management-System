import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { injectable } from 'inversify';
import { User } from './user.entity';
import AppError from '../utils/appError';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { UserInput } from './zod/user.zod';
import { UploaderContext } from '../utils/uploader';
import { v2 } from 'cloudinary';

@injectable()
export class UserService {
  private userRepo: Repository<User>;

  constructor() {
    this.userRepo = AppDataSource.getRepository(User);
  }

  async getAll(): Promise<User[]> {
    const users = await this.userRepo.find();
    if (!users.length)
      throw new AppError('No users found', StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND);
    return users;
  }

  async getById(id: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new AppError('User not found', StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND);
    return user;
  }

  async update(input: Partial<UserInput>, id: string): Promise<string> {
    const user = await this.getById(id);
    const body: Record<string, unknown> = input;
    if (input.email) {
      const currentEmail = await this.userRepo.findOneBy({ email: input.email });
      if (currentEmail)
        throw new AppError('Email is already exist', StatusCodes.CONFLICT, ReasonPhrases.CONFLICT);
    }
    if (input.phone) {
      const currentPhone = await this.userRepo.findOneBy({ email: input.phone });
      if (currentPhone)
        throw new AppError(
          'Number phone is already exist',
          StatusCodes.CONFLICT,
          ReasonPhrases.CONFLICT,
        );
    }
    if (input.avatar) {
      await v2.api.delete_all_resources([user.avatar.public_id]);
      const uploader = new UploaderContext();
      const { public_id, secure_url } = await uploader.setStrategy('cloudinary', input.avatar);
      body.avatar = {
        public_id,
        url: secure_url,
      };
    }
    Object.assign(user, body);
    await this.userRepo.save(user);
    return 'User updated successfully';
  }

  async delete(id: string): Promise<string> {
    const user = await this.getById(id);
    await this.userRepo.remove(user);
    return `User deleted successfully`;
  }
}
