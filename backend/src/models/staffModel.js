const db = require('../config/db')

async function findStaffByEmail(email) {
  const result = await db.query(
    `SELECT id, full_name, email, password_hash, phone, role, is_active, created_at, updated_at
     FROM users
     WHERE lower(email) = lower($1)
     LIMIT 1`,
    [email],
  )

  return result.rows[0] || null
}

async function findStaffById(id) {
  const result = await db.query(
    `SELECT id, full_name, email, phone, role, is_active, created_at, updated_at
     FROM users
     WHERE id = $1
     LIMIT 1`,
    [id],
  )

  return result.rows[0] || null
}

async function createStaff({ fullName, email, passwordHash, role, phone }) {
  const result = await db.query(
    `INSERT INTO users (full_name, email, password_hash, phone, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, full_name, email, phone, role, is_active, created_at, updated_at`,
    [fullName, email, passwordHash, phone || null, role],
  )

  return result.rows[0]
}

async function updateLastLoginAt(id) {
  await db.query(
    `UPDATE users
     SET updated_at = NOW()
     WHERE id = $1`,
    [id],
  )
}

async function getAllStaff({ role, isActive, search } = {}) {
  const conditions = []
  const values = []

  if (role) {
    values.push(role)
    conditions.push(`role = $${values.length}`)
  }
  if (isActive !== undefined) {
    values.push(isActive === 'true' || isActive === true)
    conditions.push(`is_active = $${values.length}`)
  }
  if (search) {
    values.push(`%${search}%`)
    const n = values.length
    conditions.push(`(lower(full_name) LIKE lower($${n}) OR lower(email) LIKE lower($${n}))`)
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

  const result = await db.query(
    `SELECT id, full_name, email, phone, role, is_active, created_at, updated_at
     FROM users
     ${where}
     ORDER BY role DESC, full_name`,
    values,
  )
  return result.rows
}

async function updateStaffById(id, { fullName, email, phone, role } = {}) {
  const fieldMap = { fullName: 'full_name', email: 'email', phone: 'phone', role: 'role' }
  const setClauses = []
  const values = []

  for (const [key, col] of Object.entries(fieldMap)) {
    const val = { fullName, email, phone, role }[key]
    if (val !== undefined) {
      values.push(val)
      setClauses.push(`${col} = $${values.length}`)
    }
  }

  if (setClauses.length === 0) return null

  values.push(id)
  const result = await db.query(
    `UPDATE users SET ${setClauses.join(', ')}, updated_at = NOW()
     WHERE id = $${values.length}
     RETURNING id, full_name, email, phone, role, is_active, created_at, updated_at`,
    values,
  )
  return result.rows[0] || null
}

async function toggleStaffActive(id) {
  const result = await db.query(
    `UPDATE users SET is_active = NOT is_active, updated_at = NOW()
     WHERE id = $1
     RETURNING id, full_name, email, phone, role, is_active, created_at, updated_at`,
    [id],
  )
  return result.rows[0] || null
}

async function deleteStaffById(id) {
  const result = await db.query(
    `DELETE FROM users WHERE id = $1 RETURNING id`,
    [id],
  )
  return result.rowCount > 0
}

async function updateStaffPassword(id, passwordHash) {
  await db.query(
    `UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2`,
    [passwordHash, id],
  )
}

// ─── Password reset token helpers ────────────────────────────────────────────

/**
 * Persist a hashed reset token and its expiry for the given user.
 * @param {number} userId
 * @param {string} tokenHash  SHA-256 hex of the raw URL token
 * @param {Date}   expiresAt  Token expiry timestamp (15 min from now)
 */
async function savePasswordResetToken(userId, tokenHash, expiresAt) {
  await db.query(
    `UPDATE users
     SET password_reset_token = $1, password_reset_expires_at = $2, updated_at = NOW()
     WHERE id = $3`,
    [tokenHash, expiresAt, userId],
  )
}

/**
 * Find an active user whose stored (hashed) reset token matches and has not expired.
 * Returns null if the token is invalid, expired, or the account is inactive.
 */
async function findStaffByResetToken(tokenHash) {
  const result = await db.query(
    `SELECT id, full_name, email
     FROM users
     WHERE password_reset_token = $1
       AND password_reset_expires_at > NOW()
       AND is_active = TRUE
     LIMIT 1`,
    [tokenHash],
  )
  return result.rows[0] || null
}

/**
 * Invalidate the reset token after a successful password change.
 */
async function clearPasswordResetToken(userId) {
  await db.query(
    `UPDATE users
     SET password_reset_token = NULL, password_reset_expires_at = NULL, updated_at = NOW()
     WHERE id = $1`,
    [userId],
  )
}

module.exports = {
  findStaffByEmail,
  findStaffById,
  createStaff,
  updateLastLoginAt,
  getAllStaff,
  updateStaffById,
  toggleStaffActive,
  deleteStaffById,
  updateStaffPassword,
  savePasswordResetToken,
  findStaffByResetToken,
  clearPasswordResetToken,
}