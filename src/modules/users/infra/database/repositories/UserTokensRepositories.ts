import { Repository } from "typeorm";
import { AppDataSource } from "@shared/infra/typeorm/data-source";
import UserToken from "../entities/UserToken";
import { IUserTokenRepositories } from "@modules/users/domain/repositories/IUserTokenRepositories";
import { IUserToken } from "@modules/users/domain/models/IUserToken";

function toIUserToken(userToken: UserToken): IUserToken {
  return {
    id: String(userToken.id),
    token: userToken.token,
    user_id: String(userToken.user_id),
    created_at: userToken.created_at,
    updated_at: userToken.updated_at
  }
}

export class UserTokensRepositories implements IUserTokenRepositories {
  private ormRepository: Repository<UserToken>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(UserToken);
  }

  async findByToken(token: string): Promise<IUserToken | null> {
    const userToken = await this.ormRepository.findOneBy({ token });
    return userToken ? toIUserToken(userToken) : null;
  }

  async generate(user_id: string): Promise<IUserToken> {
    const userToken = this.ormRepository.create({ user_id: Number(user_id) });
    await this.ormRepository.save(userToken);
    return toIUserToken(userToken);
  }
}
