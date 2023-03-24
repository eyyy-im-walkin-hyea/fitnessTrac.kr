const client = require('./client');

// database functions
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
  }
}

async function getAllActivities() {
  // select and return an array of all activities
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
  }
}

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
    }
    return activity;
  } catch (error) {
    throw error;
  }
}

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
    }
    return activity;
  } catch (error) {
    throw error;
  }

}



const updateActivity = async ({ id, name, description }) => {
  try {
      const { rows: [activity] } = await client.query(`
          UPDATE activities
          SET name=$1, description=$2
          WHERE id=$3
          RETURNING *;
      `, [name, description, id]);

      return activity;
  }
  catch (error) {
      throw error
  }
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  createActivity,
  updateActivity,
};