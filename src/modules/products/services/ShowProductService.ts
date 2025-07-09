import { inject, injectable } from "tsyringe";
import AppError from "@shared/errors/AppError";
import { IProduct } from "../domain/models/IProduct";
import { IProductsRepository } from "../domain/repositories/IProductsRepository";

interface IShowProduct {
  id: number
}

@injectable()
export default class ShowProductService {
  constructor(
    @inject("ProductsRepository")
    private productsRepository: IProductsRepository
  ) {}

  async execute({ id }: IShowProduct): Promise<IProduct> {
    const product = await this.productsRepository.findById(id);

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    return product;
  }
}
