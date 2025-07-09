import { Request, Response } from "express"
import ShowProfileService from "@modules/users/services/ShowProfileService"
import UpdateProfileService from "@modules/users/services/UpdateProfileService"
import { container } from "tsyringe";

export default class ProfileControllers {
  async show(request: Request, response: Response): Promise<Response> {
    const showProfile = container.resolve(ShowProfileService)
    const user_id = String(request.user.id)
    const user = await showProfile.execute({ user_id })
    return response.json(user)
  }

  async update(request: Request, response: Response): Promise<Response> {
    const user_id = String(request.user.id)
    const { name, email, password, old_password } = request.body

    const updateProfile = container.resolve(UpdateProfileService)
    const user = await updateProfile.execute({
      user_id, name, email, password, old_password
    })

    return response.json(user)
  }
}
