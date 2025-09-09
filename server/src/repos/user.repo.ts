import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { Customer } from "../entities/customer.entity";
import { AppDataSource } from "../data-source";
import { injectable } from "inversify";

@injectable()
export class UserRepo {
  private userRepo: Repository<User>;
  private customerRepo: Repository<Customer>;
  constructor() {
    this.userRepo = AppDataSource.getRepository(User);
    this.customerRepo = AppDataSource.getRepository(Customer);
  }

  async create(user: Partial<User>): Promise<User> {
    return this.userRepo.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  async findAll(): Promise<User[]> {
    return this.userRepo.find({ relations: ['customer'] });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { id }, relations: ['customer'] });
  }

  async update(id: string, data: Partial<User>): Promise<void> {
    await this.userRepo.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.userRepo.delete(id);
  }

  async createCustomer(customer: Partial<Customer>): Promise<Customer> {
    return this.customerRepo.save(customer);
  }

  async findCustomers(): Promise<Customer[]> {
    return this.customerRepo.find({ relations: ['user', 'accounts'] });
  }

  async findCustomerById(userId: string): Promise<Customer | null> {
    return this.customerRepo.findOne({ where: { userId }, relations: ['user', 'accounts'] });
  }
}
