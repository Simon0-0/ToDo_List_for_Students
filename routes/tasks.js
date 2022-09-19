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
router.get("/", [], async (req, res) => {
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



module.exports = router;