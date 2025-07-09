import { ICreateUser } from "../../models/ICreateUser"
import { IPaginateUser } from "../../models/IPaginateUser"
import { IUser } from "../../models/IUser"
import { IUserRepositories } from "../IUserRepositories"

export class FakeUserRepository implements IUserRepositories {
  private users: IUser[] = []

  async findAll(): Promise<IPaginateUser> {
    return {
      per_page: 10,
      total: this.users.length,
      current_page: 1,
      data: this.users
    }
  }

  async findByName(name: string): Promise<IUser | null> {
    return this.users.find(user => user.name === name) || null
  }

  async findById(id: string): Promise<IUser | null> {
    return this.users.find(user => user.id === id) || null
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.users.find(user => user.email === email) || null
  }

  async create(data: ICreateUser): Promise<IUser> {
    const user: IUser = {
      id: String(this.users.length + 1),
      ...data,
      avatar: '',
      created_at: new Date(),
      updated_at: new Date(),
      getAvatarUrl: () => null
    }
    this.users.push(user)
    return user
  }

  async save(user: IUser): Promise<IUser> {
    const index = this.users.findIndex(u => u.id === user.id)
    if (index !== -1) {
      this.users[index] = user
    }
    return user
  }

  async remove(user: IUser): Promise<void> {
    this.users = this.users.filter(u => u.id !== user.id)
  }
}
