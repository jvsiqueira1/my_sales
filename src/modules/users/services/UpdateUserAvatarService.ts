import { inject, injectable } from "tsyringe";
import AppError from "@shared/errors/AppError";
import path from "path";
import fs from 'fs';
import uploadConfig from "@config/upload";
import { IUserRepositories } from "../domain/repositories/IUserRepositories";
import { IUser } from "../domain/models/IUser";

interface IUpdateUserAvatar {
  userId: string;
  avatarFileName: string;
}

@injectable()
export default class UpdateUserAvatarService {
  constructor(
    @inject("UsersRepositories")
    private usersRepository: IUserRepositories
  ) {}

  async execute({ userId, avatarFileName }: IUpdateUserAvatar): Promise<IUser> {
    const user = await this.usersRepository.findById(String(userId));

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath).catch(() => null);

      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    user.avatar = avatarFileName;
    await this.usersRepository.save(user);
    return user;
  }
}
