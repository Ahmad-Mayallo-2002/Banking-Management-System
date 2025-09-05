import { Repository } from 'typeorm';
import { User } from '../entities/user';
import { AppDataSource } from '../data-source';
import { Roles } from '../enums/roles';
import AppError from '../utils/appError';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { injectable } from 'inversify';

@injectable()
export class UserRepo {
  private userRepo: Repository<User>;
  constructor() {
    this.userRepo = AppDataSource.getRepository(User);
  }

  async create(input: Partial<User>): Promise<User> {
    const checkUser = await this.userRepo.findOne({ where: { email: input.email } });
    if (checkUser)
      throw new AppError(
        'Email already exists',
        StatusCodes.BAD_REQUEST,
        ReasonPhrases.BAD_REQUEST,
      );
    const user = this.userRepo.create(input);
    return await this.userRepo.save(user);
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepo.find({
      where: { role: Roles.CUSTOMER },
      relations: ['customer'],
    });
    if (!users.length)
      throw new AppError('Users are not found', StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND);
    return users;
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id, role: Roles.CUSTOMER },
      relations: ['customers'],
    });
    if (!user) throw new AppError('User not found', StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND);
    return user;
  }

  async update(id: string, input: Partial<User>): Promise<boolean> {
    const user = await this.findById(id);
    const checkUser = await this.userRepo.findOne({ where: { id: input.email } });
    if (checkUser)
      throw new AppError('Email is Already Exist', StatusCodes.CONFLICT, ReasonPhrases.CONFLICT);
    await this.userRepo.save(this.userRepo.merge(user, input));
    return true;
  }

  async delete(id: string): Promise<boolean> {
    await this.findById(id);
    const checkIfAdmin = await this.userRepo.findOne({
      where: { id, role: Roles.ADMIN },
    });
    if (checkIfAdmin)
      throw new AppError(
        'You Can not Delete Admin',
        StatusCodes.BAD_REQUEST,
        ReasonPhrases.BAD_REQUEST,
      );
    await this.userRepo.delete(id);
    return true;
  }
}
