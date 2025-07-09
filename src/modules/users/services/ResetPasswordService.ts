import { inject, injectable } from "tsyringe";
import AppError from "@shared/errors/AppError";
import { isAfter, addHours } from "date-fns";
import { hash } from "bcrypt";
import { IUserTokenRepositories } from "../domain/repositories/IUserTokenRepositories";
import { IUserRepositories } from "../domain/repositories/IUserRepositories";

interface IResetPassword {
  token: string;
  password: string;
}

@injectable()
export default class ResetPasswordService {
  constructor(
    @inject("UserTokensRepositories")
    private userTokensRepository: IUserTokenRepositories,
    @inject("UsersRepositories")
    private usersRepository: IUserRepositories
  ) {}

  async execute({ token, password }: IResetPassword): Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(token);

    if (!userToken) {
      throw new AppError("User token not exists", 404);
    }

    const user = await this.usersRepository.findById(userToken.user_id);

    if (!user) {
      throw new AppError("User not exists", 404);
    }

    const tokenCreatedAt = userToken.created_at;
    const compareDate = addHours(tokenCreatedAt, 2);

    if (isAfter(Date.now(), compareDate)) {
      throw new AppError("Token expired", 401);
    }

    user.password = await hash(password, 10);

    await this.usersRepository.save(user);
  }
}
