const config = require("config");
const con = config.get("dbConfig_UCN");
const sql = require("mssql");
const Joi = require("joi");
const { reject } = require("lodash");
const { group } = require("console");

class Member {
  constructor(memberObj) {
    this.groupId = memberObj.groupId;
    this.userId = memberObj.userId;
  }

  static validationSchema() {
    const schema = Joi.object({
      groupId: Joi.number().integer().min(1),
      userId: Joi.number().integer().min(1),
    });
    console.log("validationSchema");
    return schema;
  }

  static validate(memberObj) {
    const schema = Member.validationSchema();
    console.log(`went through validate(memberObj)`);
    return schema.validate(memberObj);
  }

  static assignMember(groupId, userId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const pool = await sql.connect(con);
          const resultExistsCheck = await pool
            .request()
            .input("userId", sql.Int(), userId)
            .input("groupId", sql.Int(), groupId).query(`
            SELECT *
            FROM stuorgUserGroup
            WHERE FK_groupId = @groupId
            AND FK_userId = @userId
            `);

          if (resultExistsCheck.recordset.length == 1)
            throw {
              statusCode: 401,
              errorMessage: `user already exists in the database`,
              errorObj: {},
            };
          if (resultExistsCheck.recordset.length > 1)
            throw {
              statusCode: 500,
              errorMessage: `corrupted data in the database`,
              errorObj: {},
            };

            const result = await pool
            .request()
            .input("userId", sql.Int(), userId)
            .input("groupId", sql.Int(), groupId).query(`
            INSERT INTO stuorgUserGroup
            ([FK_groupId], [FK_userId])
            VALUES
            (@groupId, @userId)
            SELECT g.groupName, u.userName
            FROM stuorgUserGroup ug
            JOIN stuorgUser u
            ON ug.FK_userId = u.userId
            JOIN stuorgGroup g
            ON ug.FK_groupId = g.groupId
            WHERE ug.FK_userId = @userId
            AND ug.FK_groupId = @groupId       
            `);

          console.log("sent query");
          console.log(result);

          if (result.recordset.length == 0)
            throw {
              statusCode: 500,
              errorMessage: `insert failed`,
              errorObj: {},
            };

          console.log("result is not 0");

          if (result.recordset.length > 1)
            throw {
              statusCode: 500,
              errorMessage: `corrupted data in the DB`,
              errorObj: {},
            };

          console.log("result is 1");

          const member = result.recordset[0];
          console.log(member);
          this.validate(member);
          console.log(JSON.stringify(member));
          resolve(member);
        } catch (err) {
          console.log("we are at the error");
          reject(err);
        }
        sql.close();
      })();
    });
  }

  static getAllGroupMembers(groupId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const pool = await sql.connect(con);
          const result = await pool
            .request()
            .input("groupId", sql.Int(), groupId).query(`
                SELECT u.userName, g.groupId, g.groupName 
                FROM stuorgUserGroup ug
                JOIN stuorgUser u
                ON ug.FK_userId = u.userId
                JOIN stuorgGroup g
                ON ug.FK_groupId = g.groupId
                WHERE FK_groupId = @groupId
                `);

          console.log(result);

          if (result.recordset.length == 0)
            throw {
              statusCode: 404,
              errorMessage: `no members found for this groupId: ${groupId}`,
              errorObj: {},
            };

          const userSchema = Joi.object({
            groupId: Joi.number().integer().min(1),
            groupName: Joi.string(),
            userName: Joi.string(),
          });

          let membersArray = [];
          result.recordset.forEach((member) => {
            userSchema.validate(member);
            console.log("validated member");
            membersArray.push(member.userName);
          });

          console.log(membersArray);
          const responseObj = {
            groupName: result.recordset[0].groupName,
            groupId: result.recordset[0].groupId,
            groupMembers: membersArray,
          };

          const responseobjSchema = Joi.object({
            groupName: Joi.string(),
            groupId: Joi.number().integer().min(1),
            groupMembers: Joi.array(),
          });

          responseobjSchema.validate(responseObj);

          console.log(responseObj);

          resolve(responseObj);
        } catch (err) {
          console.log("we are at the error");
          reject(err);
        }
        sql.close();
      })();
    });
  }

  static leaveGroup(groupId, userId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
            console.log('started delete')
            console.log(userId)
          const pool = await sql.connect(con);
          const result = await pool
            .request()
            .input("userId", sql.Int(), userId)
            .input("groupId", sql.Int(), groupId).query(`
          SELECT g.groupName, ug.FK_userId
          FROM stuorgUserGroup ug
          JOIN stuorgGroup g
          ON ug.FK_groupId = g.groupId
          WHERE ug.FK_groupId = @groupId
          AND ug.FK_userId = @userId
          
          DELETE 
          FROM stuorgUserGroup
          WHERE FK_groupId = @groupId
          AND FK_userId = @userId
          `);

          console.log(result);

          if (result.recordset.length == 0)
            throw {
              statusCode: 404,
              errorMessage: `no userId: ${userId} found for this groupId: ${groupId}`,
              errorObj: {},
            };
          if (result.recordset.length > 1)
            throw {
              statusCode: 500,
              errorMessage: `corrupted data in the DB`,
              errorObj: {},
            };

          const deletedMember = result.recordset[0];
          resolve(deletedMember);
        } catch (err) {
            reject(err)
        }
      })();
    });
  }


}

module.exports = Member;
