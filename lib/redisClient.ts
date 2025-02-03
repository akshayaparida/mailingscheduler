import { Redis } from "ioredis";

// Create a single Redis client instance
export const redisClient = new Redis({
  host: process.env.REDIS_HOST ?? "127.0.0.1",
  port: Number(process.env.REDIS_PORT ?? 6379),
  maxRetriesPerRequest: null,
});
