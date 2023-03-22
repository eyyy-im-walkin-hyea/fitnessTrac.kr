const client = require("./client");
const bcrypt = require('bcrypt');

// database functions

// user functions
async function createUser({ username, password }) {
  try {
    const saltCount = 12;
    const hashedPassword = await bcrypt.hash(password, saltCount);

    const { rows } = await client.query(`
        INSERT INTO users(username, password)
        VALUES($1, $2)
        ON CONFLICT (username) DO NOTHING
        RETURNING *
        `, [username, hashedPassword]);

    return rows;
  } catch (error) {
    throw error;
  }
}

async function getUser({ username, password }) { 
  try {
    const { rows } = await client.query(`
      SELECT id, username, password
      FROM users
      WHERE username = $1;
    `, [username]);

    if (rows.length === 0) {
      throw new Error('User not found');
    }

    const user = rows[0];
    const hashedPassword = user.password;

    const isValid = await bcrypt.compare(password, hashedPassword);
    if (!isValid) {
      throw new Error('Invalid password');
    }

    return user;
  } catch (error) {
    throw error;
  }
}


async function getUserById(userId) {
  try {
    const { rows: [user] } = await client.query(`
      SELECT id, username
      FROM users
      WHERE id=${userId}
  `);

    if (!user) {
      return null
    }

    return user;
  } catch (error) {
    throw error;
  }
}
async function getUserByUsername(username) {
  try {
    const { rows: [user] } = await client.query(`
        SELECT *
        FROM users
        WHERE username=$1;
    `, [username]);

    return user;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}