const express = require("express");
const { requireAuth } = require("../middleware/authMiddleware");
const { validateMiddleware } = require("../middleware/validateMiddleware");
const { validateComment } = require("../schemas/schemas")
const { getCommentsController, toggleCommentLikeController, createCommentController, deleteCommentController, getAnswersController } = require("../controllers/commentController");
const commentsRouter = express.Router();

// OBTENER COMENTARIOS.
commentsRouter.get("/:postId", requireAuth, getCommentsController);

// OBTENER RESPUESTAS.
commentsRouter.get("/:commentId/answers", requireAuth, getAnswersController);

// ELIMINAR COMENTARIO (POST)
commentsRouter.delete("/", requireAuth, deleteCommentController);

// DAR LIKE (POST)
commentsRouter.post("/:commentId/like", requireAuth, toggleCommentLikeController);

// CREAR UN COMENTARIO (POST)
commentsRouter.post("/", requireAuth, validateMiddleware(validateComment), createCommentController);

module.exports = {
    commentsRouter
}