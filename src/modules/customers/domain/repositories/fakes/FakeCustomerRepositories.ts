import { Customer } from "@modules/customers/infra/database/entities/Customer";
import { ICustomersRepository, Pagination } from "../ICustomersRepositories";
import { ICreateCustomer } from "../../models/ICreateCustomer";
import { ICustomer } from "../../models/ICustomer";

export default class FakeCustomerRepositories implements ICustomersRepository {
  private customers: Customer[] = []

  async create({ name, email }: ICreateCustomer): Promise<Customer> {
    const customer = new Customer()

    customer.id = this.customers.length + 1
    customer.name = name
    customer.email = email

    this.customers.push(customer)

    return customer
  }

  async save(customer: Customer): Promise<Customer> {
    const findIndex = this.customers.findIndex(
      findCustomer => findCustomer.id === customer.id
    )

    this.customers[findIndex] = customer

    return customer
  }

  async remove(customer: Customer): Promise<void> {
    const index = this.customers.findIndex(c => c.id === customer.id)
    if (index !== -1) {
      this.customers.splice(index, 1)
    }
  }

  async findAll(): Promise<Customer[] | undefined> {
    return this.customers
  }

  async findByName(name: string): Promise<Customer | null> {
    const customer = this.customers.find(customer => customer.name === name)
    return customer as Customer | null
  }

  async findById(id: number): Promise<ICustomer | null> {
    const customer = this.customers.find(customer => customer.id === id)
    return customer as Customer | null
  }

  async findByEmail(email: string): Promise<ICustomer | null> {
    const customer = this.customers.find(customer => customer.email === email)
    return customer as Customer | null
  }

  async findAndCount(pagination: Pagination): Promise<[ICustomer[], number]> {
    const { take, skip } = pagination;
    const data = this.customers.slice(skip, skip + take);
    return [data, this.customers.length];
  }
}
