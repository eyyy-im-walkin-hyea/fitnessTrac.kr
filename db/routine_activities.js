// IMPORTING the client.
const client = require("./client");

// ROUTINE_ACTIVITIES FUNCTIONS

// Adding a new activity to a routine.
async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration
}) {
  try {
    const { rows: [routine_activity] } = await client.query(`
    INSERT INTO routine_activities("routineId", "activityId", count, duration)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
`, [routineId, activityId, count, duration]);
    return routine_activity;
  } catch (error) {
    throw error;
  };
};

// Returning a specified routine_activity.
async function getRoutineActivityById(id) {
  try {
    const { rows: [routine_activity] } = await client.query(`
    SELECT *
    FROM routine_activities
    WHERE id=$1;
`, [id]);

    if (!routine_activity) {
      throw {
        name: "RoutineNotFoundError",
        message: "Could not find a routine with that id!"
      };
    };
    return routine_activity;
  } catch (error) {
    throw error;
  };
};

// Return all routine_activities from a specified routine.
async function getRoutineActivitiesByRoutine({ id }) {
  try {
    const { rows: routine_activities } = await client.query(`
      SELECT *
      FROM routine_activities
      WHERE "routineId"=$1;
    `, [id]);

    if (!routine_activities || routine_activities.length === 0) {
      throw {
        name: "RoutineNotFoundError",
        message: "Could not find any routine activities for the specified routine!"
      };
    };

    return routine_activities;
  } catch (error) {
    throw error;
  };
};

// Updating a routine_activity.
async function updateRoutineActivity({ id, duration, count }) {
  try {
    const { rows: [routine_activity] } = await client.query(`
        UPDATE routine_activities
        SET duration=$1, count=$2
        WHERE id=${id}
        RETURNING *;
    `, [duration, count]);

    return routine_activity;
  }
  catch (error) {
    throw error;
  };
};


// Remove routine_activity from the database.
async function destroyRoutineActivity(id) {
  try {
    const { rows: [routine_activity] } = await client.query(`
    DELETE FROM routine_activities
    WHERE id = $1
    RETURNING *;
    `, [id]);
    return routine_activity;
  } catch (error) {
    throw error
  };
};

// EXPORTING routine_activity functions.
module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
};