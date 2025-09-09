import { AppDataSource } from '../data-source';
import { Customer } from '../entities/customer.entity';
import { User } from '../entities/user.entity';

export const userRepo = AppDataSource.getRepository(User);
export const customerRepo = AppDataSource.getRepository(Customer);
