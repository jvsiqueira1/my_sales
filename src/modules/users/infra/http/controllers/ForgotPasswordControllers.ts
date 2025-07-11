import SendForgotPasswordEmailService from "@modules/users/services/SendForgotPasswordEmailService"
import { Request, Response } from "express"
import { container } from "tsyringe";

export default class ForgotPasswordControllers {
  async create(request: Request, response: Response): Promise<Response>{
    const { email } = request.body

    const sendForgotPasswordEmailService = container.resolve(SendForgotPasswordEmailService)

    await sendForgotPasswordEmailService.execute({ email })

    return response.status(204).json([])
  }
}
