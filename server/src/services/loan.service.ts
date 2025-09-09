import { inject } from 'inversify';
import { injectable } from 'inversify';
import loanTypes from '../types/loan.type';
import { LoanRepo } from '../repos/loan.repo';

@injectable()
export class LoanService {
  constructor(@inject(loanTypes.LoanRepo) private loanRepo: LoanRepo) {}
}
