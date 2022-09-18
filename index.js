const express = require("express");
const app = express();
const cors = require("cors");
const env = require("dotenv").config();
const config = require("config");
const login = require("./routes/login");
const accounts = require("./routes/accounts");
const resHeader = require("./middleware/setHeaderResponse");
const groups = require("./routes/groups");

app.use(express.json());
const corsOpt = {
  exposedHeaders: ["x-authToken"],
};
app.use(cors(corsOpt));
app.use(resHeader);
app.use("/api/accounts/login", login);
app.use("/api/accounts", accounts);
app.use("/api/groups", groups);

app.listen(
  config.get("port"),
  console.log(`listening on port ${config.get("port")}...`)
);
