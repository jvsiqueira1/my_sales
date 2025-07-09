import "reflect-metadata";
import AppError from "@shared/errors/AppError";
import { FakeUserRepository } from "../domain/repositories/fakes/FakeUserRepository";
import ResetPasswordService from "./ResetPasswordService";
import * as bcrypt from "bcrypt";
import { addHours, subHours } from "date-fns";

jest.mock("bcrypt", () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

class FakeUserTokensRepository {
  private tokens: any[] = [];
  async generate(user_id: string) {
    const token = {
      id: '1',
      token: 'valid-token',
      user_id,
      created_at: new Date(),
      updated_at: new Date()
    };
    this.tokens.push(token);
    return token;
  }
  async findByToken(token: string) {
    return this.tokens.find(t => t.token === token) || null;
  }
}

describe("ResetPasswordService", () => {
  let fakeUserRepository: FakeUserRepository;
  let fakeUserTokensRepository: FakeUserTokensRepository;
  let resetPasswordService: ResetPasswordService;

  beforeEach(async () => {
    fakeUserRepository = new FakeUserRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    resetPasswordService = new ResetPasswordService(
      fakeUserTokensRepository,
      fakeUserRepository
    );
    const user = await fakeUserRepository.create({
      name: "John Doe",
      email: "john@example.com",
      password: "123456",
    });
    await fakeUserTokensRepository.generate(user.id);
  });

  it("should reset password with valid token", async () => {
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashed-newpass");
    const user = await fakeUserRepository.findByEmail("john@example.com");
    await expect(
      resetPasswordService.execute({ token: "valid-token", password: "newpass" })
    ).resolves.not.toThrow();
    const updatedUser = await fakeUserRepository.findById(user!.id);
    expect(updatedUser!.password).toBe("hashed-newpass");
  });

  it("should not reset password with invalid token", async () => {
    await expect(
      resetPasswordService.execute({ token: "invalid-token", password: "newpass" })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not reset password if user does not exist", async () => {
    // Remove o usuário do fake repo
    fakeUserRepository.remove({ id: '1', name: '', email: '', password: '', avatar: '', created_at: new Date(), updated_at: new Date(), getAvatarUrl: () => null });
    await expect(
      resetPasswordService.execute({ token: "valid-token", password: "newpass" })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not reset password if token is expired", async () => {
    // Manipula o token para ser antigo
    const token = await fakeUserTokensRepository.findByToken("valid-token");
    token.created_at = subHours(new Date(), 3); // 3 horas atrás
    await expect(
      resetPasswordService.execute({ token: "valid-token", password: "newpass" })
    ).rejects.toBeInstanceOf(AppError);
  });
}); 