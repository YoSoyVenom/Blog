const express = require("express");
const path = require("path");
const app = express();
const rateLimit = require("express-rate-limit");

// PARA MANEJAR REQ.BODY
app.use(express.json());

// CARGA ARCHIVOS CSS, JS, IMÁGENES, ETC.
const RUTA_ESTATICA = path.join(__dirname, "..", "public");
app.use(express.static(RUTA_ESTATICA));

// FUNCIÓN PARA EL LOGIN.
const loginLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message: {message: "Demasiados intentos. Intenta en un minuto"}
});

// RUTAS.
// CARGAR ARCHIVOS HTML.
const viewRouter = require("./routes/viewRoutes.js");
app.use("/", viewRouter);

// CARGAR LOGICA DE INICIO DE SESIÓN Y REGISTRO.
const authRoutes = require("./routes/authRoutes.js");
app.use("/api/auth", authRoutes);

app.use("/api/auth/login", loginLimiter);

module.exports = app;