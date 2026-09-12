const express = require("express");
const authenticate = require("../middlewares/auth.middleware")
const urlController = require("../controllers/url.controller");

const router = express.Router();

router.post("/",authenticate,urlController.createShortUrl);

// router.post("/register", authController.register);

module.exports = router;