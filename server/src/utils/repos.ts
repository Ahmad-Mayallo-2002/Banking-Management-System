import { AppDataSource } from '../data-source';
import { Customer } from '../entities/customer';
import { User } from '../entities/user';

export const userRepo = AppDataSource.getRepository(User);
export const customerRepo = AppDataSource.getRepository(Customer);
