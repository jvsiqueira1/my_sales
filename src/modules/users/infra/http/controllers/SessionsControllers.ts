import { Request, Response } from "express";
import SessionUserService from "@modules/users/services/SessionUserService";
import { container } from "tsyringe";

import { instanceToInstance } from "class-transformer";

export default class SessionsControllers {
  async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body
    const createSession = container.resolve(SessionUserService)

    const userToken = await createSession.execute({
      email, password
    })

    const userWithoutPassword = {
      ...userToken,
      user: {
        ...userToken.user,
        password: undefined
      }
    };

    return response.json(instanceToInstance(userWithoutPassword))
  }
}
