// IMPORTING the client.
const client = require("./client");

// ROUTINE FUNCTIONS

// Create a routine.
async function createRoutine({ creatorId, isPublic, name, goal }) {
    try {
        const { rows } = await client.query(`
            INSERT INTO routines("creatorId", "isPublic", name, goal)
            VALUES($1, $2, $3, $4)
            ON CONFLICT (name) DO NOTHING
            RETURNING *;
            `, [creatorId, isPublic, name, goal]);    
        return rows[0];
    } catch (error) {
        throw error;
    };
};


// Get a routine by provided id.
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
        throw error;
    };
};


// Get routines without activities.
async function getRoutinesWithoutActivities() {
    try{
        const { rows } = await client.query(`
            SELECT *
            FROM routines;
        `);

        return rows;
    } catch (error) {
        throw error;
    };
};

// adds the activities to the routines route
async function attachActivitiesToRoutines(routines) {
    try {
        console.log(routines)
        const {rows} = await client.query(`
            SELECT * from activities
            JOIN "routine_activities"
            ON activities.id = "routine_activities"."activityId";
        `);
        console.log("This is routines in attachActivitiesToRoutines function");
        console.log(routines)
        for(let i=0; i<routines.length; i++){
            let answer = rows.filter((singleActivity)=>{
                if(singleActivity.routineId == routines[i].id){
                    return true;
                }else{
                    return false;
                }
            })
            routines[i].activities = answer;
        }
        return routines;
    } catch (error) {
        console.log(error);
    }
};

// Get routines with activities.
async function getAllRoutines() {

    try {
        const{rows} = await client.query(`
            SELECT * 
            FROM routines; 
        `);
        let allroutines = await attachActivitiesToRoutines(rows);
        return allroutines;
    } catch (error) {
        console.log(error);
    }
};


// Get all public routines.
async function getAllPublicRoutines() {
    try {
        console.log("Start of the getAllPublicRoutines DB function");
        const{rows} = await client.query(`
            SELECT * 
            FROM routines 
            WHERE "isPublic"=true;
        `);

        let allRoutines = await attachActivitiesToRoutines(rows);
        return allRoutines;  
        // return rows;
    } catch (error) {
        console.log(error);
    }
};


// Get all routines by a provided user id.
async function getAllRoutinesByUser(userId) {
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
    };
};


// Get public routines by user id.
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
        throw error;
    };
};


// Get public routines by activity.
async function getPublicRoutinesByActivity(activityId) {
    try {
        const { rows: routineIds } = await client.query(`
            SELECT routines.id
            FROM routines
            JOIN routine_activities ON routines.id=routine_activities."routineId"
            JOIN activities ON activities.id=routine_activities."activityId"
            WHERE activities.id=$1
            AND "isPublic"=$2;
            `, [activityId, "true"]);

        return await Promise.all(routineIds.map(
                routine => getRoutineById(routine.id)
        ));
    } catch(error) {
        throw error;
    };
};


// Update a specified routine.
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
        throw error;
    };
};


// Delete a routine by provided routine id.
async function destroyRoutine(id) {
    try {
        await client.query(`
            DELETE FROM routines
            WHERE id=$1;
        `, [id]);
        
        return `DELETED ROUTINE NUMBER: ${id}`
    } catch(error) {
        throw error;
    };
};

// EXPORTING routines functions.
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