const urlService = require("../services/url.service");

const createShortUrl = async (req, res) => {
    try {
        const { originalUrl } = req.body;

        if (!originalUrl) {
            return res.status(400).json({
                status: "error",
                message: "originalUrl is required"
            });
        }

        const userId = 1;

        const url = await urlService.createShortUrl(
            userId,
            originalUrl
        );

        return res.status(201).json({
            status: "success",
            data: {
                id: url.id,
                originalUrl: url.originalUrl,
                shortCode: url.shortCode,
                shortUrl: `http://localhost:3000/${url.shortCode}`
            }
        });
    } catch (error) {
        console.error("Create URL error:", error);

        return res.status(500).json({
            status: "error",
            message: "Failed to create short URL"
        });
    }
};

module.exports = {
    createShortUrl
};