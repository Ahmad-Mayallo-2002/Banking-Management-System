import { Container } from 'inversify';
import { CustomerRepo } from '../repos/customer.repo';
import customerTypes from '../types/customerTypes.type';
import { CustomerService } from '../services/customer.service';
import { CustomerController } from '../controllers/customer.controller';

const CustomerContainer = new Container();

CustomerContainer.bind<CustomerRepo>(customerTypes.CustomerRepo).to(CustomerRepo);
CustomerContainer.bind<CustomerService>(customerTypes.CustomerService).to(CustomerService);
CustomerContainer.bind<CustomerController>(customerTypes.CustomerController).to(CustomerController);

export default CustomerContainer;