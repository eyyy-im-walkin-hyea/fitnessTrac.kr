const express = require('express');
const routinesRouter = express.Router();
const { requireUser } = require('./utils');
const {
    createRoutine,
    getRoutineById,
    getAllPublicRoutines,
    updateRoutine,
    addActivityToRoutine
} = require("../db");


// USE
routinesRouter.use((req, res, next) => {
    console.log("Request made to /routines");
    next(); 
});


// GET /api/routines
// Return a list of public routines, include the activities with them
routinesRouter.get("/", async (req, res) => {
    try {
        const allPubRoutines = await getAllPublicRoutines();
        res.send(allPubRoutines);
    } catch (error) {
        console.log(error, "Error w/ apiRoutines");
    }
});


// POST /api/routines
//Create a new routine
// -----REQUIRES A LOGGED IN USER-----
routinesRouter.post('/', requireUser, async (req, res, next) => {
    const { creatorId, name, goal, public } = req.body;
    const routineData = {creatorId , public, name, goal};
  
    try {
        const routine = await createRoutine(routineData);

        if(routine) {
        res.send({routine});
        } else {
            next({
                name: "routinePostError",
                message: "Error w/ api routinesRouter.post"
            })
        }
    } catch ({ name, message }) {
        next({ name, message });
    }
});


// POST /api/routines/:routineId/activities
// Attach a single activity to a routine. Prevent duplication on (routineId, activityId) pair.
routinesRouter.post("/:routineId/activities", requireUser, async (req, res, next) => {
    const routineId = req.params.routineId;
    const { activityId, count, duration } = req.body;

    try {
        const routine = await getRoutineById(routineId);
        const activityToRoutine = await addActivityToRoutine({ routineId, activityId, count, duration });

        if (routine.creatorId === req.user.id) {
            res.send(activityToRoutine);
        } else {
            next(error);
        }
    }
    catch (error) {
        next(error);
    }
});


// PATCH /api/routines/:routineId
//Update a routine, notably change public/private, the name, or the goal
// -----REQUIRES A LOGGED IN USER THAT IS THE AUTHOR-----
routinesRouter.patch('/:routineId', requireUser, async (req, res, next) => {
const {routineId} = req.params;
const {isPublic, name, goal} = req.body;
const updateFields = {};

    if(isPublic) {
        updateFields.isPublic = isPublic;
    };

    if(name) {
        updateFields.name = name;
    };

    if(goal) {
        updateFields.goal = goal;
    };

    try {
        const originalRoutine = await getRoutineById(routineId);

        if(originalRoutine) {
            const updatedRoutine = await updateRoutine(routineId, updateFields);
            res.send({routine: updatedRoutine});
        } else {
            next({
            name: 'Error', 
            description: 'You cannot update routine'
            })
        }
    } catch({name, message}) {
        next({name, message})
    }
});


// DELETE /api/routines/:routineId
// ard delete a routine. Make sure to delete all the routineActivities whose routine is the one being deleted.
// -----REQUIRES A LOGGED IN USER THAT IS THE AUTHOR-----
routinesRouter.delete('/:routineId', requireUser, async (req, res, next) => {
    const {routineId} = req.params;
    const routine = await getRoutineById(req.params.routineId);
    try {
        if (routine.creatorId === req.user.id) {
            const deletedRoutine = await destroyRoutine(routineId)
            res.send(deletedRoutine);
        } else {
            next(error);
        }
    }
    catch (error) {
        next(error);
    }
});



module.exports = routinesRouter;