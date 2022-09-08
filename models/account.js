//require needed modules
const config = require('config');
const con = config.get('dbConfig_UCN');
const sql = require('mssql');
const Joi = require('joi');
const bcrypt = require('bcryptjs');





//DO WE NEED TO HAVE THE ROLEID AS A FOREIGN KEY IN OUR ACCOUNT MODEL(entity)?
class Account {
    constructor(accountObj) {
        if (accountObj.accountId) {
            this.accountId = accountObj.accountId;
        }
        this.displayName = accountObj.displayName;
        this.accountDescription = accountObj.accountDescription;
        if (accountObj.userId) {
            this.userId = accountObj.userId;
        }
        this.role = {
            roleId: accountObj.role.roleId,
        }
        if (accountObj.role.roleType) {
            this.role.roleType = accountObj.role.roleType;
        }
    }

    //creating our validation for our account object
    static validationSchema() {
        const schema = Joi.object({
            accountId: Joi.number()
                .integer()
                .min(1),
            displayName: Joi.string()
                .max(50),
                //.required(),?
            accountDescription: Joi.string()
                .max(500)
                .allow(null), //allow null description?
            userId: Joi.number()
                .integer()
                .min(1),
            role: Joi.object({
                roleId: Joi.number()
                    .integer()
                    .min(1),
                    //.required(),?
                roleType: Joi.string()
                    .max(20)
            })
                .required() 
        })
        return schema;
    };

    //validating our validation schema
    static validate(accountObj) {
        const schema = Account.validationSchema();
        return schema.validate(accountObj);
    };

    //method to check/validate our credentials object. Using password and user entity
    static validateCredentials(credentialsObj) {
        const schema = Joi.object({
            email: Joi.string()
                .email()
                .max(255)
                .required(),
            password: Joi.string()
                .required()
        })
        return schema.validate(credentialsObj);
    };

    static checkCredentials(credentialsObj) {
        return new Promise((resolve, reject) => {
            (async () => {
                //find the account
                try {
                    const account = await Account.....
                }
            }) 
        })
    }

    //I am stuck. I get confused between when to use user and account entity, because we dont have our email in the account but in the user
};


module.exports = Account;//in the end, export this to Account