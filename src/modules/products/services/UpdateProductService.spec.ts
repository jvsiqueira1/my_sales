import "reflect-metadata";
import AppError from "@shared/errors/AppError";
import { FakeProductsRepository } from "../domain/repositories/fakes/FakeProductsRepository";
import UpdateProductService from "./UpdateProductService";

jest.mock("@shared/cache/RedisCache", () => {
  return jest.fn().mockImplementation(() => ({
    recover: jest.fn().mockResolvedValue(null),
    save: jest.fn().mockResolvedValue(undefined),
    invalidate: jest.fn().mockResolvedValue(undefined),
  }));
});

describe("UpdateProductService", () => {
  let fakeProductsRepository: FakeProductsRepository;
  let updateProductService: UpdateProductService;

  beforeEach(() => {
    fakeProductsRepository = new FakeProductsRepository();
    updateProductService = new UpdateProductService(fakeProductsRepository);
  });

  it("should update product name, price and quantity", async () => {
    const product = await fakeProductsRepository.create({ name: "P1", price: 10, quantity: 5 });
    const updated = await updateProductService.execute({
      id: product.id,
      name: "P2",
      price: 20,
      quantity: 10,
    });
    expect(updated.name).toBe("P2");
    expect(updated.price).toBe(20);
    expect(updated.quantity).toBe(10);
  });

  it("should throw if product does not exist", async () => {
    await expect(
      updateProductService.execute({ id: 999, name: "P1", price: 10, quantity: 5 })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should throw if name is already used by another product", async () => {
    await fakeProductsRepository.create({ name: "P1", price: 10, quantity: 5 });
    const product = await fakeProductsRepository.create({ name: "P2", price: 20, quantity: 10 });
    await expect(
      updateProductService.execute({ id: product.id, name: "P1", price: 30, quantity: 15 })
    ).rejects.toBeInstanceOf(AppError);
  });
}); 