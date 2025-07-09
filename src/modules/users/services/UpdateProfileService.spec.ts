import "reflect-metadata";
import AppError from "@shared/errors/AppError";
import { FakeUserRepository } from "../domain/repositories/fakes/FakeUserRepository";
import UpdateProfileService from "./UpdateProfileService";

jest.mock("bcrypt", () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe("UpdateProfileService", () => {
  let fakeUserRepository: FakeUserRepository;
  let updateProfileService: UpdateProfileService;

  beforeEach(async () => {
    fakeUserRepository = new FakeUserRepository();
    updateProfileService = new UpdateProfileService(fakeUserRepository);
    await fakeUserRepository.create({
      name: "John Doe",
      email: "john@example.com",
      password: "hashed-password",
    });
  });

  it("should update user name and email", async () => {
    const user = await fakeUserRepository.findByEmail("john@example.com");
    const updated = await updateProfileService.execute({
      user_id: user!.id,
      name: "John Updated",
      email: "johnupdated@example.com",
      password: "",
      old_password: "",
    });
    expect(updated.name).toBe("John Updated");
    expect(updated.email).toBe("johnupdated@example.com");
  });

  it("should not allow duplicate email", async () => {
    await fakeUserRepository.create({
      name: "Jane",
      email: "jane@example.com",
      password: "123456",
    });
    const user = await fakeUserRepository.findByEmail("john@example.com");
    await expect(
      updateProfileService.execute({
        user_id: user!.id,
        name: "John",
        email: "jane@example.com",
        password: "",
        old_password: "",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should require old password to update password", async () => {
    const user = await fakeUserRepository.findByEmail("john@example.com");
    await expect(
      updateProfileService.execute({
        user_id: user!.id,
        name: "John",
        email: "john@example.com",
        password: "newpass",
        old_password: "",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not update password if old password is wrong", async () => {
    (require("bcrypt").compare as jest.Mock).mockResolvedValue(false);
    const user = await fakeUserRepository.findByEmail("john@example.com");
    await expect(
      updateProfileService.execute({
        user_id: user!.id,
        name: "John",
        email: "john@example.com",
        password: "newpass",
        old_password: "wrong-old",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should update password with correct old password", async () => {
    const user = await fakeUserRepository.findByEmail("john@example.com");
    (require("bcrypt").compare as jest.Mock).mockResolvedValue(true);
    (require("bcrypt").hash as jest.Mock).mockResolvedValue("hashed-newpass");
    const updated = await updateProfileService.execute({
      user_id: user!.id,
      name: "John",
      email: "john@example.com",
      password: "newpass",
      old_password: "123456",
    });
    expect(updated.password).toBe("hashed-newpass");
  });

  it("should throw if user does not exist", async () => {
    await expect(
      updateProfileService.execute({
        user_id: "999",
        name: "John",
        email: "john@example.com",
        password: "",
        old_password: "",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
}); 