import Redis, { Redis as RedisClient } from "ioredis";
import cacheConfig from '@config/cache'

export default class RedisCache {
  private client: RedisClient

  constructor(){
    this.client = new Redis(cacheConfig.config.redis)
  }

  async save(key: string, value: string): Promise<void> {
    this.client.set(key, value)
  }

  async recover<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key)

    if(!data) return null

    const parsedData = JSON.parse(data) as T

    return parsedData
  }
}
