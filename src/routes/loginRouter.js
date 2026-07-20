const express = require("express");
const loginRouter = express.Router();
const { loginLimiter } = require("../middleware/rateLimiter");
const { validateDataLogin } = require("../schemas/schemas");
const { validateMiddleware } = require("../middleware/validateMiddleware");
const { loadLogin, loginController } = require("../controllers/loginController");

loginRouter.get("/", loadLogin);
loginRouter.post("/", loginLimiter, validateMiddleware(validateDataLogin), loginController);

module.exports = {
    loginRouter
};