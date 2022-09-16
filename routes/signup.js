const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Account = require("../models/account");
const config = require("config");
const _ = require('lodash');
const Joi = require("joi");
const authenticate = require("../middleware/authenticate");



// POST route for creating a user at /api/accounts/signup
router.post('/', async (req, res) => {
    // return res.send(JSON.stringify({message: 'POST /api/users'}));
    try {
    const userWanbe = _.pick(req.body, ['email', 'userName']);
    const passwordWanbe = _.pick(req.body, ['password']);

    //check raw password
    const schema = Joi.object({
        password: Joi.string()
        .min(1)
        .required()
    })

    //validate password
    let validationResult = schema.validate(passwordWanbe);
    if(validationResult.error) throw {statusCode: 400, errorMessage: `Password does not match the requirements`, errorObj: validationResult.error};

    //validate user info
    validationResult = User.validate(userWanbe);
    if (validationResult.error) throw {statusCode: 400, errorMessage: `Bad request`, errorObj: validationResult.error};

    //new User
    const userToBeSaved = new User(userWanbe);
    const user = await userToBeSaved.create(passwordWanbe.password);

    //respond with the user
    return res.send(JSON.stringify(user));
    } catch (err) {
        if (err.statusCode) {
            return res.status(err.statusCode).send(JSON.stringify(err));
        }
        return res.status(500).send(JSON.stringify(err));
    }
});