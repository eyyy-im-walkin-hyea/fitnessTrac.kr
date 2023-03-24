const express = require('express');
const { getAllActivities, getActivityById, createActivity, updateActivity, getPublicRoutinesByActivity } = require('../db');
const router = express.Router();
const { requireUser } = require("./utils");

router.use("/", (req, res, next) => {
    console.log("A request is made to /activities");
    next();
});


// GET /api/activities/:activityId/routines
router.get("/:activityId/routines", async (req, res, next) => {
    console.log("Getting all public routines with activity...");
// Get a list of all public routines which feature that activity
        const { activityId } = req.params;
    try {
        const getActivity = await getPublicRoutinesByActivity(activityId);
        
        res.send({getActivity});
    console.log("Finished getting all public routines with activity.");
    } catch (error) {
        next(error);
    }
});

// GET /api/activities
router.get("/", async (req, res, next) => {
    console.log("Getting all activities...");
// Just return a list of all activities in the database
    try {
        const allActivities = await getAllActivities();
        res.send({allActivities});
    console.log("Finished getting all activities...");
    } catch (error) {
        next(error);
    }

});

// POST /api/activities
router.post("/", requireUser, async (req, res, next) => {
// Create a new activity
    console.log("Creating activity...");
        const { name, description } = req.body;

    try {
        const newActivity = await createActivity({name, description});

        res.send({newActivity});
    console.log("Finished Creating Activity");
    } catch (error) {
        next(error);
    }


});

// PATCH /api/activities/:activityId
router.patch("/:activityId", requireUser, async (req, res, next) => {
// Anyone can update an activity (yes, this could lead to long term problems a la wikipedia)
    console.log("Updating activity...");
        const {activityId} = req.params;
        const {name,description} = req.body;
        const updateFields = {};

        if (name) {
            updateFields.name = name;
        }
        if (description) {
            updateFields.description = description;
        }
        try {
                const oldActivity = await getActivityById(activityId);
            if (oldActivity){
                const updatedActivity = await updateActivity(activityId, updateFields);

                res.send({ activity: updatedActivity});
            }
    console.log("Finished updating activity.");
        } catch (error) {
            next(error);
        }



});

module.exports = router;