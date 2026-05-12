const db = require('../config/database');

const createUser = async (name, email, passwordHash, role) => {
  const [result] = await db.query(
    'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
    [name, email, passwordHash, role || 'pelamar']
  );
  return result.insertId;
};

const getUserByEmail = async (email) => {
  const [rows] = await db.query(
    'SELECT * FROM users WHERE email = ? LIMIT 1',
    [email]
  );
  return rows[0];
};

const getUserById = async (id) => {
  const [rows] = await db.query(
    'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
    [id]
  );
  return rows[0];
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserById
};