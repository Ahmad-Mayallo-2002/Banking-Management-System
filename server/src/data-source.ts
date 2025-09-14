import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { Account } from './entities/account.entity';
import { Loan } from './entities/loan.entity';
import { Transaction } from './entities/transaction.entity';

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


