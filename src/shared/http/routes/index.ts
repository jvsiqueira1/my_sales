import productsRouter from "@modules/products/routes/ProductRoute"
import avatarRouter from "@modules/users/routes/AvatarRoutes"
import sessionsRouter from "@modules/users/routes/SessionRoutes"
import usersRouter from "@modules/users/routes/UserRoutes"
import { Router } from "express"

const routes = Router()

routes.get('/health', (_request, response) => {return response.json({ message: 'Hello Dev! I am Alive!' })})
routes.use('/products', productsRouter)
routes.use('/users', usersRouter)
routes.use('/sessions', sessionsRouter)
routes.use('/avatar', avatarRouter)

export default routes
