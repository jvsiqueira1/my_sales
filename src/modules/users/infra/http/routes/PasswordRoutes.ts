import { Router } from "express"
import ForgotPasswordControllers from "../../controllers/ForgotPasswordControllers"
import ResetPasswordControllers from "../../controllers/ResetPasswordControllers"
import { ForgotPasswordSchema, ResetPasswordSchema } from "../schemas/PasswordSchemas"


const passwordRouter = Router()
const forgotPasswordController = new ForgotPasswordControllers()
const resetPasswordController = new ResetPasswordControllers()

passwordRouter.post('/forgot', ForgotPasswordSchema, forgotPasswordController.create)
passwordRouter.post('/reset', ResetPasswordSchema, resetPasswordController.create)

export default passwordRouter
