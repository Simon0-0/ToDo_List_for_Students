const express = require("express");
const router = express.Router();
const NewAccount = require("../models/newAccount");
const config = require("config");

router.post('/', async (req, res)=>{
    res.header("Content-type", "application/json");
    console.log("started post");
    try {
        const { error } = NewAccount.validatePostBody(req.body);
    console.log("validating");

    if (error)
      throw {
        statusCode: 400,
        errorMessage: "Badly formatted request payload",
        errorObj: error,
      };

    const newaccount = await NewAccount.createNewAcount(req.body);
    console.log("no error(in signUp so far)");
    return res.send(JSON.stringify(newaccount));

    } catch (err) {
        console.log('we are at the error')
    if (err.statusCode)
      return res.status(err.statusCode).send(JSON.stringify(err));
    return res.status(500).send(JSON.stringify(err));
    }
})

module.exports = router;
