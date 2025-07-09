import "reflect-metadata";
import AppError from "@shared/errors/AppError";
import { FakeOrdersRepository } from "../domain/repositories/fakes/FakeOrdersRepository";
import { ShowOrderService } from "./ShowOrderService";

describe("ShowOrderService", () => {
  let fakeOrdersRepository: FakeOrdersRepository;
  let showOrderService: ShowOrderService;

  beforeEach(() => {
    fakeOrdersRepository = new FakeOrdersRepository();
    showOrderService = new ShowOrderService(fakeOrdersRepository);
  });

  it("should return an order by id", async () => {
    const order = await fakeOrdersRepository.create({
      customer: { id: 1, name: "John", email: "john@example.com" },
      products: [],
    });
    const found = await showOrderService.execute({ id: String(order.id) });
    expect(found).toHaveProperty("id");
    expect(found.customer.name).toBe("John");
  });

  it("should throw if order does not exist", async () => {
    await expect(
      showOrderService.execute({ id: "999" })
    ).rejects.toBeInstanceOf(AppError);
  });
}); 