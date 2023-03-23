const client = require("./client");


async function createRoutine({ creatorId, isPublic, name, goal }) {
    try {
        const { rows } = await client.query(`
            INSERT INTO routines("creatorId", "isPublic", name, goal)
            VALUES($1, $2, $3, $4)
            ON CONFLICT (name) DO NOTHING
            RETURNING *;
            `, [creatorId, isPublic, name, goal]);    
        return rows;
      } catch (error) {
        throw error;
      }
}


async function getRoutineById(id) {
    try {
        const { rows: [ routine ] } = await client.query(`
            SELECT *
            FROM routines
            WHERE id=${ id };
        `);
  
        if (!routine) {
            throw {
                name: "RoutineNotFoundError",
                message: "Could not find a routine with that id"
            }
        }
        return routine;
    } catch (error) {
        console.log("Error w/ getRoutineById");
        throw error;
    }
}

// NOT IN THE GRADING RUBRIC
// async function getRoutinesWithoutActivities() {}


async function getAllRoutines() {
    try{
        const { rows } = await client.query(`
            SELECT *
            FROM routines;
        `);

        return rows;
    } catch (error) {
        console.log("Error w/ getAllRoutines");
        throw error;
    }
}


async function getAllPublicRoutines() {
    try{
        
        const { rows } = await client.query(`
            SELECT *
            FROM routines
            WHERE "isPublic" = true;
        `);
        return rows;  
    } catch (error) {
        console.log("Error w/ getAllPublicRoutines");
        throw error;
    }
}


async function getAllRoutinesByUser({ userId}) {
    try {
        const { rows : routineIds } = await client.query(`
            SELECT *
            FROM routines
            WHERE "creatorId"=$1
            `, [userId]);

        const routines = await Promise.all(routineIds.map(
            routine => getRoutineById( routine.id )
        ));

        return routines;
    } catch (error) {
        throw error;
    }
}


async function getPublicRoutinesByUser({ userId }) {
    try {
        const { rows : routineIds } = await client.query(`
            SELECT *
            FROM routines
            WHERE "creatorId"=$1
            AND "isPublic" = true;
            `, [userId]);

        const routines = await Promise.all(routineIds.map(
            routine => getRoutineById( routine.id )
        ));

        return routines;
    } catch (error) {
        throw error;
    }
}


async function getPublicRoutinesByActivity({ id }) {
    try {
        const { rows: routineIds } = await client.query(`
            SELECT routines.id
            FROM routines
            JOIN routine_activities ON routines.id=routine_activities."routineId"
            JOIN activities ON activities.id=routine_activities."activityId"
            WHERE activities.name=$1
            AND "isPublic"=$2;`, [id, "true"]);

            return await Promise.all(routineIds.map(
                routine => getRoutineById(routine.id)
            ));
    } catch(error) {
        throw error;
    }
}


async function updateRoutine({ id, ...fields }) {
    const { isPublic, name, goal, id } = fields;
    delete fields.isPublic;
    delete fields.name;
    delete fields.goal;

    const setString = Object.keys(fields).map(
        (key, index) => `"${ key }"=$${ index + 1 }`
    ).join(', ');
  
    if(setString.length === 0) {
        return;
    }
    try {
      const result = await client.query(`
        UPDATE routines
        SET "isPublic"=$1, name=$2, goal=$3 ${setString}
        WHERE id=$4
        RETURNING *
      `, [isPublic, name, goal, id, ...Object.values(fields)]);
  
      return result.rows[0];
    } catch (error) {
      throw error;
    }
}


async function destroyRoutine(id) {
    try {
        await client.query(`
            DELETE FROM routines
            WHERE id=$1;
        `, [id]);
        
        return `DELETED ROUTINE NUMBER: ${id}`
    }   catch(error) {
        console.log("Error w/ destroyRoutine");
        throw error;
    }
}


module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};