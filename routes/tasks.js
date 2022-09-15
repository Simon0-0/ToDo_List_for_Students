//require modules
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authenticate');
const Joi = require('joi');

// const taskData = require('../models/task');
// let currentLargestTaskId = taskData[taskData.length - 1].taskid;

//const admin = require('../middleware/admin'); - NOT CREATED


//GET /api/tasks/(?query options) 
router.get('/', [], async (req, res) => {
    res.header('Content-type', 'application/json');

    //creating an array of sets (of tasks), one for each query parameter
    let taskSets = [];
    Object.keys(req.query).forEach(key => {
        taskSets.push(new Set());
    })

    //if there ARE query parameters, iterate through all tasks in the Task array
    if (taskSets.length > 0) {
        taskData.forEach(task => {
            for (let tsi = 0; tsi < taskSets.length; tsi ++) {
                //iterate through query parameters (cases) via switch
                switch (Object.keys(req.query)[tsi])
                {
                    case 'label':
                        if (task.label.includes(req.query.label)) {
                            taskSets[tsi].add(task);
                        }
                        break;
                        //add more cases ?
                    default:
                        break;
                }
            }
        })

        let tasks;
        //if there is only one taskSet (one query parameter):
        if (taskSets.length == 1) {
            tasks = Array.from(taskSets[0]);
        } else { //if there is more than one taskSet: create an intersection of all (task)sets
            tasks = [];
            for (const task of taskSets.pop()) {
                let intersect = true;
                taskSets.forEach(taskSet => {
                    intersect = (intersect && taskSet.has(task));
                })
                //if the book is still in the Set intersection, we push it to the tasks array
                if (intersect) tasks.push(task);
            }
        }
        //respond with the tasks array (if there was any query parameters)
        res.send(JSON.stringify(tasks)); 
    } else {
        //respond with full Task array (if there were no query parameters)
        res.send(JSON.stringify(taskData));
    }

    // return res.send(JSON.stringify({message: 'GET /api/tasks/'}));
}); 

//POST /api/tasks ---> payload {task}
router.post('/', (req, res) => {
    res.header('Content-type', 'application/json');
//     CREATE TABLE stuorgTask
// (
//     taskId INT NOT NULL IDENTITY PRIMARY KEY,
//     FK_labelId INT,
//     FK_userId INT,
//     taskdueDate INT,
//     tasksubject NVARCHAR(50),

    const schema = Joi.object({
        "tasksubject": Joi.string()
            .min(1)
            .max(50),
    })

    const {error} =schema.validate(req.body);
    if (error) return res.status(400).send(JSON.stringify(error));

    req.body.taskid = ++currentLargestTaskId;

    taskData.push(req.body);

    const task = taskData.find(taskData => taskData.taskId == currentLargestTaskId);

    if (!task) return res.status(404).send(JSON.stringify([]));
    return res.send(JSON.stringify(task));
})


module.exports = router;