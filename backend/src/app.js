const express = require("express");

const urlRoutes = require("./routes/url.routes");

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "URL Shortener API is running"
    });
});

app.use("/api/urls", urlRoutes);

module.exports = app;