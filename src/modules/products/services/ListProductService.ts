import { inject, injectable } from "tsyringe";
import RedisCache from "@shared/cache/RedisCache";
import { IProductPaginate } from "../domain/models/IProductPaginate";
import { IProductsRepository } from "../domain/repositories/IProductsRepository";

interface SearchParams {
  page: number;
  skip: number;
  take: number;
}

@injectable()
export default class ListProductService {
  constructor(
    @inject("ProductsRepository")
    private productsRepository: IProductsRepository
  ) {}

  async execute({ page, skip, take }: SearchParams): Promise<IProductPaginate> {
    const redisCache = new RedisCache();

    let products = await redisCache.recover<IProductPaginate>(
      'api-mysales-PRODUCT_LIST'
    );

    if (!products) {
      products = await this.productsRepository.findAll({ page, skip, take });
      await redisCache.save('api-mysales-PRODUCT_LIST', JSON.stringify(products));
    }
    return products as IProductPaginate;
  }
}
