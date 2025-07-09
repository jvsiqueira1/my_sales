import AppError from "@shared/errors/AppError"
import { Customer } from "../infra/database/entities/Customer"
import { IUpdateCustomer } from "../domain/models/IUpdateCustomer"
import { ICustomersRepository } from "../domain/repositories/ICustomersRepositories"
import { inject, injectable } from 'tsyringe'

@injectable()
export default class UpdateCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customerRepositories: ICustomersRepository
  ) {}
  async execute({ id, name, email }: IUpdateCustomer): Promise<Customer> {
    const customer = await this.customerRepositories.findById(Number(id))

    if(!customer) {
      throw new AppError('Customer not found')
    }

    const customerExists = await this.customerRepositories.findByEmail(email)

    if(customerExists && email !== customer.email) {
      throw new AppError('There is already onde customer with this email')
    }

    customer.name = name
    customer.email = email

    await this.customerRepositories.save(customer)

    return customer
  }
}
