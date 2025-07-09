import { In, Repository } from "typeorm"
import { IProductsRepository } from "@modules/products/domain/repositories/IProductsRepository"
import { ICreateProduct } from "@modules/products/domain/models/ICreateProduct"
import { IProduct } from "@modules/products/domain/models/IProduct"
import { IOrderProducts } from "@modules/orders/domain/models/IOrderProducts"
import { OrdersProducts } from "@modules/orders/infra/database/entities/OrdersProducts"
import { IProductPaginate } from "@modules/products/domain/models/IProductPaginate"

import { AppDataSource } from "@shared/infra/typeorm/data-source"
import { Product } from "../entities/Product"


interface SearchParams {
  page: number
  skip: number
  take: number
}

export class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>

  constructor() {
    this.ormRepository = AppDataSource.getRepository(Product)
  }

  async create({
    name, price, quantity
  }: ICreateProduct): Promise<IProduct> {
    const product = this.ormRepository.create({ name, price, quantity })
    await this.ormRepository.save(product)
    return this.toIProduct(product)
  }

  async save(product: IProduct): Promise<IProduct> {
    const entity = await this.ormRepository.findOne({ where: { id: product.id }, relations: ['order_products'] })
    if (!entity) throw new Error('Product not found')
    entity.name = product.name
    entity.price = product.price
    entity.quantity = product.quantity
    await this.ormRepository.save(entity)
    return this.toIProduct(entity)
  }

  async remove(product: IProduct): Promise<void> {
    const entity = await this.ormRepository.findOne({ where: { id: product.id }, relations: ['order_products'] })
    if (!entity) throw new Error('Product not found')
    await this.ormRepository.remove(entity)
  }

  private toIProduct(product: Product): IProduct {
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      created_at: product.created_at,
      updated_at: product.updated_at,
      order_products: product.order_products?.map((op: OrdersProducts) => ({
        id: op.id,
        order: op.order as any,
        product: op.product as any,
        price: op.price,
        quantity: op.quantity,
        created_at: op.created_at,
        updated_at: op.updated_at,
      })) as IOrderProducts[] | undefined,
    }
  }

  async findByName(name: string): Promise<IProduct | null> {
    const product = await this.ormRepository.findOne({ where: { name }, relations: ['order_products'] })
    return product ? this.toIProduct(product) : null
  }

  async findById(id: number): Promise<IProduct | null> {
    const product = await this.ormRepository.findOne({ where: { id }, relations: ['order_products'] })
    return product ? this.toIProduct(product) : null
  }

  async findAll({ page, skip, take }: SearchParams): Promise<IProductPaginate> {
    const [products, total] = await this.ormRepository.findAndCount({
      skip,
      take,
      relations: ['order_products']
    })
    return {
      per_page: take,
      total,
      current_page: page,
      data: products.map(this.toIProduct),
    }
  }

  async findAllByIds(products: { id: number }[]): Promise<IProduct[]> {
    const ids = products.map(p => p.id)
    const found = await this.ormRepository.findBy({ id: In(ids) })
    return found.map(this.toIProduct)
  }

  async updateStock(products: { id: number; quantity: number }[]): Promise<void> {
    for (const { id, quantity } of products) {
      await this.ormRepository.update(id, { quantity })
    }
  }
}
