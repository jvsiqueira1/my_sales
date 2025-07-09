import { IOrdersRepository } from "@modules/orders/domain/repositories/IOrdersRepository"
import { Repository } from "typeorm"
import { Order } from "../entities/Order"
import { AppDataSource } from "@shared/infra/typeorm/data-source"
import { IOrder } from "@modules/orders/domain/models/IOrder"
import { IOrderPaginate } from "@modules/orders/domain/models/IOrderPaginate"
import { ICreateOrder } from "@modules/orders/domain/models/ICreateOrder"
import { OrdersProducts } from "../entities/OrdersProducts"
import { ICreateOrderProducts } from "@modules/orders/domain/models/ICreateOrderProducts"


type SearchParams = {
  page: number
  skip: number
  take: number
}

export default class OrdersRepository implements IOrdersRepository {
  private ormRepository: Repository<Order>

  constructor() {
    this.ormRepository = AppDataSource.getRepository(Order)
  }

  async findById(id: number): Promise<IOrder | null> {
    const order = await this.ormRepository.findOne({
      where: { id },
      relations: ['order_products', 'customer']
    })
    return order ? toIOrder(order) : null
  }

  async findAll({
    page, skip, take
  }: SearchParams): Promise<IOrderPaginate>{
    const [orders, count] = await this.ormRepository.findAndCount({
      skip,
      take,
      relations: ['order_products', 'customer']
    })
    return {
      per_page: take,
      total: count,
      current_page: page,
      data: orders.map(toIOrder)
    }
  }

  async create({ customer, products }: ICreateOrder): Promise<IOrder> {
    const order = this.ormRepository.create({
      customer,
      order_products: products as any // ajuste se necessário
    })
    await this.ormRepository.save(order)
    return toIOrder(order)
  }
}

function toIOrder(order: Order): IOrder {
  return {
    id: order.id,
    customer: order.customer as any, // ajuste se necessário
    order_products: order.order_products?.map((op: OrdersProducts) => ({
      id: op.id,
      order: op.order?.id ?? undefined,
      product_id: Number(op.product_id),
      price: op.price,
      quantity: op.quantity,
      created_at: op.created_at,
      updated_at: op.updated_at,
    })) as ICreateOrderProducts[],
    created_at: order.created_at,
    updated_at: order.updated_at,
  }
}
