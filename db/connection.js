const { Pool } = require("pg");
const ENV = process.env.NODE_ENV || "development";

require("dotenv").config({
  path: `${__dirname}/../.env.${ENV}`,
});

const config = {};
if (ENV === "production") {
  config.connectionString = process.env.DATABASE_URL;
  config.ssl = { rejectUnauthorized: false };
}

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL OR PGDATABASE not set");
}

// if (!process.env.PGDATABASE) {
//   throw new Error('PGDATABASE not set');
// }

module.exports = new Pool(config);
