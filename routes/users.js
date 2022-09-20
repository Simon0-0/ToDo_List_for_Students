const config = require("config");
const con = config.get("dbConfig_UCN");
const sql = require("mssql");
const Joi = require("joi");
const authenticate = require("../middleware/authenticate");
const router = require("./members");
const User = require("../models/user");

router.post("/", async (req, res) => {
  try {
    const payloadValidation = Joi.object({
      userName: Joi.string().max(255).required(),
      email: Joi.string().max(255).required(),
    });

    let validPayload = payloadValidation.validate(req.body);
    if(validPayload.error)throw {
      statusCode: 400,
      errorMessage: "Badly formatted request",
      errorObj: err,
    };

    const newUserName = req.body.userName;
    const newEmail = req.body.email;

    const newUser = await User.createUser(newEmail, newUserName);
    return res.send(JSON.stringify(newUser));
  } catch (err) {
    if (err.statusCode)
      return res.status(err.statusCode).send(JSON.stringify(err));
    return res.status(500).send(JSON.stringify(err));
  }
});

module.exports = router;
