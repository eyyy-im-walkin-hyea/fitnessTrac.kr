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
            next({
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
    const { routineActivityId } = req.params;
    const routineActivity = await getRoutineActivityById(routineActivityId);

    try {
        const routine = await getRoutineById(req.params.postId);

        if (post && post.creatorId === req.user.id) {
            const updatedPost = await updatePost(post.id, { active: false });

            res.send({ post: updatedPost });
        } else {
            // if there was a post, throw UnauthorizedUserError, otherwise throw PostNotFoundError
            next(post ? {
                name: "UnauthorizedUserError",
                message: "You cannot delete a post which is not yours"
            } : {
                name: "PostNotFoundError",
                message: "That post does not exist"
            });
        }

    } catch ({ name, message }) {
        next({ name, message })
    }
});

module.exports = routineActivitiesRouter;