const config = require("config");
const con = config.get("dbConfig_UCN");
const sql = require("mssql");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const { resolve } = require("path");
const { reject } = require("lodash");

class Task {
  //constructor
  constructor(taskObj) {//specify mandatory/non-mandatory
    if (taskObj.taskId) { //if the taskObj has a taskId:
      this.taskId = taskObj.taskId;
    }
    if (taskObj.labelId) {
      this.labelId = taskObj.labelId;
    }
    if (taskObj.userId) {
      this.userId = taskObj.userId;
    }
    if (taskObj.taskdueDate) {
      this.taskDueDate = taskObj.taskDueDate;
    }
    if (taskObj.tasksubject) {
      this.tasksubject = taskObj.tasksubject;
    }

  }


  //validate - task object:
  static validationSchema() {
    const schema = Joi.object({
      taskId: Joi.number()
        .integer()
        .min(1),
      label: Joi.object({
        labelId: Joi.number()
          .integer()
          .min(1)
          .required(),
        labelName: Joi.string()
          .max(50)
      }),
      taskdueDate: Joi.number()
        .integer(),
      tasksubject: Joi.string()
        .max(255)
        .min(1),
    });
    return schema;
  }

  static validate(taskObj) {
    const schema = Task.validationSchema();

    return schema.validate(taskObj);
  }

  //getting ALL tasks. Would probably only be for the admin of the application
  static getAllTasks() {
    return new Promise((resolve, reject) => {
      (async () => {
        try {

          const pool = await sql.connect(con);
          const response = await pool.request().query(`
                  SELECT *
                  FROM stuorgTask
                  `);
          if (response.recordset.length == 0)
            throw {
              statusCode: 404,
              errorMessage: `no task found in the database`,
              errorObj: {},
            };
          //   console.log("there is at least 1 task in the database");

          //   console.log(response);
          //   console.log("tasks in the DB");

          let taskArray = [];

          response.recordset.forEach((task) => {
            console.log("this is each task");
            this.validate(task);
            // console.log("validating task");
            taskArray.push(task);
            // console.log("pushed into the taskArray");
          });

          console.log(taskArray);
          resolve(taskArray);
        } catch (err) {
          reject(err);
        }
        sql.close();
      })();
    });
  }

  //get OWN tasks
  static getOwnTasks(userId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {

          const pool = await sql.connect(con);
          const response = await pool
            .request()
            .input("userId", sql.Int(), userId).query(`
              SELECT *
              FROM stuorgTask
              WHERE FK_userId = @userId
              `);
          if (response.recordset.length == 0)
            throw {
              statusCode: 404,
              errorMessage: `no task found in the database`,
              errorObj: {},
            };
          console.log("there is at least 1 task in the database");

          console.log(response);
          console.log("tasks in the DB");

          let taskArray = [];
          console.log("created empty array");

          response.recordset.forEach((task) => {
            console.log("this is each task");
            this.validate(task);
            console.log("validating task");
            taskArray.push(task);
            console.log("pushed into the taskArray");
          });

          console.log(taskArray);
          resolve(taskArray);
        } catch (err) {
          console.log("we are at the error");
          reject(err);
        }
        sql.close();
      })();
    });
  }
     //get OWN tasks by labelId
  static getOwnTasksByLabelId(userId, labelId) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const pool = await sql.connect(con);
          const response = await pool
            .request()
            .input("userId", sql.Int(), userId)
            .input("labelId", sql.Int(), labelId)
            .query(`
              SELECT *
              FROM stuorgTask
              WHERE FK_userId = @userId
              AND FK_labelId = @labelId
              `);
          if (response.recordset.length == 0)
            throw {
              statusCode: 404,
              errorMessage: `no task found in the database`,
              errorObj: {},
            };
          console.log("there is at least 1 task in the database");

          console.log(response);
          console.log("tasks in the DB");

          let taskArray = [];
          console.log("created empty array");

          response.recordset.forEach((task) => {
            console.log("this is each task");
            this.validate(task);
            console.log("validating task");
            taskArray.push(task);
            console.log("pushed into the taskArray");
          });

          console.log(taskArray);
          resolve(taskArray);
        } catch (err) {
          console.log("we are at the error");
          reject(err);
        }
        sql.close();
      })();
    });
  }

}
// //create a new task
// static createTask(userId) {
//   return new Promise((resolve, reject) => {
//     (async () => {
//       console.log("started 1 try block on create group");
//       try {
//         const pool = await sql.connect(con);
//         console.log("connected to the database");
//         const result = await pool
//           .request()
//           .input("userId", sql.Int(), userId)
//           .query(`
//         SELECT * 
//         FROM stuorgTask
//         WHERE FK_userId = @userId
//         `);

//         if (result.recordset.length == 1)
//           throw {
//             statusCode: 401,
//             errorMessage: `task already exists in the table`,
//             errorObj: {},
//           };

//         if (result.recordset.length > 1)
//           throw {
//             statusCode: 500,
//             errorMessage: `corrupted data in the database`,
//             errorObj: {},
//           };
//       } catch (err) {
//         console.log("we are at the error");
//         reject(err);
//       }
//       sql.close();

//       console.log("started 2 try block on create group");
//       try {
//         const pool = await sql.connect(con);
//         console.log("connected to the database");
//         console.log("userId");
//         console.log(userId);

//         const result = await pool
//           .request()
//           .input("userId", sql.Int(), userId)
//           .input("labelId", sql.Int(), labelId)
//           .input(
//             "tasksubject",
//             sql.NVarChar(),
//             tasksubject.tasksubject
//           ).query(`
//           INSERT INTO stuorgTask
//           ([FK_userId], [FK_labelId], [tasksubject])
//           VALUES
//           (@userId, @labelId, @tasksubject)
//           SELECT *
//           FROM stuorgTask
//           WHERE TaskId = SCOPE_IDENTITY()
//           `);
//         console.log("send INSERT query to the DB");
//         if (result.recordset.length != 1)
//           throw {
//             statusCode: 500,
//             errorMessage: `insert failed`,
//             errorObj: {},
//           };

//         const task = result.recordset[0];
//         resolve(task);
//       } catch (err) {
//         console.log("we are at the error");
//         reject(err);
//       }
//       sql.close();
//     })();
//   });
// }

module.exports = Task;