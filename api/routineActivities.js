// IMPORTING necessary modules & database functions.
const express = require('express');
const routineActivitiesRouter = express.Router();
const { updateRoutineActivity, getRoutineActivityById, getRoutineById, destroyRoutineActivity } = require("../db");
const jwt = require("jsonwebtoken");

// PATCH request - Purpose: Update the count, duration, or both on the provided routine activity.
routineActivitiesRouter.patch("/:routineActivityId", async (req, res, next) => {
    const { routineActivityId } = req.params;
    const { count, duration } = req.body;
    const routineActivity = await getRoutineActivityById(routineActivityId);
    const { routineId } = routineActivity;

    try {
        const userToken = req.headers.authorization.split(" ")[1];
        const decryptedUserToken = jwt.verify(userToken, process.env.JWT_SECRET);
        const routine = await getRoutineById(routineId);
        if (routine && decryptedUserToken.id === routine.creatorId) {
            const updatedRoutineActivity = await updateRoutineActivity({ id: routineActivityId, duration, count });
            res.send(updatedRoutineActivity);
        } else {
            res.send(error);
        };

    }
    catch (error) {
        next(error);
    }
});




// DELETE request - Purpose: Remove an activity from a routine, HARD DELETE.
routineActivitiesRouter.delete('/:routineActivityId', async (req, res, next) => {
    const {routineActivityId} = req.params;
    const routineActivity = await getRoutineActivityById(routineActivityId);
    try {
        const userToken = req.headers.authorization.split(" ")[1];
        const decryptedUserToken = jwt.verify(userToken, process.env.JWT_SECRET);
        const routine = await getRoutineById(routineActivity.routineId);
        if (routine.creatorId === decryptedUserToken.id) {
            const deletedRoutineActivity = await destroyRoutineActivity(routineActivityId)
            res.send(deletedRoutineActivity);
        } else {
            res.send(error);
        };
    }
    catch (error) {
        next(error);
    };
});

module.exports = routineActivitiesRouter;