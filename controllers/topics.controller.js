const { selectTopics } = require("../models/topics.model");

exports.getTopics = (req, res, next) => {
  selectTopics().then((data) => {
    res.status(200).send({ topics: data });
  });
};
