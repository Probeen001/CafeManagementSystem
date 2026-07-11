const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const { signJwt } = require('../config/jwt')
const db = require('../config/db')
const {
  findStaffByEmail,
  findStaffById,
  createStaff,
  updateLastLoginAt,
  savePasswordResetToken,
  findStaffByResetToken,
  clearPasswordResetToken,
} = require('../models/staffModel')
const { sendPasswordResetEmail } = require('../services/emailService')

// Password must be ≥8 chars with upper, lower, digit, and special character.
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+[\]{};':"\\|,.<>/?]).{8,}$/

function hashToken(rawToken) {
  return crypto.createHash('sha256').update(rawToken).digest('hex')
}

function sanitizeStaff(staff) {
  if (!staff) return null
  return {
    id:         staff.id,
    full_name:  staff.full_name,
    email:      staff.email,
    phone:      staff.phone,
    role:       staff.role,
    is_active:  staff.is_active,
    created_at: staff.created_at,
    updated_at: staff.updated_at,
  }
}

async function registerStaff(req, res, next) {
  try {
    const { fullName, email, password, phone, role } = req.body

    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: 'Full name, email, and password are required',
      })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const normalizedRole = role === 'admin' ? 'admin' : 'staff'

    const existingStaff = await findStaffByEmail(normalizedEmail)
    if (existingStaff) {
      return res.status(409).json({ message: 'Email is already registered' })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const staff = await createStaff({
      fullName: fullName.trim(),
      email: normalizedEmail,
      passwordHash,
      phone: phone?.trim(),
      role: normalizedRole,
    })

    const token = signJwt({ id: staff.id, role: staff.role })

    return res.status(201).json({
      message: 'Staff registered successfully',
      token,
      staff: sanitizeStaff(staff),
    })
  } catch (error) {
    return next(error)
  }
}

async function loginStaff(req, res, next) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const staff = await findStaffByEmail(email.trim().toLowerCase())
    if (!staff || !staff.is_active) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const passwordMatches = await bcrypt.compare(password, staff.password_hash)
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    await updateLastLoginAt(staff.id)

    const freshStaff = await findStaffById(staff.id)
    const token = signJwt({ id: staff.id, role: staff.role })

    return res.json({
      message: 'Login successful',
      token,
      staff: sanitizeStaff(freshStaff),
    })
  } catch (error) {
    return next(error)
  }
}

function logoutStaff(req, res) {
  return res.json({ message: 'Logout successful' })
}

function getCurrentStaff(req, res) {
  return res.json({
    staff: sanitizeStaff(req.user),
  })
}

async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'currentPassword and newPassword are required' })
    }

    const result = await db.query(
      `SELECT id, password_hash FROM users WHERE id = $1`,
      [req.user.id],
    )
    const user = result.rows[0]
    if (!user) return res.status(404).json({ message: 'User not found' })

    const matches = await bcrypt.compare(currentPassword, user.password_hash)
    if (!matches) {
      return res.status(400).json({ message: 'Current password is incorrect' })
    }

    const newHash = await bcrypt.hash(newPassword, 12)
    await db.query(
      `UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2`,
      [newHash, req.user.id],
    )

    return res.json({ message: 'Password changed successfully' })
  } catch (error) {
    return next(error)
  }
}

// ─── Forgot Password ─────────────────────────────────────────────────────────

async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body
    if (!email) {
      return res.status(400).json({ message: 'Email address is required.' })
    }

    // Generic response prevents email enumeration attacks.
    const GENERIC_OK = {
      message: 'If that email is registered with CafeX, you will receive a reset link shortly.',
    }

    const normalizedEmail = email.trim().toLowerCase()
    const staff = await findStaffByEmail(normalizedEmail)

    // Silently return success if email not found or account inactive.
    if (!staff || !staff.is_active) {
      return res.json(GENERIC_OK)
    }

    // Generate a cryptographically secure random token (64 hex chars = 256-bit entropy).
    const rawToken  = crypto.randomBytes(32).toString('hex')
    const tokenHash = hashToken(rawToken)
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

    await savePasswordResetToken(staff.id, tokenHash, expiresAt)

    const clientUrl = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '')
    const resetUrl  = `${clientUrl}/auth/reset-password/${rawToken}`

    try {
      await sendPasswordResetEmail(staff.email, staff.full_name, resetUrl)
    } catch (emailErr) {
      // Roll back the token so the user can try again.
      await clearPasswordResetToken(staff.id)
      console.error('[forgotPassword] email send failed:', emailErr.message)
      return next(new Error('Could not send reset email. Please try again later.'))
    }

    return res.json(GENERIC_OK)
  } catch (error) {
    return next(error)
  }
}

// ─── Reset Password ───────────────────────────────────────────────────────────

async function resetPassword(req, res, next) {
  try {
    const { token } = req.params
    const { newPassword, confirmPassword } = req.body

    // ── Validate inputs ──
    if (!token) {
      return res.status(400).json({ message: 'Reset token is missing.' })
    }
    if (!newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'New password and confirmation are required.' })
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' })
    }
    if (!PASSWORD_REGEX.test(newPassword)) {
      return res.status(400).json({
        message:
          'Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a special character.',
      })
    }

    // ── Verify token ──
    const tokenHash = hashToken(token)
    const staff = await findStaffByResetToken(tokenHash)
    if (!staff) {
      return res.status(400).json({
        message: 'This reset link is invalid or has expired. Please request a new one.',
      })
    }

    // ── Update password & invalidate token (atomic-ish via two queries) ──
    const passwordHash = await bcrypt.hash(newPassword, 12)
    await db.query(
      `UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2`,
      [passwordHash, staff.id],
    )
    await clearPasswordResetToken(staff.id)

    return res.json({ message: 'Password reset successful. You can now log in with your new password.' })
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  registerStaff,
  loginStaff,
  logoutStaff,
  getCurrentStaff,
  changePassword,
  forgotPassword,
  resetPassword,
}