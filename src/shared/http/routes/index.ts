import { Router } from "express"

const routes = Router()

routes.get('/health', (_request, response) => {
  return response.json({ message: 'Hello Dev! I am Alive!' })
})

export default routes
