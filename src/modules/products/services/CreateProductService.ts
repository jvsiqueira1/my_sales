import AppError from "@shared/errors/AppError"
import { Product } from "../infra/database/entities/Product"
import { productsRepositories } from "../infra/database/repositories/ProductsRepositories"
import RedisCache from "@shared/cache/RedisCache"

interface ICreateProduct {
  name: string
  price: number
  quantity: number
}

export default class CreateProductService {
  async execute({name, price, quantity}: ICreateProduct): Promise<Product> {
    const redisCache = new RedisCache()
    const productsExists = await productsRepositories.finByName(name)

    if(productsExists) {
      throw new AppError('There is already on product with this name', 409)
    }

    const product = productsRepositories.create({name, price, quantity})

    await productsRepositories.save(product)

    await redisCache.invalidate('api-mysales-PRODUCT_LIST')

    return product
  }
}
