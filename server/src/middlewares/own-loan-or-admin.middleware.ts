import { Request, Response, NextFunction } from 'express';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { Roles } from '../enums/roles.enum';
import { Account } from '../account/account.entity';
import { AppDataSource } from '../data-source';
import AppError from '../utils/appError';

async function ownLoanOrAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const { accountId } = req.params;
    const user = (req as any).user;

    const accountRepo = AppDataSource.getRepository(Account);
    const account = await accountRepo.findOneBy({ id: accountId });

    if (!account)
      throw new AppError('Account not found', StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND);

    if (account.userId !== user.id && user.role !== Roles.ADMIN)
      throw new AppError('Access is denied', StatusCodes.FORBIDDEN, ReasonPhrases.FORBIDDEN);

    next();
  } catch (err) {
    next(err);
  }
}

export default ownLoanOrAdmin;
