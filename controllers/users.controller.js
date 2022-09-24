const { selectUsers, selectUser } = require("../models/users.model");

exports.getUsers = async (req, res, next) => {
  try {
    const users = await selectUsers();
    res.status(200).send({ users: users });
  } catch (err) {
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  const { username } = req.params;

  try {
    const user = await selectUser(username);
    res.status(200).send({ user: user });
  } catch (err) {
    next(err);
  }
};
