const express = require("express");
const authenticate = require("../middlewares/auth.middleware")
const urlController = require("../controllers/url.controller");

const router = express.Router();

router.post("/",authenticate,urlController.createShortUrl);

router.get("/",authenticate,urlController.getUrlsByUserId);

router.get("/:urlId",authenticate,urlController.getUrlById);

router.patch("/:urlId",authenticate,urlController.updateUrlById);

router.delete("/:urlId",authenticate,urlController.deleteUrlById);

module.exports = router;