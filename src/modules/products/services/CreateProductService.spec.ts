import "reflect-metadata";
import AppError from "@shared/errors/AppError";
import { FakeProductsRepository } from "../domain/repositories/fakes/FakeProductsRepository";
import CreateProductService from "./CreateProductService";

jest.mock("@shared/cache/RedisCache", () => {
  return jest.fn().mockImplementation(() => ({
    recover: jest.fn().mockResolvedValue(null),
    save: jest.fn().mockResolvedValue(undefined),
    invalidate: jest.fn().mockResolvedValue(undefined),
  }));
});

describe("CreateProductService", () => {
  let fakeProductsRepository: FakeProductsRepository;
  let createProductService: CreateProductService;

  beforeEach(() => {
    fakeProductsRepository = new FakeProductsRepository();
    createProductService = new CreateProductService(fakeProductsRepository);
  });

  it("should create a new product", async () => {
    const product = await createProductService.execute({
      name: "Product 1",
      price: 10,
      quantity: 5,
    });
    expect(product).toHaveProperty("id");
    expect(product.name).toBe("Product 1");
  });

  it("should not allow duplicate product name", async () => {
    await createProductService.execute({ name: "Product 1", price: 10, quantity: 5 });
    await expect(
      createProductService.execute({ name: "Product 1", price: 20, quantity: 10 })
    ).rejects.toBeInstanceOf(AppError);
  });
}); 