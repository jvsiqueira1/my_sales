import AppError from "@shared/errors/AppError"
import { inject, injectable } from 'tsyringe'
import { IOrder } from "../domain/models/IOrder"
import { IOrdersRepository } from "../domain/repositories/IOrdersRepository"
import { privateDecrypt } from "crypto"
import { ICustomersRepository } from "@modules/customers/domain/repositories/ICustomersRepositories"
import { IProductsRepository } from "@modules/products/domain/repositories/IProductsRepository"

interface IProduct {
  id: string
  quantity: number
}

interface IRequest {
  customer_id: string
  products: IProduct[]
}

@injectable()
export default class CreateOrderService {
 constructor(
  @inject('OrdersRepository')
  private ordersRepository: IOrdersRepository,
  @inject('CustomersRepository')
  private customersRepository: ICustomersRepository,
  @inject('ProductsRepository')
  private productsRepository: IProductsRepository,
 ) {}
 async execute({ customer_id, products }: IRequest): Promise<IOrder> {
  const customerExists = await this.customersRepository.findById(Number(customer_id))

  if (!customerExists) {
    throw new AppError('Could not find any customer with the given id', 404)
  }

  // Converter ids para number
  const normalizedProducts = products.map(p => ({ ...p, id: Number(p.id) }))

  const existsProducts = await this.productsRepository.findAllByIds(normalizedProducts)

  if (!existsProducts.length) {
     throw new AppError('Could not find any products with the given ids', 404)
  }

  const existsProductsIds = existsProducts.map(product => product.id)

  const checkInexistentProducts = normalizedProducts.filter(product => !existsProductsIds.includes(product.id))

  if (checkInexistentProducts.length) {
      throw new AppError(`Could not find product ${checkInexistentProducts[0].id}.`, 404)
  }

  const quantityAvailable = normalizedProducts.filter(product => existsProducts.filter(p => p.id === product.id)[0].quantity < product.quantity)

  if (quantityAvailable.length) {
      throw new AppError(`The quantity ${quantityAvailable[0].quantity} is not available for ${quantityAvailable[0].id}.`, 409)
  }

  const serializedProducts = normalizedProducts.map(product => ({
      product_id: product.id, // agora number
      quantity: product.quantity,
      price: existsProducts.filter(p => p.id === product.id)[0].price,
    }))

    const order = await this.ordersRepository.create({
      customer: customerExists,
      products: serializedProducts,
    })

    const { order_products } = order

    const updatedProductQuantity = order_products.map(product => ({
      id: product.product_id,
      quantity:
        existsProducts.filter(p => p.id === product.product_id)[0].quantity -
        product.quantity,
    }))

    await this.productsRepository.updateStock(updatedProductQuantity)

    return order
 }

}
