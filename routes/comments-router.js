const {
  deleteCommentById,
  patchComment,
} = require("../controllers/comments.controller");
const commentsRouter = require("express").Router();

commentsRouter
  .route("/:comment_id")
  .delete(deleteCommentById)
  .patch(patchComment);

module.exports = commentsRouter;
