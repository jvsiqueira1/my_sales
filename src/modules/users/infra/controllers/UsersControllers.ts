import { Request, Response } from "express"
import ListUsersService from "@modules/users/services/ListUsersService"
import CreateUserService from "@modules/users/services/CreateUserService"
import { instanceToInstance } from "class-transformer"

export default class UsersControllers {
  async index(_request: Request, response: Response): Promise<Response> {
    const listUsers = new ListUsersService()

    const users = await listUsers.execute()
    return response.json(instanceToInstance(users))
  }

  async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body
    const createUser = new CreateUserService()
    const user = await createUser.execute({
      name, email, password
    })

    return response.json(instanceToInstance(user))
  }
}
