import { inject, injectable } from "tsyringe";
import AppError from "@shared/errors/AppError";
import { compare } from "bcrypt";
import { Secret, sign } from "jsonwebtoken";
import { IUserRepositories } from "../domain/repositories/IUserRepositories";
import { IUser } from "../domain/models/IUser";

interface ISessionUser {
  email: string;
  password: string;
}

interface ISessionResponse {
  user: IUser;
  token: string;
}

@injectable()
export default class SessionUserService {
  constructor(
    @inject("UsersRepositories")
    private usersRepository: IUserRepositories
  ) {}

  async execute({ email, password }: ISessionUser): Promise<ISessionResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError("Incorrect email/password combination", 401);
    }

    const passwordConfirmed = await compare(password, user.password);

    if (!passwordConfirmed) {
      throw new AppError("Incorrect email/password combination", 401);
    }

    const token = sign({}, process.env.APP_SECRET as Secret, {
      subject: String(user.id),
      expiresIn: "1d",
    });

    return {
      user,
      token,
    };
  }
}
