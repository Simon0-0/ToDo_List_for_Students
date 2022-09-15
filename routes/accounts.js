const express = require("express");
const router = express.Router();
const Account = require("../models/account");
const config = require("config");
const Joi = require("joi");
const authenticate = require("../middleware/authenticate");

router.put("/:userId", [authenticate], async (req, res) => {
  // res.send(JSON.stringify());
  console.log(`this is token obj `);
  console.log(req.account);
  try {
    const changeName = req.body;
    console.log(`get the new name:`);
    console.log(changeName);

    const schema = Joi.object({
      displayName: Joi.string().min(3).required(),
    });
    let validChangePayload = schema.validate(changeName);
    console.log("payload validated");

    if (validChangePayload.error)
      throw {
        statusCode: 400,
        errorMessage: "Badly formatted request payload",
        errorObj: error,
      };

    console.log("no error so far in accounts");

    const updatedAccount = await Account.changeDisplayName(
      changeName.displayName,
      req.account.accountId,
      req.account.email
    );
    return res.send(JSON.stringify(updatedAccount));
  } catch (err) {
    console.log("we are at the error");
    if (err.statusCode)
      return res.status(err.statusCode).send(JSON.stringify(err));
    return res.status(500).send(JSON.stringify(err));
  }
});

module.exports = router;
