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

module.exports = Task;