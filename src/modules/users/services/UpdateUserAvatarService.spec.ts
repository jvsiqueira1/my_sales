import "reflect-metadata";
jest.mock('@config/upload', () => ({
  __esModule: true,
  default: {
    directory: '/tmp',
    storage: {}
  }
}));
import AppError from "@shared/errors/AppError";
import { FakeUserRepository } from "../domain/repositories/fakes/FakeUserRepository";
import UpdateUserAvatarService from "./UpdateUserAvatarService";
import fs from "fs";

jest.mock("fs", () => ({
  promises: {
    stat: jest.fn().mockResolvedValue(true),
    unlink: jest.fn().mockResolvedValue(undefined),
  },
}));

describe("UpdateUserAvatarService", () => {
  let fakeUserRepository: FakeUserRepository;
  let updateUserAvatarService: UpdateUserAvatarService;

  beforeEach(async () => {
    fakeUserRepository = new FakeUserRepository();
    updateUserAvatarService = new UpdateUserAvatarService(fakeUserRepository);
    await fakeUserRepository.create({
      name: "John Doe",
      email: "john@example.com",
      password: "123456",
    });
  });

  it("should update user avatar", async () => {
    const user = await fakeUserRepository.findByEmail("john@example.com");
    const updated = await updateUserAvatarService.execute({
      userId: user!.id,
      avatarFileName: "avatar.jpg",
    });
    expect(updated.avatar).toBe("avatar.jpg");
  });

  it("should throw if user does not exist", async () => {
    await expect(
      updateUserAvatarService.execute({
        userId: "999",
        avatarFileName: "avatar.jpg",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should remove old avatar if exists", async () => {
    const user = await fakeUserRepository.create({
      name: "Jane",
      email: "jane@example.com",
      password: "123456",
    });
    user.avatar = "old-avatar.jpg";
    await fakeUserRepository.save(user);

    const fsMock = require("fs").promises;
    await updateUserAvatarService.execute({
      userId: user.id,
      avatarFileName: "new-avatar.jpg",
    });
    expect(fsMock.unlink).toHaveBeenCalledWith(expect.stringContaining("old-avatar.jpg"));
  });
}); 