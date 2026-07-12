const express = require('express')
const { protect, authorizeRoles } = require('../middleware/authMiddleware')
const {
  listMenuItems,
  getMenuItemHandler,
  createMenuItemHandler,
  updateMenuItemHandler,
  toggleAvailabilityHandler,
  uploadImageHandler,
  deleteMenuItemHandler,
} = require('../controllers/menuController')

const router = express.Router()

router.use(protect)

router.get('/', listMenuItems)
router.get('/:id', getMenuItemHandler)

router.post('/', authorizeRoles('admin'), createMenuItemHandler)
router.put('/:id', authorizeRoles('admin'), updateMenuItemHandler)
router.patch('/:id/availability', authorizeRoles('admin'), toggleAvailabilityHandler)
router.post('/:id/image', authorizeRoles('admin'), uploadImageHandler)
router.delete('/:id', authorizeRoles('admin'), deleteMenuItemHandler)

module.exports = router
