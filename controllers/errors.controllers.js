exports.psqlErrorHandler = (err, req, res, next) => {
  const errorCodes = ["22P02", "23502"];

  if (errorCodes.includes(err.code)) {
    console.log("in first error codes");
    console.log(err);
    res.status(400).send({ msg: "bad request" });
  } else if (err.code === "23503") {
    // when foreign key does not exist
    console.log("in erro code 23503");
    const foreignKey = err.detail.match(/\((\w*)\)/)[1];

    res.status(404).send({ msg: `${foreignKey} does not exist` });
  } else {
    next(err);
  }
};

exports.customErrorHandler = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.uncaughtErrorHandler = (err, req, res, next) => {
  console.log(err, "<<< unhandled error!!");
  res.status(500).send({ msg: "internal server error" });
};
