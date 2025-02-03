// /lib/queue.ts
import { Queue } from "bullmq";
import { Redis } from "ioredis";

// Create a Redis connection (using nullish coalescing operator for default values)
const connection = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

// Create the BullMQ queue for mailing jobs
export const mailQueue = new Queue("mailQueue", { connection });
