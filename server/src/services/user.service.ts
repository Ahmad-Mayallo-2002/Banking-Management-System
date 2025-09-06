import { injectable } from 'inversify';
import { User } from '../entities/user';
import { UserRepo } from '../repos/user.repo';
import { inject } from 'inversify';
import TypeInject from '../types/userTypes.type';
import userTypes from '../types/userTypes.type';
import { UserInput } from '../zod/user.validation';

@injectable()
export class UserService {
  private repo: UserRepo;
  constructor(@inject(userTypes.UserRepo) repo: UserRepo) {
    this.repo = repo;
  }

  async createUser(data: UserInput): Promise<User> {
    return await this.repo.create(data);
  }

  async getUsers(): Promise<User[]> {
    return await this.repo.findAll();
  }

  async getUserById(id: string): Promise<User> {
    return await this.repo.findById(id);
  }

  async updateUser(id: string, data: Partial<UserInput>): Promise<boolean> {
    return await this.repo.update(id, data);
  }

  async deleteUser(id: string): Promise<boolean> {
    return await this.repo.delete(id);
  }

  async seedAdmin(): Promise<boolean> {
    return await this.repo.seedAdmin();
  }
}
