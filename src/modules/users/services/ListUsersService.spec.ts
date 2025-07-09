import "reflect-metadata";
import { FakeUserRepository } from "../domain/repositories/fakes/FakeUserRepository";
import ListUsersService from "./ListUsersService";

describe("ListUsersService", () => {
  let fakeUserRepository: FakeUserRepository;
  let listUsersService: ListUsersService;

  beforeEach(async () => {
    fakeUserRepository = new FakeUserRepository();
    listUsersService = new ListUsersService(fakeUserRepository);
    await fakeUserRepository.create({
      name: "John Doe",
      email: "john@example.com",
      password: "123456",
    });
  });

  it("should list users paginated", async () => {
    const result = await listUsersService.execute({ page: 1, skip: 0, take: 10 });
    expect(result.data.length).toBeGreaterThan(0);
    expect(result.total).toBe(1);
  });
}); 