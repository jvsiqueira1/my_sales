import "reflect-metadata";
import AppError from "@shared/errors/AppError";
import { FakeOrdersRepository } from "../domain/repositories/fakes/FakeOrdersRepository";
import FakeCustomerRepositories from "@modules/customers/domain/repositories/fakes/FakeCustomerRepositories";
import { FakeProductsRepository } from "@modules/products/domain/repositories/fakes/FakeProductsRepository";
import CreateOrderService from "./CreateOrderService";

describe("CreateOrderService", () => {
  let fakeOrdersRepository: FakeOrdersRepository;
  let fakeCustomerRepository: FakeCustomerRepositories;
  let fakeProductsRepository: FakeProductsRepository;
  let createOrderService: CreateOrderService;

  beforeEach(() => {
    fakeOrdersRepository = new FakeOrdersRepository();
    fakeCustomerRepository = new FakeCustomerRepositories();
    fakeProductsRepository = new FakeProductsRepository();
    createOrderService = new CreateOrderService(
      fakeOrdersRepository,
      fakeCustomerRepository,
      fakeProductsRepository
    );
  });

  it("should create an order with valid customer and products", async () => {
    const customer = await fakeCustomerRepository.create({ name: "John", email: "john@example.com" });
    const product = await fakeProductsRepository.create({ name: "P1", price: 10, quantity: 5 });
    const order = await createOrderService.execute({
      customer_id: String(customer.id),
      products: [{ id: String(product.id), quantity: 2 }],
    });
    expect(order).toHaveProperty("id");
    expect(order.customer.id).toBe(customer.id);
    expect(order.order_products[0].product_id).toBe(product.id);
    expect(order.order_products[0].quantity).toBe(2);
  });

  it("should throw if customer does not exist", async () => {
    await expect(
      createOrderService.execute({ customer_id: "999", products: [] })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should throw if no products found", async () => {
    const customer = await fakeCustomerRepository.create({ name: "John", email: "john@example.com" });
    await expect(
      createOrderService.execute({ customer_id: String(customer.id), products: [{ id: "1", quantity: 1 }] })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should throw if some product does not exist", async () => {
    const customer = await fakeCustomerRepository.create({ name: "John", email: "john@example.com" });
    const product = await fakeProductsRepository.create({ name: "P1", price: 10, quantity: 5 });
    await expect(
      createOrderService.execute({
        customer_id: String(customer.id),
        products: [
          { id: String(product.id), quantity: 1 },
          { id: "999", quantity: 1 },
        ],
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should throw if product quantity is not available", async () => {
    const customer = await fakeCustomerRepository.create({ name: "John", email: "john@example.com" });
    const product = await fakeProductsRepository.create({ name: "P1", price: 10, quantity: 2 });
    await expect(
      createOrderService.execute({
        customer_id: String(customer.id),
        products: [{ id: String(product.id), quantity: 5 }],
      })
    ).rejects.toBeInstanceOf(AppError);
  });
}); 