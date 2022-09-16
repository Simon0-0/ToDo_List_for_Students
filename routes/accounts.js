const express = require("express");
const router = express.Router();
const Account = require("../models/account");
const config = require("config");
const _ = require('lodash');
const Joi = require("joi");
const authenticate = require("../middleware/authenticate");

// PUT /api/accounts
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

//POST route
router.post('/', async (req, res) => {
    // //have to separate the password and the account info from the req.body (with lodash)
    try {
        //separate the account's info from the req.body
        const accountWanbe = _.pick(req.body, ['email', 'displayName']);
        //separate the password from the req.body 
        const passwordWanbe = _.pick(req.body, ['password']);
        
        //check the raw password
        const schema = Joi.object({
            password: Joi.string()
            .min(3)
            .required()
        })
        
        //validate the password -- raw password rules here
        let validationResult = schema.validate(passwordWanbe);
        if(validationResult.error) throw {statusCode: 400, errorMessage: `Password does not match the requirements`, errorObj: validationResult.error };
        
        //validate the account info
        validationResult = Account.validate(accountWanbe);
        if (validationResult.error) throw {statusCode: 400, errorMessage: `Badly formatted request`, errorObj: validationResult.error};
        
        //new Account(account info)
        const accountToBeSaved = new Account(accountWanbe);
        //call create method on the new account object, with the password as input parameter
        const account = await accountToBeSaved.create(passwordWanbe.password);
        
        //respond with account
        return res.send(JSON.stringify(account));
        
    } catch (err) {
        //if error, respond with error
        if (err.statusCode) {
            return res.status(err.statusCode).send(JSON.stringify(err));
        }
        return res.status(500).send(JSON.stringify(err));

    }

    // return res.send(JSON.stringify({message: `POST /api/accounts`}));
})

// DELETE /api/accounts/:accountid
router.delete('/:accountid', [], async (req, res) => {
  return res.send(JSON.stringify({message: `DELETE /api/accounts/${req.params.accountid}`}));
});

module.exports = router;
