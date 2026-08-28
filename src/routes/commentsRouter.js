const express = require("express");
const { requireAuth } = require("../middleware/authMiddleware");
const { validateMiddleware } = require("../middleware/validateMiddleware");
const { validateComment } = require("../schemas/schemas")
const { getCommentsController, toggleCommentLikeController, createCommentController, deleteCommentController } = require("../controllers/commentController");
const commentsRouter = express.Router();

// OBTENER COMENTARIOS.
commentsRouter.get("/:post_id", requireAuth, getCommentsController);

// ELIMINAR COMENTARIO (POST)
commentsRouter.delete("/", requireAuth, deleteCommentController);

// DAR LIKE (POST)
commentsRouter.post("/:comment_id/like", requireAuth, toggleCommentLikeController);

// CREAR UN COMENTARIO (POST)
commentsRouter.post("/", requireAuth, validateMiddleware(validateComment), createCommentController);

module.exports = {
    commentsRouter
}