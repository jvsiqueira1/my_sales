import { inject, injectable } from "tsyringe";
import { IUserRepositories } from "../domain/repositories/IUserRepositories";
import { IPaginateUser } from "../domain/models/IPaginateUser";

interface SearchParams {
  page: number;
  skip: number;
  take: number;
}

@injectable()
export default class ListUsersService {
  constructor(
    @inject("UsersRepositories")
    private usersRepository: IUserRepositories
  ) {}

  async execute({ page, skip, take }: SearchParams): Promise<IPaginateUser> {
    const users = await this.usersRepository.findAll({ page, skip, take });
    return users;
  }
}
