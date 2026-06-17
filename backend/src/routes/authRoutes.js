const express = require('express')

const {
  registerStaff,
  loginStaff,
  logoutStaff,
  getCurrentStaff,
} = require('../controllers/authController')
const { protect, authorizeRoles } = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/register', protect, authorizeRoles('admin'), registerStaff)
router.post('/login', loginStaff)
router.post('/logout', protect, logoutStaff)
router.get('/me', protect, getCurrentStaff)

module.exports = router