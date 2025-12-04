const express = require("express");
const path = require("path");
const app = express();

// PARA MANEJAR req.body
app.use(express.json());

// ARCHIVOS ESTÁTICOS
const RUTA_ESTATICA = path.join(__dirname, "..", "public");
app.use(express.static(RUTA_ESTATICA));

// RUTAS HTML
const viewRouter = require("./routes/viewRoutes");
app.use("/", viewRouter);

// RUTAS DE AUTH (register, login, etc.)
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

module.exports = app;
