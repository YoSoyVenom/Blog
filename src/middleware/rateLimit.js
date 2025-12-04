const rateLimit = require("express-rate-limit");

// Limitar intentos de login (10 intentos por 15 minutos)
exports.loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { message: "Demasiados intentos, intenta más tarde." }
});
