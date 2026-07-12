const express = require('express')
const { protect, authorizeRoles } = require('../middleware/authMiddleware')
const {
  listStaff,
  getStaffHandler,
  createStaffHandler,
  updateStaffHandler,
  toggleActiveHandler,
  deleteStaffHandler,
  updateProfileHandler,
} = require('../controllers/staffController')

const router = express.Router()

router.use(protect)

// Own profile — must be registered before /:id to avoid route conflict
router.put('/profile', updateProfileHandler)

// Admin-only management routes
router.get('/', authorizeRoles('admin'), listStaff)
router.post('/', authorizeRoles('admin'), createStaffHandler)
router.get('/:id', authorizeRoles('admin'), getStaffHandler)
router.put('/:id', authorizeRoles('admin'), updateStaffHandler)
router.patch('/:id/toggle-active', authorizeRoles('admin'), toggleActiveHandler)
router.delete('/:id', authorizeRoles('admin'), deleteStaffHandler)

module.exports = router
