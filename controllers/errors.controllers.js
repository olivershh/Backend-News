exports.psqlErrorHandler = (err, req, res, next) => {
  const errorCodes = ["22P02", "23502"];
  if (errorCodes.includes(err.code)) {
    res.status(400).send({ msg: "bad request" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "does not exist" });
  } else {
    next(err);
  }
};

exports.customErrorHandler = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status);
    res.send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.uncaughtErrorHandler = (err, req, res, next) => {
  console.log(err, "<<< unhandled error!!");
  res.status(500).send({ msg: "internal server error" });
};
