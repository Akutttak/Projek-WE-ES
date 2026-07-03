const { Queue } = require("bullmq");
const IORedis = require("ioredis");

const redisConnection = new IORedis({
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || "",
  maxRetriesPerRequest: null, // Wajib untuk BullMQ
  enableReadyCheck: false,
  enableOfflineQueue: true,
  // Tambahan untuk handle high load
  connectTimeout: 10000,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  reconnectOnError: (err) => {
    const targetError = "READONLY";
    if (err.message.includes(targetError)) {
      return true; // Hanya reconnect jika READONLY error
    }
    return false;
  },
});

const ticketQueue = new Queue("ticket-transactions", {
  connection: redisConnection,
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: false,
  },
});

module.exports = { ticketQueue, redisConnection };
