const redis = require("redis");

const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (error) => {
  console.error("Redis Client Error:", error);
});

const connectRedis = async () => {
  try {
    await redisClient.connect();

    console.log("Redis connected successfully");

    return redisClient;
  } catch (error) {
    console.error("Redis connection error:", error);
    throw error;
  }
};

module.exports = {
  redisClient,
  connectRedis,
};
