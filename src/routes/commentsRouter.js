const express = require("express");
const { requireAuth } = require("../middleware/authMiddleware");
const { getCommentsController, toggleCommentLikeController } = require("../controllers/commentController");
const commentsRouter = express.Router();

// OBTENER COMENTARIOS.
commentsRouter.get("/:post_id", requireAuth, getCommentsController);

// DAR LIKE (POST)
commentsRouter.post("/:comment_id/like", requireAuth, toggleCommentLikeController);

module.exports = {
    commentsRouter
}