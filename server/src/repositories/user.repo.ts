import { Repository } from 'typeorm';
import { User } from '../entities/user';
import { AppDataSource } from '../data-source';
import { Roles } from '../enums/roles';

export class UserRepo {
  private repo: Repository<User>;
  constructor() {
    this.repo = AppDataSource.getRepository(User);
  }

  async create(input: Partial<User>): Promise<User> {
    const checkUser = await this.repo.findOne({ where: { id: input.email } });
    if (checkUser) throw new Error('Email is Already Exist');
    const user = this.repo.create(input);
    return await this.repo.save(user);
  }

  async findAll(): Promise<User[]> {
    const users = await this.repo.find({
      where: { role: Roles.CUSTOMER },
      relations: ['customer'],
    });
    return users;
  }

  async findById(id: string): Promise<User> {
    const user = (await this.repo.findOne({
      where: { id, role: Roles.CUSTOMER },
      relations: ['customers'],
    })) as User;
    return user;
  }

  async update(id: string, input: Partial<User>): Promise<boolean> {
    const user = await this.findById(id);
    const checkUser = await this.repo.findOne({ where: { id: input.email } });
    if (checkUser) throw new Error('Email is Already Exist');
    await this.repo.save(this.repo.merge(user, input));
    return true;
  }

  async delete(id: string): Promise<boolean> {
    await this.findById(id);
    const checkIfAdmin = await this.repo.findOne({
      where: { id, role: Roles.ADMIN },
    });
    if (checkIfAdmin) throw new Error('You Can not Delete Admin');
    await this.repo.delete(id);
    return true;
  }
}
