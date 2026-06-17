const db = require('../config/db')

async function findStaffByEmail(email) {
  const result = await db.query(
    `SELECT id, full_name, email, password_hash, role, is_active, created_at, updated_at, last_login_at
     FROM staff_accounts
     WHERE lower(email) = lower($1)
     LIMIT 1`,
    [email],
  )

  return result.rows[0] || null
}

async function findStaffById(id) {
  const result = await db.query(
    `SELECT id, full_name, email, role, is_active, created_at, updated_at, last_login_at
     FROM staff_accounts
     WHERE id = $1
     LIMIT 1`,
    [id],
  )

  return result.rows[0] || null
}

async function createStaff({ fullName, email, passwordHash, role }) {
  const result = await db.query(
    `INSERT INTO staff_accounts (full_name, email, password_hash, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, full_name, email, role, is_active, created_at, updated_at, last_login_at`,
    [fullName, email, passwordHash, role],
  )

  return result.rows[0]
}

async function updateLastLoginAt(id) {
  await db.query(
    `UPDATE staff_accounts
     SET last_login_at = NOW(), updated_at = NOW()
     WHERE id = $1`,
    [id],
  )
}

module.exports = {
  findStaffByEmail,
  findStaffById,
  createStaff,
  updateLastLoginAt,
}