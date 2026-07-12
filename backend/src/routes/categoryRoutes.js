const express = require('express')

const { protect, authorizeRoles } = require('../middleware/authMiddleware')
const {
  listCategories,
  createCategoryHandler,
  updateCategoryHandler,
  deleteCategoryHandler,
} = require('../controllers/categoryController')

const router = express.Router()

router.use(protect)

router.get('/', listCategories)
router.post('/', authorizeRoles('admin'), createCategoryHandler)
router.put('/:id', authorizeRoles('admin'), updateCategoryHandler)
router.delete('/:id', authorizeRoles('admin'), deleteCategoryHandler)

module.exports = router