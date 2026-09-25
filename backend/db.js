const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

pool.connect((err) => {
  if (err) {
    console.error("❌ PostgreSQL Connection Failed!");
    console.error(err.message);
  } else {
    console.log("✅ PostgreSQL Connected Successfully!");
  }
});

module.exports = pool;