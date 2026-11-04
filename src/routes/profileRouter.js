const express = require("express");
const { loadProfile, loadDataProfile } = require("../controllers/profileController");
const { requireAuth } = require("../middleware/authMiddleware");
const profileRouter = express.Router();

profileRouter.get("/", loadProfile);
profileRouter.post("/me", requireAuth, loadDataProfile);

module.exports = {
    profileRouter
}