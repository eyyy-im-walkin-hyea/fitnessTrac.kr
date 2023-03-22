const client = require("./client");


async function createRoutine({ creatorId, isPublic, name, goal }) {
    try {
        const { rows } = await client.query(`
            INSERT INTO routines("creatorId", "isPublic", name, goal)
            VALUES($1, $2, $3, $4)
            RETURNING *
            `, [creatorId, isPublic, name, goal]);    
        return rows;
      } catch (error) {
        throw error;
      }
}


async function getRoutineById(id) {
    try {
        const { rows: [ routines ] } = await client.query(`
            SELECT *
            FROM routines
            WHERE id=${ id }
        `);
  
        if (!routines) {
            throw {
                name: "RoutineNotFoundError",
                message: "Could not find a routine with that id"
            }
        }
        return routines;
    } catch (error) {
        console.log("Error w/ getRoutineById");
        throw error;
    }
}


async function getRoutinesWithoutActivities() {}


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
        if (routines.isPublic == true) {
            const { rows } = await client.query(`
                SELECT *
                FROM routines;
        `);

        return rows;
        }
    } catch (error) {
        console.log("Error w/ getAllPublicRoutines");
        throw error;
    }
}


async function getAllRoutinesByUser({ username }) {}


async function getPublicRoutinesByUser({ username }) {}

async function getPublicRoutinesByActivity({ id }) {}

async function updateRoutine({ id, ...fields }) {}

async function destroyRoutine(id) {}

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