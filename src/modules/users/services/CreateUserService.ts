import { inject, injectable } from "tsyringe";
import AppError from "@shared/errors/AppError";
import { hash } from "bcrypt";
import { IUserRepositories } from "../domain/repositories/IUserRepositories";
import { IUser } from "../domain/models/IUser";
import { ICreateUser } from "../domain/models/ICreateUser";

@injectable()
export default class CreateUserService {
  constructor(
    @inject("UsersRepositories")
    private usersRepository: IUserRepositories
  ) {}

  async execute({ name, email, password }: ICreateUser): Promise<IUser> {
    const emailExists = await this.usersRepository.findByEmail(email);

    if (emailExists) {
      throw new AppError("Email address already used", 409);
    }

    const hashedPassword = await hash(password, 10);

    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    } as ICreateUser);

    return user;
  }
}
