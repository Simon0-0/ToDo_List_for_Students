module.exports = (req, res, next) => {
    try {
        // we will be requesting weather the req userId mathes with group user id
        if (req.account.role.roleType != 'admin') throw {statusCode: 401, errorMessage: 'Unauthorised access', errorObj: {}}

        next();

    } catch (err) {
        if (err.statusCode) return res.status(err.statusCode).send(JSON.stringify(err));
        return res.status(500).send(JSON.stringify(err));
    }
}