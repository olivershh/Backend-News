const { selectTopics } = require("../models/topics.model");

exports.getTopics = (req, res, next) => {
  selectTopics().then((topicsArray) => {
    res.status(200).send({ topics: topicsArray });
  });
};
