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



// async function updateActivity ({ id, name, description }) {
//   try {
//       const { rows: [activity] } = await client.query(`
//           UPDATE activities
//           SET name=$2, description=$3
//           WHERE id=$1
//           RETURNING *;
//       `, [id, name, description]);

//       return activity;
//   }
//   catch (error) {
//       throw error
//   }
// }

async function updateActivity(id, fields = {}) {
  const setString = Object.keys(fields).map(
      (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(', ');

  if(setString.length === 0) {
      return;
  }

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
  }
};

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  createActivity,
  updateActivity,
};