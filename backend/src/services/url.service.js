const generateShortCode = require("../utils/generateShortCode");
const urlRepository = require("../repositories/url.repository");

const createShortUrl = async (userId, originalUrl) => {
    const shortCode = generateShortCode();

    const url = await urlRepository.createUrl(
        userId,
        originalUrl,
        shortCode
    );

    return url;
};

module.exports = {
    createShortUrl
};