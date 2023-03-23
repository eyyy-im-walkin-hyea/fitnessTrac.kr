const express = require('express');
const routinesRouter = express.Router();
const { requireUser } = require('./utils');
const {
    createRoutine,
    getRoutineById,
    getRoutinesWithoutActivities,
    getAllRoutines,
    getAllPublicRoutines,
    getAllRoutinesByUser,
    getPublicRoutinesByUser,
    getPublicRoutinesByActivity,
    updateRoutine,
    destroyRoutine
} = require("../db");


// USE
routinesRouter.use((req, res, next) => {
    console.log("Request made to /routines");
    next(); 
});


// GET /api/routines
routinesRouter.get("/", async (req, res) => {
    try {
        const allPubRoutines = await getAllPublicRoutines();
        res.send(allPubRoutines);
    } catch (error) {
        console.log(error, "Error w/ apiRoutines");
    }
})


// POST /api/routines
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

// PATCH /api/routines/:routineId
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
routinesRouter.delete('/routineId', requireUser, async (req, res, next) => {
    try {
        const routine = await getRoutineById(req.params.routineId);

        if(routine) {
            res.send({routine});
        } else {
            next({
            name: 'Error',
            message: 'Error deleting routine'
            })
        }
    } catch({name, message}) {
        next({name, message})
        }
    });



module.exports = routinesRouter;