//require needed modules
const config = require("config");
const con = config.get("dbConfig_UCN");
const sql = require("mssql");
const Joi = require("joi");
const bcrypt = require("bcryptjs");

class User {
    constructor(userObj) {
      if (userObj.userId) {
        this.userId = userObj.userId;
      }
      this.email = userObj.email;
      this.userName = userObj.userName;
    }

    static validationSchema() {
        const schema = Joi.object({
          usertId: Joi.number().integer().min(1),
          userName: Joi.string().max(255).required(),
          email: Joi.string().max(50).email().required()
        });
        console.log("validationSchema");
        return schema;
    };

    //validating our validation schema
  static validate(userObj) {
    const schema = User.validationSchema();
    console.log(`went through validate(userObj)`);
    return schema.validate(userObj);
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

          const user = await User.findUserByEmail(credObj.email);
        
          const pool = await sql.connect(con);
          const result = await pool
            .request()
            .input("userId", sql.Int(), user.userId)
            .query(
              `SELECT *
            FROM stuorgPassword p
            WHERE p.userId = @userId`
            );
          console.log("query send");
          if (result.recordset.length != 1)
            throw { statusCode: 500, errorMessage: `Corrupt DB`, errorObj: {} };

          console.log("result recevied");

          const hashedPas = result.recordset[0].hashedPassword;
          console.log(`result recordset ${result.recordset[0]}`);
          console.log(credObj.password);

          const okCred = bcrypt.compareSync(credObj.password, hashedPas);

          console.log(`user password found ${credObj.password}`);
          if (!okCred)
            throw {
              statusCode: 401,
            };
          console.log("resolving user");
          resolve(user);
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

  static findUserByEmail(email) {
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
              WHERE u.email = @email
              `
            );

          console.log("send the query to the datebase");

          if (result.recordset.length == 0)
            throw {
              statusCode: 404,
              errorMessage: `User not found`,
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

          const userWanbe = {
            userId: result.recordset[0].userId,
            email: result.recordset[0].email,
            userName: result.recordset[0].userName
          };

          console.log(userWanbe);

          const { error } = User.validate(userWanbe);
          console.log("user validated in readByEmail function");

          if (error)
            throw {
              statusCode: 500,
              errorMessage: `Corrupted user data in the DB`,
              errorObj: error,
            };

          console.log("started resolve");

          resolve(new User(userWanbe));
          console.log("resolved with user");
        } catch (err) {
          console.log("we are getting rejected with an error");
          console.log(err);
          reject(err);
        }
        sql.close();
      })();

    })
  }
  

  //create method for user
      create(password) {
        return new Promise((resolve, reject) => {
            (async () => {
                //check if account already exists based on this.email. if found --> reject with error, because the resource already exists!
                try { //this makes sure that we do not have that account with that email in the db
                    const user = await User.findAccountByUser(this.email);
                    const error = {statusCode: 409, errorMessage: `User already exists`, errorObj: {} };
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

                    //insert the hashed password into stuorgPassword
                    const hashedpassword = bcrypt.hashSync(password);
                    const userId = resultUser.recordset[0].userId;
  
                    const resultPassword = await pool.request()
                        .input('userId', sql.Int(), userId)
                        .input('hashedpassword', sql.NVarChar(), hashedpassword)
                        .query(`
                            INSERT INTO stuorgPassword
                                ([userId], [hashedpassword])
                            VALUES
                                (@userId, @hashedpassword);
                            SELECT *
                            FROM stuorgPassword sp
                            WHERE sp.userId = @userId
                        `) 
  
                    //do we have axactly ONE new line inserted?
                    if (resultPassword.recordset.length != 1) throw {statusCode: 500, errorMessage: `INSERT INTO user table failed`, errorObj: {} };
                    console.log(resultPassword.recordset[0]);
  
                    sql.close();
                    //to do the below, we have to have a closed DB, which is why we do it on the line above
                    const user = await User.findAccountByUser(this.email);
                    resolve(user);
  
                } catch (err) {
                    reject(err)
                }
                
                //      close the DB connection
                sql.close();
              })();
        })
      }
    }

module.exports = User;