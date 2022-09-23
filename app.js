const express = require("express");
const app = express();

const homeRouter = require("./routes/home-router");
const topicsRouter = require("./routes/topics-router");
const articlesRouter = require("./routes/articles-router");
const commentsRouter = require("./routes/comments-router");
const usersRouter = require("./routes/users-router");

const {
  customErrorHandler,
  psqlErrorHandler,
  uncaughtErrorHandler,
} = require("./controllers/errors.controllers");

app.use(express.json());

// routes
app.use("/", homeRouter);
app.use("/api/users", usersRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/articles", articlesRouter);
app.use("/api/topics", topicsRouter); // DONE

//error handling
app.use(psqlErrorHandler);
app.use(customErrorHandler);
app.use(uncaughtErrorHandler);

module.exports = app;
