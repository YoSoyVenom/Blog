const express = require("express");
const path = require("path");
const app = express();

// PARA MANEJAR REQ.BODY
app.use(express.json());

// CARGA ARCHIVOS CSS, JS, IMÁGENES, ETC.
const RUTA_ESTATICA = path.join(__dirname, "..", "public");
app.use(express.static(RUTA_ESTATICA));

// RUTAS.
// CARGAR ARCHIVOS HTML.
const viewRouter = require("./routes/viewRoutes.js");
app.use("/", viewRouter);

// CARGAR LOGICA DE INICIO DE SESIÓN Y REGISTRO.
const authRoutes = require("./routes/authRoutes.js");
app.use("/api/auth", authRoutes);

module.exports = app;