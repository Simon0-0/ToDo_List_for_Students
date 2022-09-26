//require modules
const config = require('config');
const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
    try {
    //check if there is a token in the header
    const token = req.header('x-authToken');//adjust to what we will name our auth header
    if (!token) throw {statusCode: 401, errorMessage: `Access denied, no token provided.`, errorObj: {} };

    //check if token is correct (can be decrypted)
    const decryptedtoken = jwt.verify(token, config.get('jwt_key'));

    //attach the account info to the re req object
    req.account = decryptedtoken;

    //if all good --> move on
    next();

    //            --> if not, error
    } catch (err) {
        if (err.statusCode) return res.status(err.statusCode).send(JSON.stringify(err));
        return res.status(500).send(JSON.stringify(err));
    }
};