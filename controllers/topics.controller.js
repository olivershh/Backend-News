const { selectTopics } = require("../models/topics.model");

exports.getTopics = async (req, res, next) => {
  try {
    const topics = await selectTopics();

    res.status(200).send({ topics: topics });
  } catch (err) {
    next(err);
  }
};
