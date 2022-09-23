const db = require("../db/connection");

exports.selectUsers = () => {
  return db.query(`SELECT * FROM users;`).then((queryData) => queryData.rows);
};

exports.selectUser = (username) => {
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then((queryData) => {
      const user = queryData.rows[0];
      if (!user) {
        return Promise.reject({ status: 404, msg: "user not found" });
      }

      return user;
    });
};
