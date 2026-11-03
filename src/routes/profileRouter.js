const express = require("express");
const { loadProfile } = require("../controllers/profileController");
const profileRouter = express.Router();

profileRouter.get("/", loadProfile);

module.exports = {
    profileRouter
}