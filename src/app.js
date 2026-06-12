// app.js
const express = require("express");
const path = require("path");
const app = express();
const cookieParser = require("cookie-parser"); // Ya lo tienes importado, ¡bien!

// PARA MANEJAR req.body
app.use(express.json());

// 💡 Nuevo: Middleware para leer y escribir cookies
app.use(cookieParser()); 



module.exports = app;