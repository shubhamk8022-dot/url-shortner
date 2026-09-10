const urlService = require("../services/url.service");
const validateUrl = require("../utils/validateUrl");
const validateShortCode = require("../utils/validateShortCode");
const createShortUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;

    const validation = validateUrl(originalUrl);

    if (!validation.valid) {
      return res.status(400).json({
        status: "error",
        message: validation.message,
      });
    }

    const userId = 1;

    const url = await urlService.createShortUrl(userId, validation.value);

    return res.status(201).json({
      status: "success",
      data: {
        id: url.id,
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        shortUrl: `http://localhost:3000/${url.shortCode}`,
      },
    });
  } catch (error) {
    console.error("Create URL error:", error);

    if (error.code === "SHORT_CODE_GENERATION_FAILED") {
      return res.status(503).json({
        status: "error",
        message: "Unable to generate a unique short URL",
      });
    }

    return res.status(500).json({
      status: "error",
      message: "Failed to create short URL",
    });
  }
};

const redirectToOriginalUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;

    // validate the short code for the right length and format.
    const validation = validateShortCode(shortCode);
    if (!validation) {
      return res.status(400).json({ status: "error", message: "invalid url" });
    }

    const url = await urlService.getUrlByShortCode(shortCode);

    if (!url) {
      return res.status(404).json({
        status: "error",
        message: "Short URL not found",
      });
    }

    if (url.expired) {
      return res.status(410).json({
        status: "error",
        message: "Short URL has expired",
      });
    }

    return res.redirect(302, url.original_url);
  } catch (error) {
    console.error("Redirect error:", error);

    return res.status(500).json({
      status: "error",
      message: "Failed to redirect",
    });
  }
};

module.exports = {
  createShortUrl,
  redirectToOriginalUrl,
};
