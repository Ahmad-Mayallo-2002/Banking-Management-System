import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { User } from './user/user.entity';
import { Account } from './account/account.entity';
import { Loan } from './loan/loan.entity';
import { Transaction } from './transaction/transaction.entity';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: true,
  entities: [User, Account, Loan, Transaction],
  migrations: [],
  subscribers: [],
});


