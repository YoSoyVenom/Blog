module.exports = {
    secret: process.env.JWT_SECRET || "mi_super_secreto_123",
    expiresIn: "2h" // expira en 2 horas
};
