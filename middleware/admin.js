module.exports = (req, res, next) => {

    const authorisedRole = 'admin';
    try {
        // we will be requesting weather the req userId mathes with group user id
        if (!req.account) throw { statusCode: 401, errorMessage: 'Unauthorised access', errorObj: {} }

        if (req.account.role && req.account.role.roleType == authorisedRole) { // !!! to check req.account.role.rolename, have to make sure that req.account.role is there too to avoid JS error
            req.account.authorised = true; 
        }
        return next();

    } catch (err) {
        if (err.statusCode) {

            return res.status(err.statusCode).send(JSON.stringify(err));
        }
        return res.status(500).send(JSON.stringify(err));
    }
}