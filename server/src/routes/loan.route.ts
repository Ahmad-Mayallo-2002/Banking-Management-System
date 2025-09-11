import { Router } from "express";
import LoanContainer from "../inversify/loan.config";
import { LoanController } from "../controllers/loan.controller";
import loanTypes from "../types/loan.type";
import authorization from "../middlewares/authorization.middleware";
import isAdmin from "../middlewares/is-admin.middleware";

const router = Router();
const loanController = LoanContainer.get<LoanController>(loanTypes.LoanController);

router.get("/get-account-loans", authorization, loanController.getAccountLoans);
router.get("/get-loan/:id", authorization, loanController.getLoanById);

// Admin APIs
router.get("/get-loans", authorization, isAdmin, loanController.getAllLoans);
router.delete("/delete-loan/:id", authorization, isAdmin, loanController.deleteLoan);
router.put("/update-loan-paid", authorization, isAdmin, loanController.updateLoanIsPaid);

export default router;