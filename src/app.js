// app.js
const express = require("express");
const path = require("path");
const app = express();
const cookieParser = require("cookie-parser"); // Ya lo tienes importado, ¡bien!

// PARA MANEJAR req.body
app.use(express.json());

// 💡 Nuevo: Middleware para leer y escribir cookies
app.use(cookieParser()); 

// ARCHIVOS ESTÁTICOS
const RUTA_ESTATICA = path.join(__dirname, "..", "public");
app.use(express.static(RUTA_ESTATICA));

// RUTAS HTML
const viewRouter = require("./routes/viewRoutes");
app.use("/", viewRouter);

// RUTAS DE AUTH (register, login, etc.)
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// 💡 Nuevo: RUTAS PARA PUBLICACIONES
const postRoutes = require("./routes/postRoutes");
app.use("/api/posts", postRoutes); // Usamos '/api/posts' como prefijo para la API de posts

module.exports = app;