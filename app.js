const express = require("express");

const app = express();

app.use(express.json());

app.use((err, req, res, next) => {
  console.log(err, "<<< unhandled error!!");
  res.status(500).send({ msg: "internal server error" });
});
