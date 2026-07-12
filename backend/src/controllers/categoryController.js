const {
  getAllCategories,
  getCategoryById,
  getCategoryByName,
  createCategory,
  updateCategoryById,
  deleteCategoryById,
} = require('../models/categoryModel')

function normalizeCategoryPayload(body) {
  return {
    name: typeof body.name === 'string' ? body.name.trim() : '',
    description:
      typeof body.description === 'string' ? body.description.trim() : null,
  }
}

async function listCategories(req, res, next) {
  try {
    const categories = await getAllCategories()
    return res.json({ categories })
  } catch (error) {
    return next(error)
  }
}

async function createCategoryHandler(req, res, next) {
  try {
    const payload = normalizeCategoryPayload(req.body)

    if (!payload.name) {
      return res.status(400).json({ message: 'Category name is required' })
    }

    const existingCategory = await getCategoryByName(payload.name)
    if (existingCategory) {
      return res.status(409).json({ message: 'Category name already exists' })
    }

    const category = await createCategory(payload)

    return res.status(201).json({
      message: 'Category created successfully',
      category,
    })
  } catch (error) {
    return next(error)
  }
}

async function updateCategoryHandler(req, res, next) {
  try {
    const categoryId = Number(req.params.id)
    if (Number.isNaN(categoryId)) {
      return res.status(400).json({ message: 'Invalid category id' })
    }

    const payload = normalizeCategoryPayload(req.body)
    const currentCategory = await getCategoryById(categoryId)

    if (!currentCategory) {
      return res.status(404).json({ message: 'Category not found' })
    }

    if (payload.name && payload.name.toLowerCase() !== currentCategory.name.toLowerCase()) {
      const duplicateCategory = await getCategoryByName(payload.name)
      if (duplicateCategory) {
        return res.status(409).json({ message: 'Category name already exists' })
      }
    }

    const category = await updateCategoryById(categoryId, {
      name: payload.name || null,
      description: payload.description,
    })

    return res.json({
      message: 'Category updated successfully',
      category,
    })
  } catch (error) {
    return next(error)
  }
}

async function deleteCategoryHandler(req, res, next) {
  try {
    const categoryId = Number(req.params.id)
    if (Number.isNaN(categoryId)) {
      return res.status(400).json({ message: 'Invalid category id' })
    }

    const deleted = await deleteCategoryById(categoryId)
    if (!deleted) {
      return res.status(404).json({ message: 'Category not found' })
    }

    return res.json({ message: 'Category deleted successfully' })
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  listCategories,
  createCategoryHandler,
  updateCategoryHandler,
  deleteCategoryHandler,
}