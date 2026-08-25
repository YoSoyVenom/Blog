const express = require("express");
const { requireAuth } = require("../middleware/authMiddleware");
const { getCommentsController } = require("../controllers/commentController");
const commentsRouter = express.Router();

// OBTENER COMENTARIOS.
commentsRouter.get("/:post_id", requireAuth, getCommentsController);

module.exports = {
    commentsRouter
}