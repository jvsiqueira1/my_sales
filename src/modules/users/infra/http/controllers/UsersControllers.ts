import { Request, Response } from "express"
import ListUsersService from "@modules/users/services/ListUsersService"
import CreateUserService from "@modules/users/services/CreateUserService"
import { instanceToInstance } from "class-transformer"
import { container } from "tsyringe"

export default class UsersControllers {
  async index(request: Request, response: Response): Promise<Response> {
    const { page = 1, skip = 0, take = 10 } = request.query
    const listUsers = container.resolve(ListUsersService)

    const users = await listUsers.execute({
      page: Number(page),
      skip: Number(skip),
      take: Number(take)
    })
    return response.json(instanceToInstance(users))
  }

  async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body
    const createUser = container.resolve(CreateUserService)
    const user = await createUser.execute({
      name, email, password
    })

    return response.json(instanceToInstance(user))
  }
}
