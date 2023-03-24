// const client = require("./client");
const { Client } = require('pg');
const client = new Client('postgres://localhost:5432/fitness-dev');


// CREATE A ROUTINE
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
        console.log("Error w/ createRoutine");
        throw error;
    }
}


// GET A ROUTINE BY ID
async function getRoutineById(routineId) {
    try {
        const { rows: [ routine ] } = await client.query(`
            SELECT *
            FROM routines
            WHERE id=$1;
        `, [routineId]);
  
        if (!routine) {
            throw {
                name: "RoutineNotFoundError",
                message: "Routine with that routineId not found"
            }
        };
        const { rows: [activities] } = await client.query(`
            SELECT *
            FROM activities
            JOIN routine_activities ON activities.id=routine_activities."activityId"
            WHERE routine_activities."routineId"=$1;
        `, [routineId]);

        routine.activities = activities;
        return routine;
    } catch (error) {
        console.log("Error w/ getRoutineById");
        throw error;
    }
}


// GET ALL ROUTINES W/O ACTIVITIES
async function getRoutinesWithoutActivities() {
    try{
        const { rows } = await client.query(`
            SELECT *
            FROM routines;
        `);

        return rows;
    } catch (error) {
        console.log("Error w/ getAllRoutinesWithoutActivities");
        throw error;
    }
}


// GET ALL ROUTINES W/ ACTIVITIES
async function getAllRoutines() {
    try {
        const { rows: [ routine ] } = await client.query(`
            SELECT *
            FROM routines
        `,);
  
        const { rows: [ activities ] } = await client.query(`
            SELECT *
            FROM activities
            JOIN routine_activities ON activities.id=routine_activities."activityId"
            WHERE routine_activities."routineId"=$1;
        `, [routineId]);

        routine.activities = activities;
        return routine;
    } catch (error) {
        console.log("Error w/ getAllRoutines");
        throw error;
    }
}


// GET ALL PUBLIC ROUTINES
async function getAllPublicRoutines() {
    try{
        
        const { rows } = await client.query(`
            SELECT *
            FROM routines
            WHERE "isPublic"=$1;
        `, ["true"]);
        return rows;  
    } catch (error) {
        console.log("Error w/ getAllPublicRoutines");
        throw error;
    }
}


// GET ALL ROUTINES BY USER ID
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
        console.log("Error w/ getAllRoutinesByUser");
        throw error;
    }
}


// GET PUBLIC ROUTINES BY USER ID
async function getPublicRoutinesByUser(userId) {
    try {
        const { rows : routineIds } = await client.query(`
            SELECT *
            FROM routines
            WHERE "creatorId"=${userId}
            AND "isPublic"=$1;
            `, ["true"]);

        const routines = await Promise.all(routineIds.map(
            routine => getRoutineById( routine.id )
        ));

        return routines;
    } catch (error) {
        console.log("Error w/ getPublicRoutinesByUser");
        throw error;
    }
}


// GET PUBLIC ROUTINES BY ACTIVITY
async function getPublicRoutinesByActivity(activityId) {
    try {
        const { rows: routineIds } = await client.query(`
            SELECT routines.id
            FROM routines
            JOIN routine_activities ON routines.id=routine_activities."routineId"
            JOIN activities ON activities.id=routine_activities."activityId"
            WHERE activities.name=$1
            AND "isPublic"=$2;
            `, [activityId, "true"]);

        return await Promise.all(routineIds.map(
                routine => getRoutineById(routine.id)
        ));
    } catch(error) {
        console.log("Error w/ getPublicRoutinesByActivity");
        throw error;
    }
}


// UPDATE A ROUTINE
async function updateRoutine(id, fields = {}) {
    const setString = Object.keys(fields).map(
        (key, index) => `"${ key }"=$${ index + 1 }`
    ).join(', ');
  
    if(setString.length === 0) {
        return;
    }
  
    try {
        const {rows: [routine] } = await client.query(`
            UPDATE routines
            SET ${setString}
            WHERE id=${id}
            RETURNING *;
        `, Object.values(fields));
  
        return routine;
    } catch (error) {
        console.log("Error w/ updateRoutine");
        throw error;
    }
};


// DELETE A ROUTINE
async function destroyRoutine(id) {
    try {
        await client.query(`
            DELETE FROM routines
            WHERE id=$1;
        `, [id]);
        
        return `DELETED ROUTINE NUMBER: ${id}`
    } catch(error) {
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