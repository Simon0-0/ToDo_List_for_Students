//require modules
const express = require('express');
const router = express.Router();
//const authenticate = require('../middleware/authenticate'); - NOT CREATED
//const admin = require('../middleware/admin'); - NOT CREATED

//GET endpoint
router.get('/', (req, res) => {
    res.header('Content-type', 'application/json');

    console.log(req.account);
    res.send(JSON.stringify({message: 'This is GET /api/profiles'}));
}); 

//POST endpoint
router.post('/', [authenticate], (req, res) => {//adjust to our project
    res.header('Content-type', 'application/json');

    console.log(req.account);
    res.send(JSON.stringify({message: 'This is POST /api/profiles'}));
});

//PUT endpoint
router.put('/:profileid', [authenticate], (req, res) => {//adjust to our project
    res.header('Content-type', 'application/json');

    res.send(JSON.stringify({message: `This is PUT /api/profiles/${req.params.profileid}`}));
});

//DELETE endpoint
router.delete('/:profileid', [authenticate, admin], (req, res) => {//adjust to our project
    res.header('Content-type', 'application/json');

    res.send(JSON.stringify({message: `This is DELETE /api/profiles/${req.params.profileid}`}));
});

module.exports = router;