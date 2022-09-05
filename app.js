const express = require("express");
const app = express();

const { getTopics } = require("./controllers/topics.controller");

app.use(express.json());

app.get("/api/topics", getTopics);

app.use((err, req, res, next) => {
  console.log(err, "<<< unhandled error!!");
  res.status(500).send({ msg: "internal server error" });
});

module.exports = app;
