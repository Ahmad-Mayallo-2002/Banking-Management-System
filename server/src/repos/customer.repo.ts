import { injectable } from 'inversify';
import { Repository } from 'typeorm';
import { Customer } from '../entities/customer';
import { AppDataSource } from '../data-source';
import AppError from '../utils/appError';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

@injectable()
export class CustomerRepo {
  private customerRepo: Repository<Customer>;

  constructor() {
    this.customerRepo = AppDataSource.getRepository(Customer);
  }

  // ✅ Get all customers
  async findAll(): Promise<Customer[]> {
    const customers = await this.customerRepo.find({ relations: ['user'] });
    if (!customers.length) {
      throw new AppError('No customers found', StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND);
    }
    return customers;
  }

  // ✅ Get customer by ID
  async findById(id: string): Promise<Customer> {
    const customer = await this.customerRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!customer) {
      throw new AppError(`Customer not found`, StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND);
    }
    return customer;
  }

  // ✅ Delete customer
  async delete(id: string): Promise<void> {
    const customer = await this.findById(id); // will throw if not found
    await this.customerRepo.remove(customer);
  }
}
