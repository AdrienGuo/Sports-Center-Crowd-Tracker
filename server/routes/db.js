const Pool = require("pg").Pool;

const pool = new Pool({
  user: "airflow",
  host: "sports-center-crowd-tracker-postgres-1",
  database: "sports_center",
  password: "airflow",
});

module.exports = pool;
