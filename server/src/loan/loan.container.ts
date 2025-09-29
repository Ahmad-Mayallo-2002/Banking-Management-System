import { Container } from "inversify";
import loanTypes from "../types/loan.type";
import { LoanService } from "./loan.service";
import { LoanController } from "./loan.controller";

const loanContainer = new Container();

loanContainer.bind<LoanService>(loanTypes.LoanService).to(LoanService);
loanContainer.bind<LoanController>(loanTypes.LoanController).to(LoanController);

export default loanContainer;