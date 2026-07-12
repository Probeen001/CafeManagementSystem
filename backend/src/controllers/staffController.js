const bcrypt = require('bcryptjs')
const {
  getAllStaff,
  findStaffById,
  createStaff,
  updateStaffById,
  toggleStaffActive,
  deleteStaffById,
} = require('../models/staffModel')

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

async function listStaff(req, res, next) {
  try {
    const staff = await getAllStaff(req.query)
    return res.json({ staff: staff.map(sanitizeStaff) })
  } catch (error) {
    return next(error)
  }
}

async function getStaffHandler(req, res, next) {
  try {
    const staff = await findStaffById(Number(req.params.id))
    if (!staff) return res.status(404).json({ message: 'Staff not found' })
    return res.json({ staff: sanitizeStaff(staff) })
  } catch (error) {
    return next(error)
  }
}

async function createStaffHandler(req, res, next) {
  try {
    const { full_name, fullName: fN, email, password, phone, role } = req.body
    const fullName = full_name || fN
    const normalizedPassword = typeof password === 'string' ? password.trim() : ''

    if (!fullName || !email || !normalizedPassword) {
      return res.status(400).json({ message: 'full_name, email, and password are required' })
    }

    const passwordHash = await bcrypt.hash(normalizedPassword, 12)
    const staff = await createStaff({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      phone: phone?.trim(),
      role: role === 'admin' ? 'admin' : 'staff',
    })
    return res.status(201).json({ message: 'Staff created', staff: sanitizeStaff(staff) })
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ message: 'Email is already registered' })
    }
    return next(error)
  }
}

async function updateStaffHandler(req, res, next) {
  try {
    const { full_name, fullName: fN, email, phone, role } = req.body
    const fullName = full_name || fN
    const staff = await updateStaffById(Number(req.params.id), { fullName, email, phone, role })
    if (!staff) return res.status(404).json({ message: 'Staff not found' })
    return res.json({ message: 'Staff updated', staff: sanitizeStaff(staff) })
  } catch (error) {
    return next(error)
  }
}

async function toggleActiveHandler(req, res, next) {
  try {
    const staff = await toggleStaffActive(Number(req.params.id))
    if (!staff) return res.status(404).json({ message: 'Staff not found' })
    return res.json({ message: 'Staff status toggled', staff: sanitizeStaff(staff) })
  } catch (error) {
    return next(error)
  }
}

async function deleteStaffHandler(req, res, next) {
  try {
    const deleted = await deleteStaffById(Number(req.params.id))
    if (!deleted) return res.status(404).json({ message: 'Staff not found' })
    return res.json({ message: 'Staff deleted' })
  } catch (error) {
    return next(error)
  }
}

async function updateProfileHandler(req, res, next) {
  try {
    const { fullName, phone } = req.body
    const staff = await updateStaffById(req.user.id, { fullName, phone })
    if (!staff) return res.status(404).json({ message: 'Staff not found' })
    return res.json({ message: 'Profile updated', staff: sanitizeStaff(staff) })
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  listStaff,
  getStaffHandler,
  createStaffHandler,
  updateStaffHandler,
  toggleActiveHandler,
  deleteStaffHandler,
  updateProfileHandler,
}
