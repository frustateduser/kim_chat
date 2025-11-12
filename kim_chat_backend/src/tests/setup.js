import mongoose from "mongoose";
import Redis from "ioredis";
import { serverInstance } from "../server";

let redisClient = null;

// Setup before all tests
beforeAll(async () => {
  // Connect to test DB if not already connected
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_TEST_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  // Connect Redis (optional)
  try {
    redisClient = new Redis({
      host: "127.0.0.1",
      port: 6379,
      password: process.env.REDIS_PASSWORD || undefined,
    });
  } catch (err) {
    console.warn("Redis not connected for tests" + err);
  }
});

// Cleanup DB between tests
afterEach(async () => {
  const collections = Object.keys(mongoose.connection.collections);
  for (let collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    await collection.deleteMany({});
  }
});

// Close DB and Redis after all tests
afterAll(async () => {
  await mongoose.connection.close();
  if (redisClient) await redisClient.quit();

  if (serverInstance) serverInstance.close();
});
