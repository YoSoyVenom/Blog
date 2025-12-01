const express = require("express");
const router = express.Router();
const path = require("path");

// RUTA ABSOLUTA DE LA CARPETA VIEWS.
const VIEWS_DIR = path.join(__dirname, "..", "..", "public", "views");

// RUTAs GET
router.get("/", (req, res) => {
    res.sendFile(path.join(VIEWS_DIR, "home.html"));
});

router.get("/login", (req, res) => {
    res.sendFile(path.join(VIEWS_DIR, "login.html"));
});

router.get("/register", (req, res) => {
    res.sendFile(path.join(VIEWS_DIR, "register.html"));
});

router.get("/privacy", (req, res) => {
    res.sendFile(path.join(VIEWS_DIR, "privacy.html"));
});

router.get("/about", (req, res) => {
    res.sendFile(path.join(VIEWS_DIR, "about.html"));
});

router.get("/profile", (req, res) => {
    res.sendFile(path.join(VIEWS_DIR, "profile.html"));
});

router.get("/terms", (req, res) => {
    res.sendFile(path.join(VIEWS_DIR, "terms.html"));
});

module.exports = router;