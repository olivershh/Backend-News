const express = require("express");
const app = express();

const { getTopics } = require("./controllers/topics.controller");
const { getArticleById } = require("./controllers/articles.controller");
const { getUsers } = require("./controllers/users.controller");
const {} = require("./controllers/comments.controller");
const {
  customErrorHandler,
  psqlErrorHandler,
  uncaughtErrorHandler,
} = require("./controllers/errors.controllers");

//topics
app.get("/api/topics", getTopics);

//articles
app.get("/api/articles/:article_id", getArticleById);

//users
app.use("/api/users", getUsers);

//errors
app.use(psqlErrorHandler);
app.use(customErrorHandler);
app.use(uncaughtErrorHandler);

module.exports = app;
