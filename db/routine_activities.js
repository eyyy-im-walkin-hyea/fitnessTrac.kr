const client = require("./client");

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
    ON CONFLICT ("routineId", "activityId", count, duration) DO NOTHING;
`, [routineId, activityId, count, duration]);
    return routine_activity;
  } catch (error) {
    throw error;
  }
}

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
    }
    return routine_activity;
  } catch (error) {
    throw error;
  }
}

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
    }

    return routine_activities;
  } catch (error) {
    throw error;
  }
}


async function updateRoutineActivity({ id, count, duration }) {
  try {
    const { rows: [routine_activity] } = await client.query(`
        UPDATE routine_activities
        SET count=$1, duration=$2
        WHERE id=${id}
        RETURNING *;
    `, [count, duration]);

    return routine_activity;
  }
  catch (error) {
    throw error;
  }
}

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
  }
}

async function canEditRoutineActivity(routineActivityId, userId) { }

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};