import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { CustomerService } from '../services/customer.service';
import { StatusCodes } from 'http-status-codes';
import customerTypes from '../types/customerTypes.type';

@injectable()
export class CustomerController {
  constructor(
    @inject(customerTypes.CustomerService) private readonly customerService: CustomerService,
  ) {}

  // ✅ Get all customers
  getCustomers = async (req: Request, res: Response): Promise<void> => {
    const customers = await this.customerService.getCustomers();
    res.status(StatusCodes.OK).json(customers);
  };

  // ✅ Get customer by ID
  getCustomerById = async (req: Request, res: Response): Promise<void> => {
    const customer = await this.customerService.getCustomerById(req.params.id);
    res.status(StatusCodes.OK).json(customer);
  };

  // ✅ Delete customer
  deleteCustomer = async (req: Request, res: Response): Promise<void> => {
    await this.customerService.deleteCustomer(req.params.id);
    res.status(StatusCodes.NO_CONTENT).send();
  };
}
