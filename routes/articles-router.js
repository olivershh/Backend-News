const {
  getArticleById,
  getCommentsByArticleId,
  getArticles,
  patchArticleById,
  postCommentByArticleId,
  postArticle,
} = require("../controllers/articles.controller");
const articlesRouter = require("express").Router();

articlesRouter.route("/").get(getArticles).post(postArticle);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId);

module.exports = articlesRouter;
