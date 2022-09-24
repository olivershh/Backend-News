const { selectEndpoints } = require("../models/home.model");
const endpointsObject = require("../endpoints");

exports.getEndpoints = async (req, res, next) => {
  try {
    const endpoints = await selectEndpoints();
    res.status(200).send(endpoints);
  } catch (err) {
    next(err);
  }
};
