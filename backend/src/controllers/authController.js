const bcrypt = require('bcryptjs')
const { signJwt } = require('../config/jwt')
const {
  findStaffByEmail,
  findStaffById,
  createStaff,
  updateLastLoginAt,
} = require('../models/staffModel')

function sanitizeStaff(staff) {
  if (!staff) {
    return null
  }

  return {
    id: staff.id,
    fullName: staff.full_name,
    email: staff.email,
    role: staff.role,
    isActive: staff.is_active,
    createdAt: staff.created_at,
    updatedAt: staff.updated_at,
    lastLoginAt: staff.last_login_at,
  }
}

async function registerStaff(req, res, next) {
  try {
    const { fullName, email, password, role } = req.body

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

module.exports = {
  registerStaff,
  loginStaff,
  logoutStaff,
  getCurrentStaff,
}