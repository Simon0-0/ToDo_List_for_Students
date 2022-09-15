const config = require("config");
const con = config.get("dbConfig_UCN");
const sql = require("mssql");
const Joi = require("joi");
const bcrypt = require("bcryptjs");

class Task {
    //constructor
    constructor(taskObj) {//specify mandatory/non-mandatory
        if (taskObj.taskId) { //if the taskObj has a taskId:
            this.taskId = taskObj.taskId;
        }
        this.label = {
            labelId: taskObj.label.labelId
        }
        if (taskObj.label.labelName) {
            this.label.labelName = taskObj.label.labelName
        }
        this.account = {
            accountId: taskObj.account.accountId
        }
        if (taskObj.account.displayName) {
            this.account.displayName = taskObj.account.displayName;
        }
        if (taskObj.taskdueDate) {
            this.taskdueDate = taskObj.taskdueDate;
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

    //readByTaskId
    static readByTaskId() {
        return new Promise((resolve, reject) => {
            (async () => {

                try {
                    //open connection to db
                    const pool = await sql.connect(con);
                    //query the db -- account where email = email
                    const result = await pool.request()
                        // .input('taskId', sql.integer(), taskId)
                        .query(`
                            SELECT * 
                            FROM stuorgTask st
                            `)
                            // WHERE st.taskId= @taskId
                            // INNER JOIN stuorgAccount sa
                            // ON st.FK_ownerId = sa.displayName

                    resolve();
                } catch (err) {
                    //error
                    reject(err);
                }

                //close DB
                sql.close();
            })();
        })
    }
}