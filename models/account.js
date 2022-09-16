//require needed modules
const config = require("config");
const con = config.get("dbConfig_UCN");
const sql = require("mssql");
const Joi = require("joi");
const bcrypt = require("bcryptjs");

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
      email: Joi.string().max(50).email().required(),

      accountDescription: Joi.string().allow(null), //allow null description?
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

  //CREATE method to create an account
  //create method
    // eg.:
    // const myNewAccount = new Account(accountObj)
    // myNewAccount.create(password)
    //
    create(password) {
      return new Promise((resolve, reject) => {
          (async () => {
              //check if account already exists based on this.email. if found --> reject with error, because the resource already exists!
              try { //this makes sure that we do not have that account with that email in the db
                  const account = await Account.findAccountByUser(this.email);
                  const error = {statusCode: 409, errorMessage: `Account already exists`, errorObj: {} };
                  reject(error); 
              } catch (err) {
                  if (!err.statusCode || err.statusCode != 404) {
                      reject(err);
                  }
              }

              try {
                  //Open connection to DB
                  const pool = await sql.connect(con);
                  //Query the DB with INSERT INTO liloAccount table and SELECT from the liloAccount table by the newly inserted identity
                  if (!this.email) {
                    this.email = null;
                  }
                  const resultUser = await pool.request()
                  .input('email', sql.NVarChar(), this.email)
                  .input('userName', sql.NVarChar, this.userName)
                  .query(`
                    INSERT INTO stuorgUser
                      ([email], [userName])
                    VALUES
                      (@email, @userName);
                    SELECT *
                    FROM stuorgUser su
                    WHERE su.userId = SCOPE_IDENTITY()
                  `)

                  //do we have axactly ONE new line inserted?
                  if (resultUser.recordset.length != 1) throw {statusCode: 500, errorMessage: `INSERT INTO user table failed`, errorObj: {} };

                  if (!this.displayName) {
                      this.displayName = null;
                  }
                  const resultAccount = await pool.request()
                  .input('email', sql.NVarChar(), this.email)
                  .input('displayName', sql.NVarChar(), this.displayName)
                  .query(`
                      INSERT INTO stuorgAccount 
                          ([email], [displayName])
                      VALUES
                          (@email, @displayName);
                      SELECT * 
                      FROM stuorgAccount sa
                      WHERE sa.accountId = SCOPE_IDENTITY()
                  `) //the DB handles the FK_roleid DEFAULT value, set to 2, as of member

                  //do we have axactly ONE new line inserted?
                  if (resultAccount.recordset.length != 1) throw {statusCode: 500, errorMessage: `INSERT INTO account table failed`, errorObj: {} };

                  //insterting the hashed password into the stuorgPassword
                  const hashedpassword = bcrypt.hashSync(password);
                  const accountId = resultAccount.recordset[0].accountId;

                  const resultPassword = await pool.request()
                      .input('accountId', sql.Int(), accountId)
                      .input('hashedpassword', sql.NVarChar(), hashedpassword)
                      .query(`
                          INSERT INTO stuorgPassword
                              ([FK_accountId], [hashedpassword])
                          VALUES
                              (@accountId, @hashedpassword);
                          SELECT *
                          FROM stuorgPassword sp
                          WHERE sp.FK_accountId = @accountid
                      `) 

                  //do we have axactly ONE new line inserted?
                  if (resultPassword.recordset.length != 1) throw {statusCode: 500, errorMessage: `INSERT INTO account table failed`, errorObj: {} };
                  console.log(resultPassword.recordset[0]);

                  sql.close();
                  //to do the below, we have to have a closed DB, which is why we do it on the line above
                  const account = await Account.findAccountByUser(this.email);
                  resolve(account);

              } catch (err) {
                  reject(err)
              }
              
              //      close the DB connection
              sql.close();

          })();
      })
  }
}

module.exports = Account; //in the end, export this to Account
