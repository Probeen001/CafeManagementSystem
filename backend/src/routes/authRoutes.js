const express = require('express')

const {
  registerStaff,
  loginStaff,
  logoutStaff,
  getCurrentStaff,
  changePassword,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController')
const { protect, authorizeRoles } = require('../middleware/authMiddleware')

const router = express.Router()

// ── Protected routes ──────────────────────────────────────────────────────────
router.post('/register', protect, authorizeRoles('admin'), registerStaff)
router.post('/logout',   protect, logoutStaff)
router.get('/me',        protect, getCurrentStaff)
router.patch('/password', protect, changePassword)

// ── Public routes ─────────────────────────────────────────────────────────────
router.post('/login',                   loginStaff)
router.post('/forgot-password',         forgotPassword)
router.post('/reset-password/:token',   resetPassword)

module.exports = router