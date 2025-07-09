import "reflect-metadata";
import AppError from "@shared/errors/AppError";
import { FakeUserRepository } from "../domain/repositories/fakes/FakeUserRepository";
import ShowProfileService from "./ShowProfileService";

describe("ShowProfileService", () => {
  let fakeUserRepository: FakeUserRepository;
  let showProfileService: ShowProfileService;

  beforeEach(async () => {
    fakeUserRepository = new FakeUserRepository();
    showProfileService = new ShowProfileService(fakeUserRepository);
    await fakeUserRepository.create({
      name: "John Doe",
      email: "john@example.com",
      password: "123456",
    });
  });

  it("should return user profile", async () => {
    const user = await fakeUserRepository.findByEmail("john@example.com");
    const profile = await showProfileService.execute({ user_id: user!.id });
    expect(profile.email).toBe("john@example.com");
  });

  it("should throw if user does not exist", async () => {
    await expect(
      showProfileService.execute({ user_id: "999" })
    ).rejects.toBeInstanceOf(AppError);
  });
}); 