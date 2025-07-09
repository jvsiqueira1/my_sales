import "reflect-metadata";
import { FakeProductsRepository } from "../domain/repositories/fakes/FakeProductsRepository";
import ListProductService from "./ListProductService";

jest.mock("@shared/cache/RedisCache", () => {
  return jest.fn().mockImplementation(() => ({
    recover: jest.fn().mockResolvedValue(null),
    save: jest.fn().mockResolvedValue(undefined),
    invalidate: jest.fn().mockResolvedValue(undefined),
  }));
});

describe("ListProductService", () => {
  let fakeProductsRepository: FakeProductsRepository;
  let listProductService: ListProductService;

  beforeEach(() => {
    fakeProductsRepository = new FakeProductsRepository();
    listProductService = new ListProductService(fakeProductsRepository);
  });

  it("should return an empty list if no products", async () => {
    const result = await listProductService.execute({ page: 1, skip: 0, take: 10 });
    expect(result.data).toHaveLength(0);
    expect(result.total).toBe(0);
  });

  it("should return a list of products", async () => {
    await fakeProductsRepository.create({ name: "P1", price: 10, quantity: 5 });
    await fakeProductsRepository.create({ name: "P2", price: 20, quantity: 10 });
    const result = await listProductService.execute({ page: 1, skip: 0, take: 10 });
    expect(result.data).toHaveLength(2);
    expect(result.total).toBe(2);
  });

  it("should paginate products", async () => {
    for (let i = 1; i <= 15; i++) {
      await fakeProductsRepository.create({ name: `P${i}`, price: i, quantity: i });
    }
    const page1 = await listProductService.execute({ page: 1, skip: 0, take: 10 });
    const page2 = await listProductService.execute({ page: 2, skip: 10, take: 10 });
    expect(page1.data).toHaveLength(10);
    expect(page2.data).toHaveLength(5);
    expect(page1.total).toBe(15);
    expect(page2.total).toBe(15);
  });
}); 