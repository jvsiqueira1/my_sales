import { AppDataSource } from "@shared/infra/typeorm/data-source"
import { Express } from "express"
import { createApp } from "@shared/infra/http/server"
import request from "supertest"

describe('Create User', () => {
  let app: Express

  beforeEach(async () => {
    app = await createApp()
  })

  afterEach(async () => {
    const entities = AppDataSource.entityMetadatas

    for (const entity of entities) {
      const repository = AppDataSource.getRepository(entity.name)
      await repository.query(`DELETE FROM ${entity.tableName}`)
    }
    await AppDataSource.destroy()
  })

  it('should be able to create a new user', async () => {
    const response = await request(app).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@exemple.com',
      password: '123456'
    })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('id')
    expect(response.body.email).toBe('johndoe@exemple.com')
  })
})
