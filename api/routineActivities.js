const express = require('express');
const routineActivitiesRouter = express.Router();
const { updateRoutineActivity, getRoutineActivityById, getRoutineById, destroyRoutineActivity } = require("../db");
const jwt = require("jsonwebtoken");

// PATCH /api/routine_activities/:routineActivityId
// routineActivitiesRouter.patch('/:routineActivityId', async (req, res, next) => {
//     const { routineActivityId } = req.params;
//     const { duration, count } = req.body;
//     // const routineActivity = await getRoutineActivityById(routineActivityId);
//     // const { routineId } = routineActivity;
//     const updateFields = {};
//     console.log("Req params:", req.params)
//     console.log("Req body", req.body)
//     // console.log("Routine activity", routineActivity)
//     // console.log("Routine id", routineId)

//     if (duration) {
//         updateFields.duration = duration;
//     }

//     if (count) {
//         updateFields.count = count;
//     }

//     try {
//         const originalRoutine = await getRoutineById(routineId);
//         console.log("Org routine", originalRoutine);
//         const userToken = req.headers.authorization.split(" ")[1];
//         console.log("User token", userToken)
//         const decryptedUserToken = jwt.verify(userToken, process.env.JWT_SECRET);
//         console.log("Decrypt token", decryptedUserToken.id)
//         console.log("Routine create ID", originalRoutine.creatorId);
//         if (originalRoutine && originalRoutine.creatorId == decryptedUserToken.id) {
//             const updatedRoutine = await updateRoutineActivity(routineActivityId, updateFields);
//             console.log("Updated Routine:", updatedRoutine)
//             res.send({ routine_activity: updatedRoutine })
//         } else {
//             res.send({
//                 name: 'UnauthorizedUserError',
//                 message: 'You cannot update a routine that is not yours'
//             })
//         }
//     } catch ({ name, message }) {
//         next({ name, message });
//     }


// });

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
            console.log(updatedRoutineActivity)
            res.send(updatedRoutineActivity);
        } else {
            res.send(error);
        }

    }
    catch (error) {
        next(error);
    }
});




// DELETE /api/routine_activities/:routineActivityId
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
        }
    }
    catch (error) {
        next(error);
    }
});

module.exports = routineActivitiesRouter;