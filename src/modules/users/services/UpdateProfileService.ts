import { inject, injectable } from "tsyringe";
import AppError from "@shared/errors/AppError";
import { compare, hash } from "bcrypt";
import { IUserRepositories } from "../domain/repositories/IUserRepositories";
import { IUser } from "../domain/models/IUser";

interface IUpdateProfile {
  user_id: string;
  name: string;
  email: string;
  password: string;
  old_password: string;
}

@injectable()
export default class UpdateProfileService {
  constructor(
    @inject("UsersRepositories")
    private usersRepository: IUserRepositories
  ) {}

  async execute({
    user_id,
    name,
    email,
    password,
    old_password,
  }: IUpdateProfile): Promise<IUser> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found', 404)
    }

    if (email) {
      const userUpdateEmail = await this.usersRepository.findByEmail(email)

      if(userUpdateEmail && userUpdateEmail.id !== user.id) {
        throw new AppError('There is already one user with this email', 409)
      }

      user.email = email
    }

    if (password && !old_password) {
     throw new AppError('Old password is required')
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password)

      if(!checkOldPassword) {
        throw new AppError('Old password does not match')
      }

      user.password = await hash(password, 10)
    }

    if (name) {
      user.name = name
    }

    await this.usersRepository.save(user)

    return user
  }
}
