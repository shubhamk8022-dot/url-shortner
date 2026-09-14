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

    const userId = req.user.userId;

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

const getUrlsByUserId = async (req, res) => {
  try {
    const userId = req.user.userId;

    const page = Number(req.query.page) || 1;

    if (!Number.isInteger(page) || page < 1) {
      return res.status(400).json({
        status: "error",
        message: "Page must be a positive integer",
      });
    }

    const result = await urlService.getUrlsByUserId(userId, page);

    return res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    console.error("Get URLs error:", error);

    return res.status(500).json({
      status: "error",
      message: "Failed to load URLs",
    });
  }
};

const getUrlById = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { urlId } = req.params;

    if (!urlId) {
      return res
        .status(400)
        .json({ status: "error", message: "missing field..." });
    }

    const urlIdNumber = Number(urlId);

    if (!Number.isInteger(urlIdNumber) || urlIdNumber <= 0) {
      return res.status(400).json({
        status: "error",
        message: "urlId must be a positive integer",
      });
    }

    const result = await urlService.getUrlById(userId, urlIdNumber);
    if (!result) {
      return res
        .status(404)
        .json({ status: "error", message: "url not found..." });
    }
    return res.status(200).json({ status: "success", data: result });
  } catch (error) {
    console.log("Get Url error : ", error);
    return res
      .status(500)
      .json({ status: "error", message: "failed to find url" });
  }
};

const updateUrlById = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { urlId } = req.params;
    const { newUrl } = req.body;

    if (!urlId || !newUrl) {
      return res
        .status(400)
        .json({ status: "error", message: "missing field..." });
    }
    // validate url ID
    const urlIdNumber = Number(urlId);
    if (!Number.isInteger(urlIdNumber) || urlIdNumber <= 0) {
      return res.status(400).json({
        status: "error",
        message: "urlId must be a positive integer",
      });
    }
    // validate the new URL 
    const validation = validateUrl(newUrl);
    if (!validation.valid) {
      return res.status(400).json({
        status: "error",
        message: validation.message,
      });
    }

    const result = await urlService.updateUrlById(userId, urlIdNumber, validation.value);
    if (!result) {
      return res
        .status(404)
        .json({ status: "error", message: "url not found...." });
    }
    return res
      .status(200)
      .json({ status: "success", message: "url updated successfully..." });
  } catch (error) {
    console.log("url update error",error);
    return res.status(500).json({status:"error",message:"falied to update url..."})
  }
};

module.exports = {
  createShortUrl,
  redirectToOriginalUrl,
  getUrlsByUserId,
  getUrlById,
  updateUrlById
};
