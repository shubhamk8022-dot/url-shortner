const { redisClient } = require("../config/redis.config");

const maxRequest = 100;
const timeToLive = 60;

const rateLimitByIp = async (req, res, next) => {
    try {
        const ip = req.ip;

        const redisRateLimitByIpKey =
            `rate_limit:redirect:ip:${ip}`;

        const requestCount = await redisClient.incr(
            redisRateLimitByIpKey
        );

        // First request from this IP
        if (requestCount === 1) {
            await redisClient.expire(
                redisRateLimitByIpKey,
                timeToLive
            );
        }

        // Limit exceeded
        if (requestCount > maxRequest) {
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
};

module.exports = rateLimitByIp;