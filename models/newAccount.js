const config = require("config");
const con = config.get("dbConfig_UCN");
const sql = require("mssql");
const Joi = require("joi");
const bcrypt = require("bcryptjs");

class NewAccount {
  constructor(newAccountObj) {
    if (newAccountObj.accountId) {
      this.accountId = newAccountObj.accountId;
    }
    this.userId = newAccountObj.userId;
    this.email = newAccountObj.email;
    this.displayName = newAccountObj.displayName;
    if (newAccountObj.accountDescription) {
      this.accountDescription = newAccountObj.accountDescription;
    }
    this.role = {
      roleId: newAccountObj.role.roleId,
    };
    if (newAccountObj.role.roleType) {
      this.role.roleType = newAccountObj.role.roleType;
    }
  }

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

  static validate(accountObj) {
    const schema = Account.validationSchema();
    console.log(`went through validate(accountObj)`);
    return schema.validate(accountObj);
  }

  static validatePostBody(postObj) {
    const schema = Joi.object({
      email: Joi.string().email().max(255).required(),
      password: Joi.string().required(),
      displayName: Joi.string().max(255).required(),
      accountDescription: Joi.string().allow(null),
    });
    console.log('problem with body val');
    return schema.validate(postObj);
  }

  createNewAcount() {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const pool = await sql.connect(con);

          const emailCheckresult = await pool
            .request()
            .input("email", sql.NVarChar(), email)
            .query(
              `
               SELECT *
               FROM stuorgUser u
               WHERE u.email = @email
               `
            );

          console.log("send the check email query to the datebase");

          if (emailCheckresult.recordset.length !== 0)
            throw {
              statusCode: 404,
              errorMessage: `email already in the datebase`,
              errorObj: {},
            };

          const userResult = await pool
            .request()
            .input("email", sql.NVarChar(), this.email)
            .input("displayName", sql.NVarChar(), this.displayName)
            .query(
              `
              INSERT INTO stuorgUser
              ([userName], [email])
              VALUES 
              (@displayName, @email)
              GO

              SELECT *
              FROM stuorgUser
              WHERE email = @email
              `
            );

          console.log("send the user insert query to the datebase");

          if (userResult.recordset.length == 0)
            throw {
              statusCode: 401,
              errorMessage: `user regist failed`,
              errorObj: {},
            };

          if (userResult.recordset.length > 1)
            throw {
              statusCode: 401,
              errorMessage: `corrupted data in the database`,
              errorObj: {},
            };

          const accountResult = await pool
            .request()
            .input("displayName", sql.NVarChar(), this.displayName)
            .input("accountDescription", sql.NVarChar(), this.displayName)
            .input("FK_userId", sql.Int(), userResult.recordset[0].userId)
            .query(
              `
                    INSERT INTO stuorgAccount
                    ([displayName], [accountDescription], [FK_userId], [FK_roleId])
                    VALUES
                    (@displayName, @accountDescription, @FK_userId, 2)
                    GO

                    SELECT *
                    FROM stuorgUser u
                    JOIN stuorgAccount a 
                    ON u.userId = a.FK_userId
                    JOIN stuorgRole r
                    ON a.FK_roleId = r.roleId
                    WHERE u.email = @email
                    `
            );

          if (accountResult.recordset.length == 0)
            throw {
              statusCode: 401,
              errorMessage: `account regist failed`,
              errorObj: {},
            };

          const newAccountWanbe = {
            accountId: accountResult.recordset[0].accountId,
            userId: userResult.recordset[0].userId,
            email: userResult.recordset[0].email,
            displayName: accountResult.recordset[0].displayName,
            accountDescription: accountResult.recordset[0].accountDescription,
            role: {
              roleId: accountResult.recordset[0].roleId,
              roleType: accountResult.recordset[0].roleType,
            },
          };

          console.log(newAccountWanbe);

          const { error } = Account.validate(newAccountWanbe);
          console.log("account validated in readByUser function");

          if (error)
            throw {
              statusCode: 500,
              errorMessage: `Corrupted account data in the DB`,
              errorObj: error,
            };

          console.log("started resolve");

          resolve(new Account(newAccountWanbe));
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
}

module.exports = NewAccount;
//   const result = await pool
//     .request()
//     .input("email", sql.NVarChar(), email)
//     .query(
//       `
//       SELECT *
//       FROM stuorgUser u
//       WHERE u.email = @email
//       `
//     );

//   console.log("send the check email query to the datebase");

//   if (result.recordset.length !== 0)
//     throw {
//       statusCode: 404,
//       errorMessage: `email already in the datebase`,
//       errorObj: {},
//     };

//   if (result.recordset.length == 0) {
//     const result = await pool
//       .request()
//       .input("email", sql.NVarChar(), email)
//       .query(
//         `
//       SELECT *
//       FROM stuorgUser u
//       WHERE u.email = @email
//       `
//       );
//   }
