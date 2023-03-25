const express = require('express');
const routinesRouter = express.Router();;
const jwt = require("jsonwebtoken");
const {
    createRoutine,
    getRoutineById,
    getAllPublicRoutines,
    updateRoutine,
    addActivityToRoutine,
    destroyRoutine
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
        next(error, "Error w/ apiRoutines");
    }
});


// POST /api/routines
//Create a new routine
// -----REQUIRES A LOGGED IN USER-----
routinesRouter.post('/',  async (req, res, next) => {
    const { isPublic, name, goal,  } = req.body;
    console.log("Req body:", req.body);
    
    
  
    try {
        const userToken = req.headers.authorization.split(" ")[1];
        const decryptedUserToken = jwt.verify(userToken, process.env.JWT_SECRET);
        
        const routine = await createRoutine({ creatorId: decryptedUserToken.id, isPublic, name, goal});
        console.log(routine)
        console.log(routine.creatorId)
        console.log(decryptedUserToken.id)
        if (routine && routine.creatorId == decryptedUserToken.id ) {
            res.send({routine});
        } else {
            res.send({
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
routinesRouter.post("/:routineId/activities", async (req, res, next) => {
    const routineId = req.params.routineId;
    console.log("Req params:", req.params)
    const { activityId, count, duration } = req.body;
    console.log("Req body:", req.body);

    try {
        const userToken = req.headers.authorization.split(" ")[1];
        const decryptedUserToken = jwt.verify(userToken, process.env.JWT_SECRET);
        const routine = await getRoutineById(routineId);
        const activityToRoutine = await addActivityToRoutine({ routineId, activityId, count, duration });

        if (activityToRoutine) {
            res.send(activityToRoutine);
        } else {
            res.send(error);
        }
    }
    catch (error) {
        next(error);
    }
});


// PATCH /api/routines/:routineId
//Update a routine, notably change public/private, the name, or the goal
// -----REQUIRES A LOGGED IN USER THAT IS THE AUTHOR-----
routinesRouter.patch('/:routineId', async (req, res, next) => {
const {routineId} = req.params;
const {isPublic, name, goal} = req.body;
const updateFields = {};

    updateFields.isPublic = isPublic;

    if(name) {
        updateFields.name = name;
    };

    if(goal) {
        updateFields.goal = goal;
    };

    try {
        const userToken = req.headers.authorization.split(" ")[1];
        const decryptedUserToken = jwt.verify(userToken, process.env.JWT_SECRET);

        const originalRoutine = await getRoutineById(routineId);

        if(originalRoutine && originalRoutine.creatorId == decryptedUserToken.id) {
            const updatedRoutine = await updateRoutine(routineId, updateFields);
            res.send({routine: updatedRoutine});
        } else {
            res.send({
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
routinesRouter.delete('/:routineId',  async (req, res, next) => {
    const {routineId} = req.params;
    const routine = await getRoutineById(req.params.routineId);
    try {
        const userToken = req.headers.authorization.split(" ")[1];
        const decryptedUserToken = jwt.verify(userToken, process.env.JWT_SECRET);
        if (routine.creatorId == decryptedUserToken.id) {
            const deletedRoutine = await destroyRoutine(routineId)
            res.send(deletedRoutine);
        } else {
            res.send({
                name: "Delete Error",
                message: "Error deleting routine, please log in and try again."
            });
        }
    }
    catch (error) {
        next(error);
    }
});



module.exports = routinesRouter;