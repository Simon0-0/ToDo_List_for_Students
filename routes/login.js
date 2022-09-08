 //require the needed modules first
 const express = require('express');
 const router = express.Router();
 //require our Account class from models
 const Account = require('../models/account');
 //we need the const jwt = require('jsonwebtoken'); here but i forget if it is a module or what it is, and if we have then installed it?
 const config = require('config');

 //POST endpoint
 router.post('/', async (req, res) => {
    res.header('Content-type', 'application/json');
    
    try {
    //now we validate our req.body as credentials
        .... //stuck here because im stuck in the Account class in the models folder
    }
 })