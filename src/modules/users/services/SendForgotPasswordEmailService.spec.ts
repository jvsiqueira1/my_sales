import "reflect-metadata";
import AppError from "@shared/errors/AppError";
import { FakeUserRepository } from "../domain/repositories/fakes/FakeUserRepository";
import SendForgotPasswordEmailService from "./SendForgotPasswordEmailService";

jest.mock("@config/email", () => ({
  sendEmail: jest.fn(),
}));

class FakeUserTokensRepository {
  async generate(user_id: string) {
    return { id: '1', token: 'token', user_id, created_at: new Date(), updated_at: new Date() };
  }
  async findByToken(token: string) {
    return { id: '1', token, user_id: '1', created_at: new Date(), updated_at: new Date() };
  }
}

describe("SendForgotPasswordEmailService", () => {
  let fakeUserRepository: FakeUserRepository;
  let fakeUserTokensRepository: FakeUserTokensRepository;
  let sendForgotPasswordEmailService: SendForgotPasswordEmailService;

  beforeEach(async () => {
    fakeUserRepository = new FakeUserRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    sendForgotPasswordEmailService = new SendForgotPasswordEmailService(
      fakeUserRepository,
      fakeUserTokensRepository
    );
    await fakeUserRepository.create({
      name: "John Doe",
      email: "john@example.com",
      password: "123456",
    });
  });

  it("should send email if user exists", async () => {
    await expect(
      sendForgotPasswordEmailService.execute({ email: "john@example.com" })
    ).resolves.not.toThrow();
  });

  it("should throw if user does not exist", async () => {
    await expect(
      sendForgotPasswordEmailService.execute({ email: "notfound@example.com" })
    ).rejects.toBeInstanceOf(AppError);
  });
}); 