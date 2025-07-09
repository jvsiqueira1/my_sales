import { inject, injectable } from "tsyringe";
import AppError from "@shared/errors/AppError";
import RedisCache from "@shared/cache/RedisCache";
import { IProduct } from "../domain/models/IProduct";
import { IProductsRepository } from "../domain/repositories/IProductsRepository";

interface ICreateProduct {
  name: string
  price: number
  quantity: number
}

@injectable()
export default class CreateProductService {
  constructor(
    @inject("ProductsRepository")
    private productsRepository: IProductsRepository
  ) {}

  async execute({ name, price, quantity }: ICreateProduct): Promise<IProduct> {
    const redisCache = new RedisCache();
    const productsExists = await this.productsRepository.findByName(name);

    if (productsExists) {
      throw new AppError("There is already one product with this name", 409);
    }

    const product = await this.productsRepository.create({ name, price, quantity });

    await this.productsRepository.save(product);

    await redisCache.invalidate("api-mysales-PRODUCT_LIST");

    return product;
  }
}
