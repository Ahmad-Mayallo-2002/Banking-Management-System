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
import transaction from './transaction/transaction.route';
import passport from 'passport';
import './utils/passport';
import { log } from 'console';
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
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api', user);
app.use('/api', auth);
app.use('/api', account);
app.use('/api', loan);
app.use('/api', transaction);

AppDataSource.initialize();

function isLoggedIn(req: Request, res: Response, next: NextFunction) {
  req.user ? next() : res.sendStatus(401);
}

app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'], prompt: 'select_account' }),
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/auth/failure',
    successRedirect: '/protected',
  }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  },
);

app.get('/protected', isLoggedIn, async (req: Request, res: Response) => {
  log(req);
  return sendResponse(200, 'OK', `Hello, asdasdasd`, res);
});

app.get('/auth/failure', async (req: Request, res: Response) => {
  return sendResponse(400, 'Error', `something went wrong....`, res);
});

app.get('/logout', (req: Request, res: Response, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.session.destroy(err => {
      if (err) return next(err);
      res.send('Goodbye!');
    });
  });
});

app.get('/', async (_req: Request, res: Response) => {
  res.send('<a href="/auth/google">Sign In with Google</a>');
});

app.use(globalErrorHandler);

app.listen(3000, () => console.log('http://localhost:3000'));
