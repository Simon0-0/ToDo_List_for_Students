const express = require("express");
const app = express();
const cors = require("cors");
const env = require("dotenv").config();
const config = require("config");
const login = require("./routes/login");
const signup = require("./routes/signup");
const accounts = require("./routes/accounts");
const resHeader = require("./middleware/setHeaderResponse");

app.use(express.json());
const corsOpt = {
  exposedHeaders: ["x-authToken"],
};
app.use(cors(corsOpt));
app.use(resHeader);
app.use("/api/accounts/signup", signup);
app.use("/api/accounts/login", login);
app.use("/api/users", users);
app.use("/api/accounts", accounts);


app.listen(
  config.get("port"),
  console.log(`listening on port ${config.get("port")}...`)
);
