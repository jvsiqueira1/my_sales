import { Router } from "express"
import OrdersControllers from "../controller/OrdersControllers"
import AuthMiddleware from "@shared/middlewares/AuthMiddleware"
import { createOrderSchema, idParamsOrderSchema } from "../schemas/OrdersSchemas"


const ordersRouter = Router()
const ordersController = new OrdersControllers()

ordersRouter.use(AuthMiddleware.execute)
ordersRouter.get('/:id', idParamsOrderSchema, ordersController.show)
ordersRouter.post('/', createOrderSchema, ordersController.create)

export default ordersRouter
