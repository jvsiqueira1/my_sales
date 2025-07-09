import "reflect-metadata";
import AppError from "@shared/errors/AppError";
import { FakeProductsRepository } from "../domain/repositories/fakes/FakeProductsRepository";
import ShowProductService from "./ShowProductService";

describe("ShowProductService", () => {
  let fakeProductsRepository: FakeProductsRepository;
  let showProductService: ShowProductService;

  beforeEach(() => {
    fakeProductsRepository = new FakeProductsRepository();
    showProductService = new ShowProductService(fakeProductsRepository);
  });

  it("should return a product by id", async () => {
    const product = await fakeProductsRepository.create({ name: "P1", price: 10, quantity: 5 });
    const found = await showProductService.execute({ id: product.id });
    expect(found).toHaveProperty("id");
    expect(found.name).toBe("P1");
  });

  it("should throw if product does not exist", async () => {
    await expect(
      showProductService.execute({ id: 999 })
    ).rejects.toBeInstanceOf(AppError);
  });
}); 