import { Router } from "express";
import transactionContainer from "./transaction.container";
import { TransactionController } from "./transaction.controller";
import transactionTypes from "../types/transaction.type";
import authorization from "../middlewares/authorization.middleware";
import isAdmin from "../middlewares/is-admin.middleware";

const router = Router();
const controller = transactionContainer.get<TransactionController>(
  transactionTypes.TransactionController,
);

router.post("/create-transaction", authorization, controller.createTransaction);

// For admin only
router.get("/get-transactions", authorization, isAdmin, controller.getAllTransactions);
router.get("/get-transactions/:id", authorization, isAdmin, controller.getTransactionById);
router.get("/get-transactions-account", authorization, isAdmin, controller.getTransactionsByAccount);
router.delete("/delete-transaction/:id", authorization, isAdmin, controller.deleteTransaction);



export default router;