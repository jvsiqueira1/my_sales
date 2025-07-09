import "reflect-metadata";
import AppError from "@shared/errors/AppError";
import FakeCustomerRepositories from "../domain/repositories/fakes/FakeCustomerRepositories";
import DeleteCustomerService from "./DeleteCustomerService";

describe("DeleteCustomerService", () => {
  let fakeCustomerRepository: FakeCustomerRepositories;
  let deleteCustomerService: DeleteCustomerService;

  beforeEach(() => {
    fakeCustomerRepository = new FakeCustomerRepositories();
    deleteCustomerService = new DeleteCustomerService(fakeCustomerRepository);
  });

  it("should delete an existing customer", async () => {
    const customer = await fakeCustomerRepository.create({
      name: "John Doe",
      email: "john@example.com",
    });
    await expect(
      deleteCustomerService.execute({ id: String(customer.id) })
    ).resolves.not.toThrow();
  });

  it("should throw if customer does not exist", async () => {
    await expect(
      deleteCustomerService.execute({ id: "999" })
    ).rejects.toBeInstanceOf(AppError);
  });
}); 