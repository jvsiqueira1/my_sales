import { IUserToken } from "../models/IUserToken"

export interface IUserTokenRepositories {
    findByToken(token: string): Promise<IUserToken | null>
    generate(user_id: string): Promise<IUserToken>
}