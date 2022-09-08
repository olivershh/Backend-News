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
const {} = require("./controllers/comments.controller");
const {
  customErrorHandler,
  psqlErrorHandler,
  uncaughtErrorHandler,
} = require("./controllers/errors.controllers");

app.use(express.json());

//topics
app.get("/api/topics", getTopics);

//articles
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.get("/api/articles", getArticles);
app.patch("/api/articles/:article_id", patchArticleById);
app.post("/api/articles/:article_id/comments", postCommentByArticleId);

//users
app.use("/api/users", getUsers);

//errors
app.use((err, req, res, next) => {
  console.log(err);
  next(err);
});

app.use(psqlErrorHandler);
app.use(customErrorHandler);
app.use(uncaughtErrorHandler);

module.exports = app;
