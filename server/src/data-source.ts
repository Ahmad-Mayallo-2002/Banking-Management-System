import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { User } from './entities/user';
import { Customer } from './entities/customer';

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
  entities: [User, Customer],
  migrations: [],
  subscribers: [],
});
