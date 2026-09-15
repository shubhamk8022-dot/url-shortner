const generateShortCode = require("../utils/generateShortCode");
const urlRepository = require("../repositories/url.repository");
const { redisClient } = require("../config/redis.config");

const createShortUrl = async (userId, originalUrl) => {
    const MAX_GENERATION_ATTEMPT = 5;

    for (let attempt = 1; attempt <= MAX_GENERATION_ATTEMPT; attempt++) {
        const shortCode = generateShortCode();

        try {
            return await urlRepository.createUrl(userId, originalUrl, shortCode);
        } catch (error) {
            if (error.code != "ER_DUP_ENTRY") {
                throw error;
            }
            console.warn(
                `short code colliison detected. Retrying ${attempt}/${MAX_GENERATION_ATTEMPT}`,
            );
        }
    }

    const error = new Error("Unable to generate unique short code");
    error.code = "SHORT_CODE_GENERATION_FAILED";
    throw error;
};

const getUrlByShortCode = async (shortCode) => {
    const cacheKey = `url:${shortCode}`;
    const cachedUrl = await redisClient.get(cacheKey);

    if (cachedUrl) {
        const cachedData = JSON.parse(cachedUrl);
        if (
            cachedData.expires_at &&
            new Date(cachedData.expires_at) <= new Date()
        ) {
            await redisClient.del(cacheKey);
            return {
                expired: true,
            };
        }
        console.log("redis hit successfull...");

        return {
            original_url: cachedData.original_url,
            short_code: shortCode,
            expires_at: cachedData.expires_at,
        };
    }

    const url = await urlRepository.findByShortCode(shortCode);

    if (!url) {
        return null;
    }

    if (url.expires_at && new Date(url.expires_at) <= new Date()) {
        return {
            expired: true,
        };
    }
    console.log(url.expires_at, new Date());

    // caching found url in redis
    await redisClient.set(
        cacheKey,
        JSON.stringify({
            original_url: url.original_url,
            expires_at: url.expires_at,
        }),
        {
            EX: url.expires_at
                ? Math.ceil((new Date(url.expires_at) - new Date()) / 1000)
                : 3600,
        },
    );
    return url;
};

const getUrlsByUserId = async (user_id, page = 1) => {
    const limit = 10;
    const offset = limit * page - limit;
    const urls = await urlRepository.findUrlsByUserId(user_id, limit, offset);

    return urls;
};

const getUrlById = async (user_id, url_id) => {
    const url = await urlRepository.findUrlById(user_id, url_id);

    if (!url) {
        return null;
    }

    return url;
};

const updateUrlById = async (user_id, url_id, new_url) => {
    const existingUrl = await getUrlById(user_id, url_id);
    if (!existingUrl) {
        return null;
    }
    const result = await urlRepository.updateUrlById(user_id, url_id, new_url);
    return result;
};

const deleteUrlById = async (user_id, url_id) => {
    const result = await urlRepository.deleteUrlById(user_id, url_id);
    return result;
};

module.exports = {
    createShortUrl,
    getUrlByShortCode,
    getUrlsByUserId,
    getUrlById,
    updateUrlById,
    deleteUrlById,
};
