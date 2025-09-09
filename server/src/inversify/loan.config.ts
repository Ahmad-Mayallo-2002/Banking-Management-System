import { Container } from 'inversify';
import { LoanRepo } from '../repos/loan.repo';
import loanTypes from '../types/loan.type';
import { LoanService } from '../services/loan.service';
import { LoanController } from '../controllers/loan.controller';

const LoanContainer = new Container();

LoanContainer.bind<LoanRepo>(loanTypes.LoanRepo).to(LoanRepo);
LoanContainer.bind<LoanService>(loanTypes.LoanService).to(LoanService);
LoanContainer.bind<LoanController>(loanTypes.LoanController).to(LoanController);

export default LoanContainer;
