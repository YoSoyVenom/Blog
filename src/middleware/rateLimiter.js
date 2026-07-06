const { rateLimit } = require("express-rate-limit");

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    message: { message: "Demasiados intentos." },
    statusCode: 429,
    standardHeaders: true,
    legacyHeaders: false
});

module.exports = {
    loginLimiter
}