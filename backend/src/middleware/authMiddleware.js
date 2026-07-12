const jwt = require('jsonwebtoken')
const db = require('../config/db')

function extractToken(req) {
  const header = req.headers.authorization || ''

  if (header.startsWith('Bearer ')) {
    return header.slice(7)
  }

  return null
}

async function protect(req, res, next) {
  try {
    const token = extractToken(req)

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, token missing' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const result = await db.query(
      `SELECT id, full_name, email, phone, role, is_active, created_at, updated_at
       FROM users
       WHERE id = $1`,
      [decoded.id],
    )

    if (result.rowCount === 0 || !result.rows[0].is_active) {
      return res.status(401).json({ message: 'Not authorized, account disabled' })
    }

    req.user = result.rows[0]
    return next()
  } catch (error) {
    const message =
      error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError'
        ? 'Not authorized, token failed'
        : 'Authentication failed'

    return res.status(401).json({ message })
  }
}

function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' })
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' })
    }

    return next()
  }
}

module.exports = { protect, authorizeRoles }