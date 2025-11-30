const express = require("express");
const router = express.Router();
const path = require("path");

// RUTA ABSOLUTA DE LA CARPETA VIEWS.
const VIEWS_DIR = path.join(__dirname, "..", "..", "public", "views");

// RUTA GET
router.get("/", (req,res) => {
    res.sendFile(path.join(VIEWS_DIR, "main.html"));
});

module.exports = router;