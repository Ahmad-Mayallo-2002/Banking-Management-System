import express, { NextFunction, Request, Response } from 'express';
import 'reflect-metadata';
import cors from 'cors';
import helmet from 'helmet';
import session from 'express-session';
import { config } from 'dotenv';
import globalErrorHandler from './utils/errorHandler';
import { AppDataSource } from './data-source';
import sendResponse from './utils/response';
import apiLogger from './middlewares/api-logger.middleware';
import { StatusCodes } from 'http-status-codes';
import {
  addTransactionalDataSource,
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';
import user from './user/user.route';
import auth from './auth/auth.route';
import account from './account/account.route';
import loan from './loan/loan.route';
config();

// Initialization for TypeORM Transaction
initializeTransactionalContext({ storageDriver: StorageDriver.ASYNC_LOCAL_STORAGE });
addTransactionalDataSource(AppDataSource);

const app = express();

// Middlewares
app.use(express.json());
app.use(
  cors({
    methods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT'],
    credentials: true,
  }),
);
app.use(helmet());
app.use(
  session({
    secret: `${process.env.SESSION_SECRET}`,
    resave: false,
    saveUninitialized: true,
  }),
);
app.use(apiLogger);

// Routes
app.use('/api', user);
app.use('/api', auth);
app.use('/api', account);
app.use('/api', loan);

AppDataSource.initialize();

app.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  return sendResponse(StatusCodes.OK, 'Done', 'Hello, World!', res);
});

app.use(globalErrorHandler);

app.listen(3000, () => console.log('http://localhost:3000'));
