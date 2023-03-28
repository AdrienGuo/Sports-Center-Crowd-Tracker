const Pool = require("pg").Pool;

const pool = new Pool({
  user: "airflow",
  host: "airflow-postgres-1",
  database: "gym",
  password: "airflow",
});

module.exports = pool;
