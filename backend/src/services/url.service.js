const generateShortCode = require("../utils/generateShortCode");
const urlRepository = require("../repositories/url.repository");

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
  const error = new error("Unable to generate unique short code");
  error.code = "SHORT_CODE_GENERATION_FAILED";
  throw error;
};

const getUrlByShortCode = async (shortCode) => {
  const url = await urlRepository.findByShortCode(shortCode);

  if (!url) {
    return null;
  }

  if (url.expires_at && new Date(url.expires_at) <= new Date()) {
    return {
      expired: true,
    };
  }

  return url;
};

module.exports = {
  createShortUrl,
  getUrlByShortCode,
};
