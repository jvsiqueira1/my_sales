import { AppDataSource } from "@shared/infra/typeorm/data-source"
import { User } from "../entities/User"
import { IUserRepositories } from "@modules/users/domain/repositories/IUserRepositories";
import { Repository } from "typeorm";
import { ICreateUser } from "@modules/users/domain/models/ICreateUser";
import { IUser } from "@modules/users/domain/models/IUser";
import { IPaginateUser } from "@modules/users/domain/models/IPaginateUser";

export type SearchParams = {
  page: number
  skip: number
  take: number
};

function toIUser(user: User): IUser {
  return {
    id: String(user.id),
    name: user.name,
    email: user.email,
    password: user.password,
    avatar: user.avatar,
    created_at: user.created_at,
    updated_at: user.updated_at,
    getAvatarUrl: function() {
      if (!this.avatar) return null;
      return `${process.env.APP_API_URL}/files/${this.avatar}`;
    }
  }
}

export class UsersRepositories implements IUserRepositories {
  private ormRepository: Repository<User>

  constructor() {
    this.ormRepository = AppDataSource.getRepository(User)
  }

  async create({ name, email, password }: ICreateUser): Promise<IUser> {
    const user = this.ormRepository.create({ name, email, password })
    await this.ormRepository.save(user)
    return toIUser(user)
  }

  public async save(user: IUser): Promise<IUser> {
    const entity = await this.ormRepository.findOneBy({ id: Number(user.id) })
    if (!entity) throw new Error('User not found')
    entity.name = user.name
    entity.email = user.email
    entity.password = user.password
    entity.avatar = user.avatar
    await this.ormRepository.save(entity)
    return toIUser(entity)
  }

  public async findAll({
    page,
    skip,
    take,
  }: SearchParams): Promise<IPaginateUser> {
    const [users, count] = await this.ormRepository
      .createQueryBuilder()
      .skip(skip)
      .take(take)
      .getManyAndCount();

    const result = {
      per_page: take,
      total: count,
      current_page: page,
      data: users.map(toIUser),
    };

    return result
  }

  public async findByName(name: string): Promise<IUser | null> {
    const user = await this.ormRepository.findOneBy({ name });
    return user ? toIUser(user) : null;
  }

  public async findById(id: string): Promise<IUser | null> {
    const user = await this.ormRepository.findOneBy({ id: Number(id) });
    return user ? toIUser(user) : null;
  }

  public async findByEmail(email: string): Promise<IUser | null> {
    const user = await this.ormRepository.findOneBy({ email });
    return user ? toIUser(user) : null;
  }

  public async remove(user: IUser): Promise<void> {
    const entity = await this.ormRepository.findOneBy({ id: Number(user.id) });
    if (!entity) throw new Error('User not found');
    await this.ormRepository.remove(entity);
  }
}
