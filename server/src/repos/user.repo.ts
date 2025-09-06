import { Repository } from 'typeorm';
import { User } from '../entities/user';
import { AppDataSource } from '../data-source';
import { Roles } from '../enums/roles';
import AppError from '../utils/appError';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { injectable } from 'inversify';
import { Customer } from '../entities/customer';
import { hash } from 'bcryptjs';
import { config } from 'dotenv';
import uploadToCloudinary from '../utils/cloudinaryUpload';
import { v2 } from 'cloudinary';
import { UserInput } from '../zod/user.validation';
config();

@injectable()
export class UserRepo {
  private userRepo: Repository<User>;
  private customerRepo: Repository<Customer>;
  constructor() {
    this.userRepo = AppDataSource.getRepository(User);
    this.customerRepo = AppDataSource.getRepository(Customer);
  }

  async create(input: UserInput): Promise<User> {
    const checkUser = await this.userRepo.findOne({ where: { email: input.email } });
    if (checkUser)
      throw new AppError(
        'Email already exists',
        StatusCodes.BAD_REQUEST,
        ReasonPhrases.BAD_REQUEST,
      );
    const { secure_url, public_id } = await uploadToCloudinary(input.avatar);
    const user = this.userRepo.create({
      username: input.username,
      email: input.email,
      phone: input.email,
      password: await hash(input.password, 10),
      avatar: {
        url: secure_url,
        public_id,
      },
    });
    const savedUser = await this.userRepo.save(user);
    const customer = this.customerRepo.create({
      userId: savedUser.id,
      user,
      address: input.address,
    });
    await this.customerRepo.save(customer);
    return savedUser;
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
      relations: ['customer'],
    });
    if (!user) throw new AppError('User not found', StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND);
    return user;
  }

  async update(id: string, input: Partial<UserInput>): Promise<boolean> {
    const user = await this.findById(id);
    const updateData: Partial<User> = {};

    if (input.email) {
      const exists = await this.userRepo.findOne({ where: { email: input.email } });
      if (exists)
        throw new AppError('Email already in use', StatusCodes.CONFLICT, ReasonPhrases.CONFLICT);
      updateData.email = input.email;
    }

    if (input.username) updateData.username = input.username;
    if (input.phone) updateData.phone = input.phone;
    if (input.password) updateData.password = await hash(input.password, 10);
    if (input.avatar) {
      v2.api.delete_all_resources([user.avatar.public_id]);
      const { secure_url, public_id } = await uploadToCloudinary(input.avatar);
      updateData.avatar = { url: secure_url, public_id };
    }
    await this.userRepo.update(id, updateData);
    return true;
  }

  async delete(id: string): Promise<boolean> {
    const user = await this.findById(id);
    const checkIfAdmin = await this.userRepo.findOne({
      where: { id, role: Roles.ADMIN },
    });
    if (checkIfAdmin)
      throw new AppError(
        'You Can not Delete Admin',
        StatusCodes.BAD_REQUEST,
        ReasonPhrases.BAD_REQUEST,
      );
    v2.api.delete_all_resources([user.avatar.public_id]);
    await this.userRepo.delete(id);
    return true;
  }

  async seedAdmin(): Promise<boolean> {
    const admin = await this.userRepo.findOneBy({ role: Roles.ADMIN });
    if (admin)
      throw new AppError(
        'No more than one admin',
        StatusCodes.BAD_REQUEST,
        ReasonPhrases.BAD_REQUEST,
      );
    const newAdmin = this.userRepo.create({
      username: process.env.ADMIN_USERNAME,
      email: process.env.ADMIN_EMAIL,
      password: await hash(`${process.env.ADMIN_PASSWORD}`, 10),
      phone: process.env.ADMIN_PHONE,
    });
    await this.userRepo.save(newAdmin);
    return true;
  }
}
