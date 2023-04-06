var express = require("express");
var router = express.Router();
var pool = require("./db");

router.get("/get/gym", (req, res, next) => {
  pool.query(
    `
    SELECT * FROM (
      SELECT * FROM people 
      ORDER BY time DESC LIMIT 30
      ) sub 
    ORDER BY time ASC;
    `,
    (q_err, q_res) => {
      // console.log(q_res);
      console.log(q_err);
      res.json(q_res.rows);
    }
  );
});

module.exports = router;
