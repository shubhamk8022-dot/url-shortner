const { redisClient } = require("../config/redis.config.js");

const maxRequest = 10;
const timeToLive = 60;

const userRatelimit = async (req, res, next) => {
    try {
        const user_id = req.user.userId;
        const redisRateLimitUserId = `url_creation_limit:user_id:${user_id}`;


        const creationCount = await redisClient.incr(redisRateLimitUserId);

        // first creation 
        if (creationCount == 1) {
            await redisClient.expire(
                redisRateLimitUserId,
                timeToLive
            );
        }
        // limit exceeded
        if (creationCount > maxRequest) {
            return res.status(429).json({
                status: "error",
                message: "Too many requests. Please try again later."
            });
        }
        next();
    } catch (error) {
        console.error("Rate limiter error:", error);

        // Fail-open: allow request if Redis is unavailable
        next();
    }
}

module.exports = userRatelimit;