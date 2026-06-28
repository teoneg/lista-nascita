import { Redis } from '@upstash/redis'

// Provide a fallback for local development if env vars are missing
const redisUrl = process.env.UPSTASH_REDIS_REST_URL || 'https://example.upstash.io'
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || 'example-token'

export const redis = new Redis({
  url: redisUrl,
  token: redisToken,
})
