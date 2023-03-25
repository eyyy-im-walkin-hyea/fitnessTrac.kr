// IMPORTING the client
const client = require('./client');

// ACTIVITIES FUNCTIONS

// Create an activity.
async function createActivity({ name, description }) {
  try {
    const { rows: [activity] } = await client.query(`
    INSERT INTO activities(name, description) 
    VALUES ($1, $2)
    RETURNING *;
    `, [name, description]);

    return activity;
  } catch (error) {
    throw error;
  };
};

// Return all activities.
async function getAllActivities() {
  try {
    const { rows: activityIds } = await client.query(`
    SELECT id
    FROM activities;
    `);

    const activities = await Promise.all(activityIds.map(
      activity => getActivityById(activity.id)
    ));

    return activities;
  } catch (error) {
    throw error;
  };
};

// Return a specified activity.
async function getActivityById(id) {
  try {
    const { rows: [activity] } = await client.query(`
    SELECT *
    FROM activities
    WHERE id=$1;
    `, [id]);

    if (!activity) {
      throw {
        name: "ActivityNotFoundError",
        message: "Could not find an activity with that id!"
      };
    };
    return activity;
  } catch (error) {
    throw error;
  };
};

// Return an activity by name.
async function getActivityByName(name) {
  try {
    const { rows: [activity] } = await client.query(`
    SELECT *
    FROM activities
    WHERE name=$1;
    `, [name]);

    if (!activity) {
      throw {
        name: "ActivityNotFoundError",
        message: "Could not find an activity with that name!"
      };
    };
    return activity;
  } catch (error) {
    throw error;
  };
};

// Update a provided activity.
async function updateActivity(id, fields = {}) {
  const setString = Object.keys(fields).map(
      (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(', ');

  if(setString.length === 0) {
      return;
  };

  try {
      const {rows: [activity] } = await client.query(`
          UPDATE activities
          SET ${setString}
          WHERE id=${id}
          RETURNING *;
      `, Object.values(fields));

      return activity;
  } catch (error) {
      console.log("Error w/ updateRoutine");
      throw error;
  };
};

// EXPORTING all activity functions. 
module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  createActivity,
  updateActivity,
};