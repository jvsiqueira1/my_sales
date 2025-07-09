import "reflect-metadata";
import AppError from "@shared/errors/AppError";
import { FakeProductsRepository } from "../domain/repositories/fakes/FakeProductsRepository";
import DeleteProductService from "./DeleteProductService";

jest.mock("@shared/cache/RedisCache", () => {
  return jest.fn().mockImplementation(() => ({
    recover: jest.fn().mockResolvedValue(null),
    save: jest.fn().mockResolvedValue(undefined),
    invalidate: jest.fn().mockResolvedValue(undefined),
  }));
});

describe("DeleteProductService", () => {
  let fakeProductsRepository: FakeProductsRepository;
  let deleteProductService: DeleteProductService;

  beforeEach(() => {
    fakeProductsRepository = new FakeProductsRepository();
    deleteProductService = new DeleteProductService(fakeProductsRepository);
  });

  it("should delete an existing product", async () => {
    const product = await fakeProductsRepository.create({ name: "P1", price: 10, quantity: 5 });
    await expect(
      deleteProductService.execute({ id: product.id })
    ).resolves.not.toThrow();
  });

  it("should throw if product does not exist", async () => {
    await expect(
      deleteProductService.execute({ id: 999 })
    ).rejects.toBeInstanceOf(AppError);
  });
}); 