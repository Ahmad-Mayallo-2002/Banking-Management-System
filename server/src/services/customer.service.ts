import { injectable } from 'inversify';
import { CustomerRepo } from '../repos/customer.repo';
import { Customer } from '../entities/customer';
import { inject } from 'inversify';
import customerTypes from '../types/customerTypes.type';

@injectable()
export class CustomerService {
  private customerRepo: CustomerRepo;
  constructor(@inject(customerTypes.CustomerRepo) customerRepo: CustomerRepo) {
    this.customerRepo = customerRepo;
  }

  // ✅ Get all customers
  async getCustomers(): Promise<Customer[]> {
    return await this.customerRepo.findAll();
  }

  // ✅ Get customer by id
  async getCustomerById(id: string): Promise<Customer> {
    return await this.customerRepo.findById(id);
  }

  // ✅ Delete customer
  async deleteCustomer(id: string): Promise<void> {
    return await this.customerRepo.delete(id);
  }
}
