const {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItemById,
  toggleMenuItemAvailability,
  deleteMenuItemById,
} = require('../models/menuModel')

async function listMenuItems(req, res, next) {
  try {
    const items = await getAllMenuItems(req.query)
    return res.json({ items })
  } catch (error) {
    return next(error)
  }
}

async function getMenuItemHandler(req, res, next) {
  try {
    const item = await getMenuItemById(Number(req.params.id))
    if (!item) return res.status(404).json({ message: 'Menu item not found' })
    return res.json({ menuItem: item })
  } catch (error) {
    return next(error)
  }
}

async function createMenuItemHandler(req, res, next) {
  try {
    const { name, description, price, categoryId, category_id, imageUrl, image_url } = req.body
    const resolvedCategoryId = categoryId || category_id
    if (!name || !price || !resolvedCategoryId) {
      return res.status(400).json({ message: 'name, price, and categoryId are required' })
    }
    const item = await createMenuItem({
      name,
      description,
      price,
      categoryId: resolvedCategoryId,
      imageUrl: imageUrl || image_url,
    })
    return res.status(201).json({ message: 'Menu item created', menuItem: item })
  } catch (error) {
    return next(error)
  }
}

async function updateMenuItemHandler(req, res, next) {
  try {
    const item = await updateMenuItemById(Number(req.params.id), req.body)
    if (!item) return res.status(404).json({ message: 'Menu item not found' })
    return res.json({ message: 'Menu item updated', menuItem: item })
  } catch (error) {
    return next(error)
  }
}

async function toggleAvailabilityHandler(req, res, next) {
  try {
    const item = await toggleMenuItemAvailability(Number(req.params.id))
    if (!item) return res.status(404).json({ message: 'Menu item not found' })
    return res.json({ message: 'Availability toggled', menuItem: item })
  } catch (error) {
    return next(error)
  }
}

async function uploadImageHandler(req, res, next) {
  try {
    const { imageUrl } = req.body
    if (!imageUrl) return res.status(400).json({ message: 'imageUrl is required' })
    const item = await updateMenuItemById(Number(req.params.id), { imageUrl })
    if (!item) return res.status(404).json({ message: 'Menu item not found' })
    return res.json({ message: 'Image updated', menuItem: item })
  } catch (error) {
    return next(error)
  }
}

async function deleteMenuItemHandler(req, res, next) {
  try {
    const deleted = await deleteMenuItemById(Number(req.params.id))
    if (!deleted) return res.status(404).json({ message: 'Menu item not found' })
    return res.json({ message: 'Menu item deleted' })
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  listMenuItems,
  getMenuItemHandler,
  createMenuItemHandler,
  updateMenuItemHandler,
  toggleAvailabilityHandler,
  uploadImageHandler,
  deleteMenuItemHandler,
}
