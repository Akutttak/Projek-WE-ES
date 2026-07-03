const { Queue } = require("bullmq");
const IORedis = require("ioredis");

const redisConnection = new IORedis({
    host: process.env.REDIS_HOST || "Localhost",
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || "",
    maxRetriesPerRequest: null, // Wajib untuk BullMQ
});

const ticketQueue = new Queue("ticket-transactions", {connection: redisConnection});

module.exports = { ticketQueue, redisConnection };