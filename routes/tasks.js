const express = require("express");
const router = express.Router();
const Task = require("../models/task");
const config = require("config");
const _ = require("lodash");
const authenticate = require("../middleware/authenticate");
const adminAuth = require("../middleware/admin");
const Joi = require("joi");

// const taskData = require('../models/task');
// let currentLargestTaskId = taskData[taskData.length - 1].taskid;

//const admin = require('../middleware/admin'); - NOT CREATED


//GET /api/tasks/(?query options) 
router.get("/", [authenticate, adminAuth], async (req, res) => {
    try {
      const tasks = await Task.getAllTasks();
      console.log("called function");
      return res.send(JSON.stringify(tasks));
    } catch (err) {
      if (err.statusCode) {
        return res.status(err.statusCode).send(JSON.stringify(err));
      }
      return res.status(500).send(JSON.stringify(err));
    }
  });

  //GET /api/tasks/own/:labelId - get own tasks with specific labelId
  router.get("/own/:labelId", [authenticate], async (req, res) => {
    try {
      const tasks = await Task.getOwnTasksByLabelId(req.account.userId, req.params.labelId);
      return res.send(JSON.stringify(tasks));
    } catch (err) {
      if (err.statusCode) {
        return res.status(err.statusCode).send(JSON.stringify(err));
      }
      return res.status(500).send(JSON.stringify(err));
    }
  });

  //GET /api/tasks/own - get own tasks
  router.get("/own", [authenticate], async (req, res) => {
    try {
      const tasks = await Task.getOwnTasks(req.account.userId);
      console.log(req.account.userId);
      return res.send(JSON.stringify(tasks));
    } catch (err) {
      if (err.statusCode) {
        return res.status(err.statusCode).send(JSON.stringify(err));
      }
      return res.status(500).send(JSON.stringify(err));
    }
  });

  //POST /api/tasks/own - create a new task for yourself
    // router.post("/own", [authenticate], async (req, res) => {
    //   try {
    //     console.log("started groups try and catch");
    //     let validPayload = Task.validate(req.body);
    //     if (validPayload.error)
    //       throw {
    //         statusCode: 400,
    //         errorMessage: "Badly formatted request",
    //         errorObj: err,
    //       };
    //     console.log("validated users payload");
    
    //     const userId = _.pick(req.body, ["userId"]);
    //     const labelId = _.pick(req.body, ["labelId"]);
    //     const tasksubject = _.pick(req.body, ["tasksubject"]);
    
    //     console.log("parsed payload");
    
    //     const task = await Task.create(
    //       userId,
    //       labelId,
    //       tasksubject
    //     );
    //     console.log("called function");
    
    //     return res.send(JSON.stringify(task));
    //   } catch (err) {
    //     if (err.statusCode) {
    //       return res.status(err.statusCode).send(JSON.stringify(err));
    //     }
    //     return res.status(500).send(JSON.stringify(err));
    //   }
    // });
       


  // router.delete("/:groupId/:userId", [authenticate], async (req, res) => {
  //   try {
  //     console.log('started removeMember')
  //     const deletedMember = await Member.leaveGroup(req.params.groupId, req.params.userId);
  //     return res.send(JSON.stringify(deletedMember));
  //   } catch (err) {
  //     if (err.statusCode) {
  //       return res.status(err.statusCode).send(JSON.stringify(err));
  //     }
  //     return res.status(500).send(JSON.stringify(err));
  //   }
  // });
  // router.delete("/:groupId", [authenticate], async (req, res) => {
  //   try {
  //     const deletedMember = await Member.leaveGroup(req.params.groupId, req.account.userId);
  //     return res.send(JSON.stringify(deletedMember));
  //   } catch (err) {
  //     if (err.statusCode) {
  //       return res.status(err.statusCode).send(JSON.stringify(err));
  //     }
  //     return res.status(500).send(JSON.stringify(err));
  //   }
  // });


module.exports = router;