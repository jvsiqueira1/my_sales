import { IProductsRepository } from "../IProductsRepository";
import { IProduct } from "../../models/IProduct";
import { ICreateProduct } from "../../models/ICreateProduct";
import { IFindProducts } from "../../models/IFindProducts";
import { IUpdateStockProduct } from "../../models/IUpdateStockProduct";
import { IProductPaginate } from "../../models/IProductPaginate";

export class FakeProductsRepository implements IProductsRepository {
  private products: IProduct[] = [];
  private currentId = 1;

  async create({ name, price, quantity }: ICreateProduct): Promise<IProduct> {
    const now = new Date();
    const product: IProduct = {
      id: this.currentId++,
      name,
      price,
      quantity,
      created_at: now,
      updated_at: now,
    };
    this.products.push(product);
    return product;
  }

  async save(product: IProduct): Promise<IProduct> {
    const index = this.products.findIndex(p => p.id === product.id);
    if (index !== -1) this.products[index] = product;
    return product;
  }

  async findById(id: number): Promise<IProduct | null> {
    return this.products.find(p => p.id === id) || null;
  }

  async findByName(name: string): Promise<IProduct | null> {
    return this.products.find(p => p.name === name) || null;
  }

  async findAll({ page, skip, take }: { page: number; skip: number; take: number }): Promise<IProductPaginate> {
    const data = this.products.slice(skip, skip + take);
    return {
      per_page: take,
      total: this.products.length,
      current_page: page,
      data,
    };
  }

  async findAllByIds(products: IFindProducts[]): Promise<IProduct[]> {
    return this.products.filter(p => products.some(i => p.id === i.id));
  }

  async updateStock(products: IUpdateStockProduct[]): Promise<void> {
    products.forEach(update => {
      const product = this.products.find(p => p.id === update.id);
      if (product) product.quantity = update.quantity;
    });
  }

  async remove(product: IProduct): Promise<void> {
    const index = this.products.findIndex(p => p.id === product.id);
    if (index !== -1) this.products.splice(index, 1);
  }
} 