//require modules
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authenticate')
//const authenticate = require('../middleware/authenticate'); - NOT CREATED
//const admin = require('../middleware/admin'); - NOT CREATED

//GET /api/tasks/(?query options) 
router.get('/', [], async (req, res) => {
    res.header('Content-type', 'application/json');
    return res.send(JSON.stringify({message: 'GET /api/tasks/'}));
}); 


module.exports = router;