const { selectEndpoints } = require("../models/home.model");
const endpointsObject = require("../endpoints");

exports.getEndpoints = (req, res, next) => {
  selectEndpoints().then((endpoints) => {
    res.status(200).send(endpoints);
  });
};
