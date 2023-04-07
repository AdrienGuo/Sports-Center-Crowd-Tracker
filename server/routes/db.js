const Pool = require("pg").Pool;

const pool = new Pool({
  host: "sports-center-crowd-tracker-postgres-1",
  user: "airflow",
  password: "airflow",
  database: "sports_center",
});

module.exports = pool;
