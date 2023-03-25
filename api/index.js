// IMPORTING
const express = require('express');
const router = express.Router();

// GET request - Purpose: To check the server is running.
router.get('/health', async (req, res, next) => {
    console.log("Server is up and all is well!");
    next();
});

// Routing from root index.js (/api) to desired path 

const usersRouter = require('./users');
router.use('/users', usersRouter);

const activitiesRouter = require('./activities');
router.use('/activities', activitiesRouter);

const routinesRouter = require('./routines');
router.use('/routines', routinesRouter);

const routineActivitiesRouter = require('./routineActivities');
router.use('/routine_activities', routineActivitiesRouter);

// EXPORTING the route handler.
module.exports = router;