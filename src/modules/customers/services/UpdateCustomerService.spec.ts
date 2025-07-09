import "reflect-metadata";
import AppError from "@shared/errors/AppError";
import FakeCustomerRepositories from "../domain/repositories/fakes/FakeCustomerRepositories";
import UpdateCustomerService from "./UpdateCustomerService";

describe("UpdateCustomerService", () => {
  let fakeCustomerRepository: FakeCustomerRepositories;
  let updateCustomerService: UpdateCustomerService;

  beforeEach(() => {
    fakeCustomerRepository = new FakeCustomerRepositories();
    updateCustomerService = new UpdateCustomerService(fakeCustomerRepository);
  });

  it("should update customer name and email", async () => {
    const customer = await fakeCustomerRepository.create({
      name: "John Doe",
      email: "john@example.com",
    });
    const updated = await updateCustomerService.execute({
      id: String(customer.id),
      name: "John Updated",
      email: "johnupdated@example.com",
    });
    expect(updated.name).toBe("John Updated");
    expect(updated.email).toBe("johnupdated@example.com");
  });

  it("should throw if customer does not exist", async () => {
    await expect(
      updateCustomerService.execute({
        id: "999",
        name: "Test",
        email: "test@example.com",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should throw if email is already used by another customer", async () => {
    await fakeCustomerRepository.create({ name: "Jane", email: "jane@example.com" });
    const customer = await fakeCustomerRepository.create({ name: "John", email: "john@example.com" });
    await expect(
      updateCustomerService.execute({
        id: String(customer.id),
        name: "John",
        email: "jane@example.com",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
}); 