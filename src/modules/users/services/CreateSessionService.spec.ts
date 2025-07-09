import 'reflect-metadata'
import AppError from '@shared/errors/AppError'
import { FakeUserRepository } from '../domain/repositories/fakes/FakeUserRepository'
import SessionUserService from './SessionUserService'
import { IUser } from '../domain/models/IUser'

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}))

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'fake-token')
}))

const mockUser: IUser = {
  id: '1',
  name: 'John Doe',
  email: 'johndoe@example.com',
  password: 'hashed-password',
  avatar: '',
  created_at: new Date(),
  updated_at: new Date(),
  getAvatarUrl: () => 'avatar.jpg'
}

describe('SessionUserService', () => {
  let fakeUserRepository: FakeUserRepository
  let sessionUserService: SessionUserService

  beforeEach(async () => {
    fakeUserRepository = new FakeUserRepository()
    sessionUserService = new SessionUserService(fakeUserRepository)
    await fakeUserRepository.create({
      name: mockUser.name,
      email: mockUser.email,
      password: mockUser.password
    })
  })

  it('should authenticate user and return token', async () => {
    (require('bcrypt').compare as jest.Mock).mockResolvedValue(true)

    const response = await sessionUserService.execute({
      email: mockUser.email,
      password: '123456'
    })

    expect(response).toHaveProperty('token', 'fake-token')
    expect(response.user.email).toBe(mockUser.email)
  })

  it('should not authenticate with wrong password', async () => {
    (require('bcrypt').compare as jest.Mock).mockResolvedValue(false)

    await expect(
      sessionUserService.execute({
        email: mockUser.email,
        password: 'wrong-password'
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not authenticate non-existing user', async () => {
    await expect(
      sessionUserService.execute({
        email: 'notfound@example.com',
        password: 'any'
      })
    ).rejects.toBeInstanceOf(AppError)
  })
})