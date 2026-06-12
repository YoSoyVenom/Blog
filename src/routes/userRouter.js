const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.use(express.json());

router.get("/", userController);

module.exports = router;