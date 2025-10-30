import { createClient } from "redis";
import logger from "./logger.js";

let redis;

export const connectRedis = async () => {
  try {
    const redisUrl = `redis://:${process.env.REDIS_PASSWORD}@127.0.0.1:6379`;
    redis = createClient({
      url: redisUrl,
    });

    redis.on("connect", () => logger.info("Redis connected"));

    redis.on("error", (err) => logger.error("Redis error:", err));
    await redis.connect();
  } catch (err) {
    logger.error("Failed to connect Redis at startup:", err.message);
    process.exit(1);
  }
  return redis;
};

export const getRedisClient = () => redis;
