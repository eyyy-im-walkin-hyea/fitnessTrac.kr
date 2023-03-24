const express = require('express');
const routineActivitiesRouter = express.Router();
const { updateRoutineActivity, getRoutineActivityById, getRoutineById, destroyRoutineActivity } = require("../db");
const { requireUser } = require("./utils");

// PATCH /api/routine_activities/:routineActivityId
routineActivitiesRouter.patch('/:routineActivityId', requireUser, async (req, res, next) => {
    const { routineActivityId } = req.params;
    const { count, duration } = req.body;
    const routineActivity = await getRoutineActivityById(routineActivityId);
    const { routineId } = routineActivity;
    const updateFields = {};
    if (count) {
        updateFields.count = count;
    }

    if (duration) {
        updateFields.duration = duration;
    }

    try {
        const originalRoutine = await getRoutineById(routineId);

        if (originalRoutine.creatorId === req.user.id) {
            const updatedRoutine= await updateRoutineActivity(routineActivityId, updateFields);
            res.send({ routine_activity: updatedRoutine })
        } else {
            res.send({
                name: 'UnauthorizedUserError',
                message: 'You cannot update a routine that is not yours'
            })
        }
    } catch ({ name, message }) {
        next({ name, message });
    }


})
// DELETE /api/routine_activities/:routineActivityId
routineActivitiesRouter.delete('/:routineActivityId', requireUser, async (req, res, next) => {
    const {routineActivityId} = req.params;
    const routineActivity = await getRoutineActivityById(routineActivityId);
    try {
        const routine = await getRoutineById(routineActivity.routineId);
        if (routine.creatorId === req.user.id) {
            const deletedRoutineActivity = await destroyRoutineActivity(routineActivityId)
            res.send(deletedRoutineActivity);
        } else {
            res.send(error);
        }
    }
    catch (error) {
        next(error);
    }
});

module.exports = routineActivitiesRouter;