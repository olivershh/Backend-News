const app = require("./app");

const { PORT = 9010 } = process.env; //need to update when soriting heroku

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Listening on port ${PORT}...`);
});
