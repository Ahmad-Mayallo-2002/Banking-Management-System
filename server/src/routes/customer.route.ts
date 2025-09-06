import { Router } from 'express';
import CustomerContainer from '../inversify/customer.config';
import customerTypes from '../types/customerTypes.type';
import { CustomerController } from '../controllers/customer.controller';
import authorization from '../middlewares/authorization';
import isAdmin from '../middlewares/isAdmin';

const router = Router();
const customerContainer = CustomerContainer.get<CustomerController>(
  customerTypes.CustomerController,
);

router.get('/get-customers', authorization, isAdmin, customerContainer.getCustomers);
router.get('/get-customers/:id', authorization, isAdmin, customerContainer.getCustomerById);
router.delete('/delete-customer/:id', authorization, isAdmin, customerContainer.deleteCustomer);

export default router;
