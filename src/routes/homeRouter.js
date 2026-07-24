const express = require("express");
const homeRouter = express.Router();
const { loadHome, loadUserData } = require("../controllers/authController");
const { requireAuth } = require("../middleware/authMiddleware");

homeRouter.get("/", loadHome);
homeRouter.get("/me", requireAuth, loadUserData);

module.exports = {
    homeRouter
};