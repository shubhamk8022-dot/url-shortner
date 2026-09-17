const express = require("express");

const urlRoutes = require("./routes/url.routes");
const urlController = require("./controllers/url.controller");
const authRoutes = require("./routes/auth.routes");
const rateLimitByIp = require("./middlewares/ratelimit.middleware")
const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "URL Shortener API is running"
    });
});

app.use("/api/urls", urlRoutes);

app.get("/:shortCode",rateLimitByIp, urlController.redirectToOriginalUrl);

app.use("/api/auth", authRoutes);



module.exports = app;