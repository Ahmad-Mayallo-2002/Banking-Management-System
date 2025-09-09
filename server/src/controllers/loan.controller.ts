import { inject } from 'inversify';
import { injectable } from 'inversify';
import loanTypes from '../types/loan.type';
import { LoanService } from '../services/loan.service';

@injectable()
export class LoanController {
  constructor(@inject(loanTypes.LoanService) private loanService: LoanService) {}
}
