import { inject, injectable } from "tsyringe";
import AppError from "@shared/errors/AppError";
import { IUserRepositories } from "../domain/repositories/IUserRepositories";
import { IUser } from "../domain/models/IUser";

interface IShowProfile {
  user_id: string;
}

@injectable()
export default class ShowProfileService {
  constructor(
    @inject("UsersRepositories")
    private usersRepository: IUserRepositories
  ) {}

  async execute({ user_id }: IShowProfile): Promise<IUser> {
    const user = await this.usersRepository.findById(String(user_id));

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  }
}
