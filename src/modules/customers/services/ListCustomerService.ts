import { Customer } from "../database/entities/Customer";
import { customerRepositories } from "../database/repositories/CustomerRepositories";

export default class ListCustomerService {
  async execute(): Promise<Customer[]> {
    const customers = customerRepositories.find()
    return customers
  }
}
