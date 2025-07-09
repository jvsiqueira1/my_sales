import "reflect-metadata";
import AppError from "@shared/errors/AppError";
import FakeCustomerRepositories from "../domain/repositories/fakes/FakeCustomerRepositories";
import ShowCustomerService from "./ShowCustomerService";

describe("ShowCustomerService", () => {
  let fakeCustomerRepository: FakeCustomerRepositories;
  let showCustomerService: ShowCustomerService;

  beforeEach(() => {
    fakeCustomerRepository = new FakeCustomerRepositories();
    showCustomerService = new ShowCustomerService(fakeCustomerRepository);
  });

  it("should return a customer by id", async () => {
    const customer = await fakeCustomerRepository.create({
      name: "John Doe",
      email: "john@example.com",
    });
    const found = await showCustomerService.execute({ id: String(customer.id) });
    expect(found).toHaveProperty("id");
    expect(found.name).toBe("John Doe");
  });

  it("should throw if customer does not exist", async () => {
    await expect(
      showCustomerService.execute({ id: "999" })
    ).rejects.toBeInstanceOf(AppError);
  });
}); 