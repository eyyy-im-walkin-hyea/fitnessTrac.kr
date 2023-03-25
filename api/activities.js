// IMPORTING necessary modules & database functions.
const express = require('express');
const { getAllActivities, getActivityById, createActivity, updateActivity, getPublicRoutinesByActivity } = require('../db');
const router = express.Router();
const jwt = require("jsonwebtoken");

// Middleware to test /api/activities
router.use("/", (req, res, next) => {
    console.log("A request is made to /activities");
    next();
});

// GET request - Purpose: Return a list of all public routines which feature that activity.
router.get("/:activityId/routines", async (req, res, next) => {
        const { activityId } = req.params;
    try {
        const getActivity = await getPublicRoutinesByActivity(activityId);
        res.send(getActivity);
    } catch (error) {
        next(error);
    };
});

// GET request - Purpose: Return a list of all activities in the database.
router.get("/", async (req, res, next) => {
    try {
        const allActivities = await getAllActivities();
        res.send(allActivities);
    } catch (error) {
        next(error);
    };
});

// POST request - Purpose: Create a new activity.
router.post("/", async (req, res, next) => {
        const { name, description } = req.body;
    try {
        const userToken = req.headers.authorization.split(" ")[1];
        const decryptedUserToken = jwt.verify(userToken, process.env.JWT_SECRET);
        
        if (decryptedUserToken && decryptedUserToken.id){
            const newActivity = await createActivity({name, description});
            res.send(newActivity);
        } else {
            res.send("You must be logged in to create a new activity.");
        };
    } catch (error) {
        next(error);
    };
});

// PATCH request - Purpose: To update an activity, via either name, description, or both.
router.patch("/:activityId", async (req, res, next) => {
        const { activityId  } = req.params;
        const { name, description } = req.body;
        const updateFields = {};

        if (name) {
            updateFields.name = name;
        };
        if (description) {
            updateFields.description = description;
        };
        try {
            const userToken = req.headers.authorization.split(" ")[1];
            const decryptedUserToken = jwt.verify(userToken, process.env.JWT_SECRET);
            const oldActivity = await getActivityById(activityId);
            
            if (oldActivity && decryptedUserToken.id ){
                const updatedActivity = await updateActivity(activityId, updateFields);
                res.send(updatedActivity);
            } else {
                res.send("Activity not found or user is not logged in.");
            };

        } catch (error) {
            next(error);
        };
});

// EXPORTING the route handler.
module.exports = router;