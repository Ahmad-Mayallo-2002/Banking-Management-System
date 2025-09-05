import { User } from '../entities/user';
import { UserRepo } from '../repositories/user.repo';

export class UserService {
  private repo: UserRepo;
  constructor() {
    this.repo = new UserRepo();
  }

  async createUser(data: Partial<User>): Promise<User> {
    return await this.repo.create(data);
  }

  async getUsers(): Promise<User[]> {
    return await this.repo.findAll();
  }

  async getUserById(id: string): Promise<User> {
    return await this.repo.findById(id);
  }

  async updateUser(id: string, data: Partial<User>): Promise<boolean> {
    return await this.repo.update(id, data);
  }

  async deleteUser(id: string): Promise<boolean> {
    return await this.repo.delete(id);
  }
}
