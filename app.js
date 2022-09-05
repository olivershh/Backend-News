const express = require("express");
const app = express();

const { getTopics } = require("./controllers/topics.controllers");
const { getArticleById } = require("./controllers/articles.controllers");
const {} = require("./controllers/users.controllers");
const {} = require("./controllers/comments.controllers");

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.use((err, req, res, next) => {
  console.log(err, "<<< unhandled error!!");
  res.status(500).send({ msg: "internal server error" });
});

module.exports = app;
