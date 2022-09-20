const express = require("express");
const router = express.Router();
const Account = require("../models/account");
const config = require("config");
const Joi = require("joi");

//holy trinity
const auth = require("../middleware/authenticate");
const admin = require("../middleware/admin");
const check = require("../middleware/checkauthorisation");

router.post("/", async (req, res) => {
  try {
    const schemaPayload = Joi.object({
      password: Joi.string().required(),
      userId: Joi.number().integer().min(1).required(),
      userName: Joi.string().required(),
    });

    const validPayload = schemaPayload.validate(req.body);

    if (validPayload.error)
      throw {
        statusCode: 400,
        errorMessage: "Badly formatted request payload",
        errorObj: error,
      };


    const newAccount = await Account.createAccount(
      req.body.password,
      req.body.userId,
      req.body.userName
    );

    return res.send(JSON.stringify(newAccount));
  } catch (err) {
    if (err.statusCode)
      return res.status(err.statusCode).send(JSON.stringify(err));
    return res.status(500).send(JSON.stringify(err));
  }
});

// GET [auth, admin, check] /api/accounts/:accountid
//      query: -
router.get('/:accountId', [auth, admin], async (req, res) => {

  try {
      // validate accountid
      const schema = Joi.object({
          accountId: Joi.number()
              .integer()
              .min(1)
              .required()
      });  

      const { error } = schema.validate(req.params);
      if (error) throw { statusCode: 400, errorMessage: `Badly formatted request`, errorObj: error }

      // call Account.readById(accountid) --> the request parameters can be found in req.params.<name>
      const account = await Account.findAccountById(req.params.accountId);

      // respond with account
      return res.send(JSON.stringify(account));

  } catch (err) { // if error
      if (err.statusCode) {   // if error with statusCode, send error with status: statusCode 
          return res.status(err.statusCode).send(JSON.stringify(err));
      }
      return res.status(500).send(JSON.stringify(err));   // if no statusCode, send error with status: 500
  }

  // return res.send(JSON.stringify({ message: `GET /api/accounts/${req.params.accountid}` }));
})


// PUT /api/accounts
router.put("/:userId", [auth], async (req, res) => {
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

// DELETE /api/accounts/:accountid
router.delete("/:accountid", [auth], async (req, res) => {
  try {
    const deleteAccount = await Account.deleteAccount(
      req.account.accountId,
      req.account.userId,
      req.account.email
    );
    console.log("deleted the account");
    return res.send(JSON.stringify(deleteAccount));
  } catch (err) {
    console.log("we are at the error");
    if (err.statusCode)
      return res.status(err.statusCode).send(JSON.stringify(err));
    return res.status(500).send(JSON.stringify(err));
  }
});

module.exports = router;
