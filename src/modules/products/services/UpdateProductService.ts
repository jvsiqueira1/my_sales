import { inject, injectable } from "tsyringe";
import AppError from "@shared/errors/AppError";
import RedisCache from "@shared/cache/RedisCache";
import { IProduct } from "../domain/models/IProduct";
import { IProductsRepository } from "../domain/repositories/IProductsRepository";

interface IUpdateProduct {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

@injectable()
export default class UpdateProductService {
  constructor(
    @inject("ProductsRepository")
    private productsRepository: IProductsRepository
  ) {}

  async execute({ id, name, price, quantity }: IUpdateProduct): Promise<IProduct> {
    const redisCache = new RedisCache();
    const product = await this.productsRepository.findById(id);

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    const productExists = await this.productsRepository.findByName(name);

    if (productExists && productExists.id !== id) {
      throw new AppError('There is already one product with this name', 409);
    }

    product.name = name;
    product.price = price;
    product.quantity = quantity;

    await this.productsRepository.save(product);

    await redisCache.invalidate('api-mysales-PRODUCT_LIST');

    return product;
  }
}
