import { Queue, Worker, Processor, WorkerOptions } from 'bullmq';
import IORedis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

export function createRedisConnection(): IORedis {
  const connection = new IORedis(REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    lazyConnect: true,
  });

  connection.on('error', (err) => {
    console.error('[Redis] Connection error:', err.message);
  });

  connection.on('connect', () => {
    console.log('[Redis] Connected to', REDIS_URL);
  });

  return connection;
}

const connection = createRedisConnection();

export const fetcherQueue = new Queue('fetcher', { connection });
export const deduperQueue = new Queue('deduper', { connection });
export const classifierQueue = new Queue('classifier', { connection });
export const summarizerQueue = new Queue('summarizer', { connection });
export const reshareQueue = new Queue('reshare', { connection });
export const analyticsQueue = new Queue('analytics', { connection });

export function createWorker<T = unknown, R = unknown>(
  queueName: string,
  processor: Processor<T, R>,
  options: Partial<WorkerOptions> = {}
): Worker<T, R> {
  const workerConnection = createRedisConnection();

  const worker = new Worker<T, R>(queueName, processor, {
    connection: workerConnection,
    concurrency: options.concurrency ?? 5,
    ...options,
  });

  worker.on('completed', (job) => {
    console.log(`[${queueName}] Job ${job.id} completed`);
  });

  worker.on('failed', (job, err) => {
    console.error(`[${queueName}] Job ${job?.id} failed:`, err.message);
  });

  worker.on('error', (err) => {
    console.error(`[${queueName}] Worker error:`, err.message);
  });

  console.log(`[${queueName}] Worker started`);
  return worker;
}
