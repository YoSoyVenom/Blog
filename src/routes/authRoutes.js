const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.get("/api/auth", authController.register);

router.get("/api/auth", authController.login);

module.exports = router;