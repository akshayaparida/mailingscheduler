import { worker } from '../lib/worker';
import { Queue } from 'bullmq';
import { Redis } from 'ioredis';

const connection = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

const mailQueue = new Queue('mailQueue', { connection });

console.log('Worker started...');

// Keep the process running
process.on('SIGTERM', async () => {
  console.log('Shutting down worker...');
  await worker.close();
  await connection.quit();
});

process.on('SIGINT', async () => {
  console.log('Shutting down worker...');
  await worker.close();
  await connection.quit();
}); 