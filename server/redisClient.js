// const redis = require("redis");
// const dotenv = require("dotenv");
// dotenv.config();

// const redisClient = redis.createClient({
//   url: process.env.REDIS_URL,
// });

// const connectRedis = async () => {
//   try {
//     await redisClient.connect();
//     console.log("Connected to REDIS");
//   } catch (err) {
//     console.error("Redis connection error:", err);
//   }
// };

// connectRedis();

// redisClient.on("error", (err) => {
//   console.error("Redis error:", err);
// });

// module.exports = redisClient;
