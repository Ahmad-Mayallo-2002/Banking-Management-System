import { Container } from 'inversify';
import loanTypes from '../types/loan.type';
import { LoanRepo } from './loan.repo';
import { LoanService } from './loan.service';
import { LoanController } from './loan.controller';

const LoanContainer = new Container();

LoanContainer.bind<LoanRepo>(loanTypes.LoanRepo).to(LoanRepo);
LoanContainer.bind<LoanService>(loanTypes.LoanService).to(LoanService);
LoanContainer.bind<LoanController>(loanTypes.LoanController).to(LoanController);

export default LoanContainer;
