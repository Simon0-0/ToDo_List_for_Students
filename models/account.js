//require needed modules
const config = require("config");
const con = config.get("dbConfig_UCN");
const sql = require("mssql");
const Joi = require("joi");
const bcrypt = require("bcryptjs");


//DO WE NEED TO HAVE THE ROLEID AS A FOREIGN KEY IN OUR ACCOUNT MODEL(entity)?
class Account {
  constructor(accountObj) {
    if (accountObj.accountId) {
      this.accountId = accountObj.accountId;
    }
    this.userId = accountObj.userId;
    this.email = accountObj.email;
    this.displayName = accountObj.displayName;
    if (accountObj.accountDescription) {
      this.accountDescription = accountObj.accountDescription;
    }
    this.role = {
      roleId: accountObj.role.roleId,
    };
    if (accountObj.role.roleType) {
      this.role.roleType = accountObj.role.roleType;
    }
  }

  //creating our validation for our account object
  static validationSchema() {
    const schema = Joi.object({
      accountId: Joi.number().integer().min(1),
      displayName: Joi.string().max(255).required(),
      email: Joi.string().max(50).required(),
      accountDescription: Joi.string().allow(null),
      userId: Joi.number().integer().min(1),
      role: Joi.object({
        roleId: Joi.number().integer().min(1).required(),
        roleType: Joi.string().max(20),
      }),
    });
    console.log("validationSchema");
    return schema;
  }

  //validating our validation schema
  static validate(accountObj) {
    const schema = Account.validationSchema();
    console.log(`went through validate(accountObj)`);
    return schema.validate(accountObj);
  }

  //method to check/validate our credentials object. Using password and user entity
  static validateCredentials(credentialsObj) {
    const schema = Joi.object({
      email: Joi.string().email().max(255).required(),
      password: Joi.string().required(),
    });
    console.log(credentialsObj);
    return schema.validate(credentialsObj);
  }

  static checkCred(credObj) {
    return new Promise((resolve, reject) => {
      (async () => {
        //find the account
        console.log("we are here");
        try {
          console.log("started try and catch bloc");

          const account = await Account.findAccountByUser(credObj.email);
          console.log("account found");
          const pool = await sql.connect(con);
          const result = await pool
            .request()
            .input("accountId", sql.Int(), account.accountId)
            .query(
              `SELECT *
            FROM stuorgPassword p
            WHERE p.FK_accountId = @accountId`
            );
          console.log("query send");
          if (result.recordset.length != 1)
            throw { statusCode: 500, errorMessage: `Corrupt DB`, errorObj: {} };

          console.log("result recevied");

          const hashedPas = result.recordset[0].hashedPassword;
          console.log(`result recordset ${result.recordset[0]}`);
          console.log(credObj.password);

          const okCred = bcrypt.compareSync(credObj.password, hashedPas);

          console.log(`account password found ${credObj.password}`);
          if (!okCred)
            throw {
              statusCode: 401,
            };
          console.log("resolving account");
          resolve(account);
        } catch (err) {
          reject({
            statusCode: 401,
            errorMessage: `Invalid username or password`,
            errorObj: {},
          });
          reject(err);
        }
        sql.close();
      })();
    });
  }

  //I am stuck. I get confused between when to use user and account entity, because we dont have our email in the account but in the user

  static findAccountByUser(email) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const pool = await sql.connect(con);
          const result = await pool
            .request()
            .input("email", sql.NVarChar(), email)
            .query(
              `
              SELECT *
              FROM stuorgUser u
              JOIN stuorgAccount a 
              ON u.userId = a.FK_userId
              JOIN stuorgRole r
              ON a.FK_roleId = r.roleId
              WHERE u.email = @email
              `
            );

          console.log("send the query to the datebase");

          if (result.recordset.length == 0)
            throw {
              statusCode: 404,
              errorMessage: `Account not found`,
              errorObj: {},
            };
          if (result.recordset.length > 1)
            throw {
              statusCode: 500,
              errorMessage: `Corrupt data in DB`,
              errorObj: {},
            };
          if ((result.recordset.length = 1)) {
            console.log(`one result found`);
          }

          const accountWanbe = {
            accountId: result.recordset[0].accountId,
            userId: result.recordset[0].userId,
            email: result.recordset[0].email,
            displayName: result.recordset[0].displayName,
            accountDescription: result.recordset[0].accountDescription,
            role: {
              roleId: result.recordset[0].roleId,
              roleType: result.recordset[0].roleType,
            },
          };

          console.log(accountWanbe);

          const { error } = Account.validate(accountWanbe);
          console.log("account validated in readByUser function");

          if (error)
            throw {
              statusCode: 500,
              errorMessage: `Corrupted account data in the DB`,
              errorObj: error,
            };

          console.log("started resolve");

          resolve(new Account(accountWanbe));
          console.log("resolved with account");
        } catch (err) {
          console.log("we are getting rejected with an error");
          console.log(err);
          reject(err);
        }
        sql.close();
      })();
    });
  }


  static findAccountById(accountId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const pool = await sql.connect(con);
          const result = await pool.request()
            .input('accountId', sql.Int(), accountId)
            .query(`
          SELECT *
          FROM stuorgAccount ac
            JOIN stuorgRole r
            ON ac.FK_roleId = r.roleId
            INNER JOIN stuorgUser u
            ON ac.FK_userId = u.userId
          WHERE ac.accountId = @accountId
          `)
          if (result.recordset.length > 1) throw { statusCode: 500, errorMessage: `Corrupt DB, mulitple accounts with accountId: ${accountId}`, errorObj: {} };
          if (result.recordset.length == 0) throw { statusCode: 404, errorMessage: `Account not found by accountId: ${accountId}`, errorObj: {} };

          const accountWanbe = {
            accountId: result.recordset[0].accountIvd,
            userId: result.recordset[0].userId,
            email: result.recordset[0].email,
            displayName: result.recordset[0].displayName,
            accountDescription: result.recordset[0].accountDescription,
            role: {
              roleId: result.recordset[0].roleId,
              roleType: result.recordset[0].roleType
            }
          }
          const { error } = Account.validate(accountWanbe);
          if (error) throw { statusCode: 500, errorMessage: `Corrupt DB, account does not validate: ${accountWanbe.accountid}`, errorObj: error };

          resolve(new Account(accountWanbe));
        } catch (err) {
          reject(err);
        }

        sql.close();
      })();
    })
  }

  static changeDisplayName(displayName, accountId, email) {
    return new Promise((resolve, reject) => {
      (async () => {
        console.log("started try block on changeDisplayName");
        try {
          const pool = await sql.connect(con);
          console.log("opened pool conection");
          console.log(displayName);
          console.log(accountId);
          console.log(email);

          const result = await pool
            .request()
            .input("displayName", sql.NVarChar(), displayName)
            .input("accountId", sql.Int(), accountId)
            .input("email", sql.NVarChar(), email)
            .query(
              `
              UPDATE stuorgAccount
              SET displayName = @displayName
              WHERE accountId = @accountId
              SELECT *
              FROM stuorgUser u
              JOIN stuorgAccount a 
              ON u.userId = a.FK_userId
              JOIN stuorgRole r
              ON a.FK_roleId = r.roleId
              WHERE u.email = @email
              `
            );

          console.log("send the query to the datebase");

          if (result.recordset.length == 0)
            throw {
              statusCode: 404,
              errorMessage: `Account not found`,
              errorObj: {},
            };
          if (result.recordset.length > 1)
            throw {
              statusCode: 500,
              errorMessage: `Corrupt data in DB`,
              errorObj: {},
            };
          if ((result.recordset.length = 1)) {
            console.log(`one result found`);
          }

          const accountWanbe = {
            accountId: result.recordset[0].accountId,
            userId: result.recordset[0].userId,
            email: result.recordset[0].email,
            displayName: result.recordset[0].displayName,
            accountDescription: result.recordset[0].accountDescription,
            role: {
              roleId: result.recordset[0].roleId,
              roleType: result.recordset[0].roleType,
            },
          };

          console.log(accountWanbe);

          const { error } = Account.validate(accountWanbe);
          console.log("account validated in readByUser function");

          if (error)
            throw {
              statusCode: 500,
              errorMessage: `Corrupted account data in the DB`,
              errorObj: error,
            };

          console.log("started resolve");

          resolve(new Account(accountWanbe));
          console.log("resolved with account");
        } catch (err) {
          console.log("we are getting rejected with an error");
          console.log(err);
          reject(err);
        }
        sql.close();
      })();
    });
  }

  static deleteAccount(accountId, userId, email) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          console.log("started first try box");

          const findAccountToDelete = await Account.findAccountByUser(email);
          console.log("called findAccountByUser");

          if (findAccountToDelete.recordset.length == 0)
            throw {
              statusCode: 404,
              errorMessage: `Account not found`,
              errorObj: {},
            };

          console.log("recordset not 0");

          if (findAccountToDelete.recordset.length > 1)
            throw {
              statusCode: 500,
              errorMessage: `Corrupt data in DB`,
              errorObj: {},
            };
          console.log("recordset not > 1");

          resolve(findAccountToDelete.recordset[0]);
          console.log("resolved with account object");
        } catch (err) {
          reject(err);
        }
        try {
          console.log("started second try box");

          const pool = await sql.connect(con);
          console.log("create query");

          const response = await pool
            .request()
            .input("accountId", sql.Int(), accountId)
            .input("userId", sql.Int(), userId).query(`
          DELETE 
          FROM stuorgUserGroup
          WHERE FK_userId = @userId

          DELETE 
          FROM stuorgGroupTask
          WHERE FK_userId = @userId

          DELETE 
          FROM stuorgGroup
          WHERE FK_userId = @userId
          
          DELETE 
          FROM stuorgTask
          WHERE FK_userId = @userId
          
          DELETE 
          FROM stuorgPassword
          WHERE FK_accountId = @accountId

          DELETE 
          FROM stuorgAccount
          WHERE accountId = @accountId

          DELETE 
          FROM stuorgUser
          WHERE userId = @userId

          SELECT *
          FROM stuorgUser u
          JOIN stuorgAccount a 
          ON u.userId = a.FK_userId
          WHERE u.userId = @userId
          `);

          console.log("send a query");

          resolve(response.recordset[0]);
          console.log("resolve with empty object");
        } catch (err) {
          console.log("error in accounts");
          reject(err);
        }
        sql.close();
      })();
    });
  }

  static createAccount(password, userId, userName) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const pool = await sql.connect(con);
          const checkResult = await pool
            .request()
            .input("userName", sql.NVarChar(), userName)
            .input("userId", sql.Int(), userId).query(`

            SELECT *
            FROM stuorgAccount
            WHERE FK_userId = @userId
            `);

          if (checkResult.recordset.length == 1)
            throw {
              statusCode: 401,
              errorMessage: `Account with this userId: ${userId} already exists`,
              errorObj: {},
            };
          if (checkResult.recordset.length > 1)
            throw {
              statusCode: 500,
              errorMessage: `corrupted data in the DB`,
              errorObj: {},
            };

          const result = await pool
            .request()
            .input("userName", sql.NVarChar(), userName)
            .input("userId", sql.Int(), userId).query(`
            INSERT INTO stuorgAccount
            ([displayName],[FK_userId],[FK_roleId])
            VALUES
            (@userName, @userId, 2)

            SELECT *
            FROM stuorgAccount a
            JOIN stuorgUser u 
            ON a.FK_userId = u.userId
            JOIN stuorgRole r
            ON a.FK_roleId = r.roleId
            WHERE accountId = SCOPE_IDENTITY()
            `);

          if (result.recordset.length == 0)
            throw {
              statusCode: 404,
              errorMessage: `Account not found, insert failed`,
              errorObj: {},
            };
          if (result.recordset.length > 1)
            throw {
              statusCode: 500,
              errorMessage: `corrupted data in the DB`,
              errorObj: {},
            };

          const recivedAccount = result.recordset[0];
          const accountId = recivedAccount.accountId;
          console.log(accountId);

          console.log(password);

          const hashedPassword = bcrypt.hashSync(password);

          const resultPassword = await pool
            .request()
            .input("password", sql.NVarChar(), hashedPassword)
            .input("accountId", sql.Int(), accountId).query(`
              INSERT INTO stuorgPassword
              ([FK_accountId], [hashedPassword])
              VALUES
              (@accountId, @password)
              `);


          const newAccount = {
            accountId: recivedAccount.accountId,
            displayName: recivedAccount.displayName,
            email: recivedAccount.email,
            accountDescription: recivedAccount.accountDescription,
            userId: recivedAccount.userId,
            role: {
              roleId: recivedAccount.roleId,
              roleType: recivedAccount.roleType,
            },
          };

          Account.validationSchema(newAccount);

          resolve(newAccount);
          console.log("resolved");
        } catch (err) {
          reject(err);
        }
        sql.close();
      })();
    });
  }
}

module.exports = Account; //in the end, export this to Account
