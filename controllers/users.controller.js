const { selectUsers, selectUser } = require("../models/users.model");

exports.getUsers = (req, res, next) => {
  selectUsers()
    .then((users) => {
      res.status(200).send({ users: users });
    })
    .catch(next);
};

exports.getUser = (req, res, next) => {
  const username = req.params.username;

  selectUser(username)
    .then((user) => {
      res.status(200).send({ user: user });
    })
    .catch(next);
};
