import AppError from "@shared/errors/AppError"
import { Customer } from "../infra/database/entities/Customer"
import { customerRepositories } from "../infra/database/repositories/CustomerRepositories"


interface IUpdateCustomer {
  id: number
  name: string
  email: string
}

export default class UpdateCustomerService {
  async execute({ id, name, email }: IUpdateCustomer): Promise<Customer> {
    const customer = await customerRepositories.findById(id)

    if(!customer) {
      throw new AppError('Customer not found')
    }

    const customerExists = await customerRepositories.findByEmail(email)

    if(customerExists && email !== customer.email) {
      throw new AppError('There is already onde customer with this email')
    }

    customer.name = name
    customer.email = email

    await customerRepositories.save(customer)

    return customer
  }
}
