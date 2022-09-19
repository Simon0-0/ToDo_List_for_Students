const config = require("config");
const con = config.get("dbConfig_UCN");
const sql = require("mssql");
const Joi = require("joi");
const authenticate = require("../middleware/authenticate");
const router = require("./members");

router.post('/', async (req, res)=>{
    try {
        
    } catch (err) {
        if (err.statusCode)
        return res.status(err.statusCode).send(JSON.stringify(err));
      return res.status(500).send(JSON.stringify(err)); 
    }
})

module.exports = router;
