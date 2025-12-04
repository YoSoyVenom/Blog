const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { loginLimiter } = require("../middleware/rateLimit");

router.post("/register", authController.register);

// rate limit SOLO en login
router.post("/login", loginLimiter, authController.login);

module.exports = router;
