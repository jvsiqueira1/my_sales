import { IOrdersRepository } from "../IOrdersRepository";
import { IOrder } from "../../models/IOrder";
import { IOrderPaginate } from "../../models/IOrderPaginate";

export class FakeOrdersRepository implements IOrdersRepository {
  private orders: IOrder[] = [];
  private currentId = 1;

  async create(data: any): Promise<IOrder> {
    const now = new Date();
    const order: IOrder = {
      id: this.currentId++,
      customer: data.customer,
      order_products: data.products || [],
      created_at: now,
      updated_at: now,
    };
    this.orders.push(order);
    return order;
  }

  async findById(id: number): Promise<IOrder | null> {
    return this.orders.find(order => order.id === id) || null;
  }

  async findAll({ page, skip, take }: { page: number; skip: number; take: number }): Promise<IOrderPaginate> {
    const data = this.orders.slice(skip, skip + take);
    return {
      per_page: take,
      total: this.orders.length,
      current_page: page,
      data,
    };
  }
} 