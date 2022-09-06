const express = require("express");
const app = express();

const { getTopics } = require("./controllers/topics.controller");
const { getArticleById } = require("./controllers/articles.controller");
const { getUsers } = require("./controllers/users.controller");
const {} = require("./controllers/comments.controller");

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.use("/api/users", getUsers);

app.use((err, req, res, next) => {
  const errorCodes = ["22P02"];
  if (errorCodes.includes(err.code)) {
    res.status(400).send({ msg: "bad request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status);
    res.send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err, "<<< unhandled error!!");
  res.status(500).send({ msg: "internal server error" });
});

module.exports = app;
