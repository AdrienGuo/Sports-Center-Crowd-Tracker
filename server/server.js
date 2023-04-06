var express = require("express");
var cors = require("cors");

var app = express();

var testAPIRouter = require("./routes/testAPI");
var databaseRouter = require("./routes/database");

app.use(cors());
app.use("/testAPI", testAPIRouter);
app.use("/database", databaseRouter);

// Constants
const PORT = 8080;
const HOST = "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});

module.exports = app;
