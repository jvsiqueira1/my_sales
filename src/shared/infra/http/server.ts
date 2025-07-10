import 'express-async-errors'
import 'reflect-metadata'
import express from 'express'
import cors from 'cors'
import { errors } from 'celebrate'
import '@shared/container'

import routes from './routes'
import ErrorHandleMiddleware from '@shared/middlewares/ErrorHandleMiddleware'
import { AppDataSource } from '../typeorm/data-source'
import rateLimiter from '@shared/middlewares/RateLimiter'

export const createApp = async () => {
  await AppDataSource.initialize()

  const app = express()

  app.use(cors())
  app.use(express.json())

  app.use(rateLimiter)

  app.use(routes)
  app.use(errors())
  app.use(ErrorHandleMiddleware.handleError)

  console.log('Connected to the database!')

  return app
}

if (process.env.NODE_ENV !== 'test') {
  createApp().then(app => {
    app.listen(3333, () => {
      console.log('Server started on port 3333!')
    })
  }).catch(error => {
    console.error('Failed to connect to the server: ', error)
  })
}
