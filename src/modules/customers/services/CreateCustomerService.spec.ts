import "reflect-metadata";
import AppError from "@shared/errors/AppError";
import FakeCustomerRepositories from "../domain/repositories/fakes/FakeCustomerRepositories";
import CreateCustomerService from "./CreateCustomerService";

describe("CreateCustomerService", () => {
  let fakeCustomerRepository: FakeCustomerRepositories;
  let createCustomerService: CreateCustomerService;

  beforeEach(() => {
    fakeCustomerRepository = new FakeCustomerRepositories();
    createCustomerService = new CreateCustomerService(fakeCustomerRepository);
  });

  it("should create a new customer", async () => {
    const customer = await createCustomerService.execute({
      name: "John Doe",
      email: "john@example.com",
    });
    expect(customer).toHaveProperty("id");
    expect(customer.name).toBe("John Doe");
    expect(customer.email).toBe("john@example.com");
  });

  it("should not allow duplicate email", async () => {
    await createCustomerService.execute({
      name: "Jane Doe",
      email: "jane@example.com",
    });
    await expect(
      createCustomerService.execute({
        name: "Jane Other",
        email: "jane@example.com",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
