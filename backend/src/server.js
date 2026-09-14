const app = require("./app");
// const dbConnectionPool = require("./config/database.config.js");
const dbConnectionPool = require("./config/db.config.js");

const { redisClient, connectRedis } = require("./config/redis.config.js");

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await dbConnectionPool.query("SELECT 1");

    console.log("MySQL database connected successfully");

    await connectRedis();


    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Redis running on ${process.env.REDIS_URL}`)
    });
  } catch (error) {
    console.error("Unable to connect to MySQL:", error.message);
    process.exit(1);
  }
};

startServer();
