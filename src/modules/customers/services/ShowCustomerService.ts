import AppError from "@shared/errors/AppError";
import { Customer } from "../database/entities/Customer";
import { customerRepositories } from "../database/repositories/CustomerRepositories";

interface IShowCustomer {
  id: number
}

export default class ShowCustomerService {
  async execute({ id }: IShowCustomer): Promise<Customer> {
    const customer = await customerRepositories.findById(id)

    if (!customer) {
      throw new AppError('Customer not found', 404)
    }

    return customer
  }
}
