import "reflect-metadata";
import FakeCustomerRepositories from "../domain/repositories/fakes/FakeCustomerRepositories";
import ListCustomerService from "./ListCustomerService";

describe("ListCustomerService", () => {
  let fakeCustomerRepository: FakeCustomerRepositories;
  let listCustomerService: ListCustomerService;

  beforeEach(() => {
    fakeCustomerRepository = new FakeCustomerRepositories();
    listCustomerService = new ListCustomerService(fakeCustomerRepository);
  });

  it("should return an empty list if no customers", async () => {
    const result = await listCustomerService.execute(1, 10);
    expect(result.data).toHaveLength(0);
    expect(result.total).toBe(0);
  });

  it("should return a list of customers", async () => {
    await fakeCustomerRepository.create({ name: "John", email: "john@example.com" });
    await fakeCustomerRepository.create({ name: "Jane", email: "jane@example.com" });
    const result = await listCustomerService.execute(1, 10);
    expect(result.data).toHaveLength(2);
    expect(result.total).toBe(2);
  });

  it("should paginate customers", async () => {
    for (let i = 1; i <= 15; i++) {
      await fakeCustomerRepository.create({ name: `User${i}`, email: `user${i}@example.com` });
    }
    const page1 = await listCustomerService.execute(1, 10);
    const page2 = await listCustomerService.execute(2, 10);
    expect(page1.data).toHaveLength(10);
    expect(page2.data).toHaveLength(5);
    expect(page1.total).toBe(15);
    expect(page2.total).toBe(15);
  });
}); 