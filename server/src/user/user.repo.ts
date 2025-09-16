import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { injectable } from 'inversify';
import { User } from './user.entity';

@injectable()
export class UserRepo {
  private userRepo: Repository<User>;
  constructor() {
    this.userRepo = AppDataSource.getRepository(User);
  }

  async create(user: Partial<User>): Promise<User> {
    return this.userRepo.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  async findAll(): Promise<User[]> {
    return this.userRepo.find({ relations: ['accounts'] });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { id }, relations: ['accounts'] });
  }

  async update(id: string, data: Partial<User>): Promise<void> {
    await this.userRepo.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.userRepo.delete(id);
  }

  async updatePassword(email: string, password: string): Promise<boolean> {
    await this.userRepo.update({ email }, { password });
    return true;
  }
}
