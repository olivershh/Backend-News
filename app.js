const express = require("express");
const app = express();

const { getTopics } = require("./controllers/topics.controller");
const {
  getArticleById,
  patchArticleById,
  getArticles,
  getCommentsByArticleId,
  postCommentByArticleId,
} = require("./controllers/articles.controller");
const { getUsers } = require("./controllers/users.controller");
const { deleteCommentById } = require("./controllers/comments.controller");
const {
  customErrorHandler,
  psqlErrorHandler,
  uncaughtErrorHandler,
} = require("./controllers/errors.controllers");

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.get("/api/articles", getArticles);
app.patch("/api/articles/:article_id", patchArticleById);
app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.get("/api/users", getUsers);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.use(psqlErrorHandler);
app.use(customErrorHandler);
app.use(uncaughtErrorHandler);

module.exports = app;
