import { IPaginateUser } from "../models/IPaginateUser"
import { IUser } from "../models/IUser"
import { ICreateUser } from "../models/ICreateUser"

type SearchParams = {
  page: number
  skip: number
  take: number
}

export interface IUserRepositories {
    findAll({ page, skip, take }: SearchParams): Promise<IPaginateUser>
    findByName(name: string): Promise<IUser | null>
    findById(id: string): Promise<IUser | null>
    findByEmail(email: string): Promise<IUser | null>
    create(user: ICreateUser): Promise<IUser>
    save(user: IUser): Promise<IUser>
    remove(user: IUser): Promise<void>
}