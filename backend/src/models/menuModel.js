const db = require('../config/db')

async function getAllMenuItems({ categoryId, available } = {}) {
  const conditions = []
  const values = []

  if (categoryId) {
    values.push(Number(categoryId))
    conditions.push(`m.category_id = $${values.length}`)
  }
  if (available !== undefined) {
    values.push(available === 'true' || available === true)
    conditions.push(`m.is_available = $${values.length}`)
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

  const result = await db.query(
    `SELECT m.id, m.name, m.description, m.price, m.image_url,
            m.is_available, m.created_at, m.updated_at,
            c.id AS category_id, c.name AS category_name
     FROM menu_items m
     JOIN categories c ON c.id = m.category_id
     ${where}
     ORDER BY c.name, m.name`,
    values,
  )
  return result.rows
}

async function getMenuItemById(id) {
  const result = await db.query(
    `SELECT m.id, m.name, m.description, m.price, m.image_url,
            m.is_available, m.created_at, m.updated_at,
            c.id AS category_id, c.name AS category_name
     FROM menu_items m
     JOIN categories c ON c.id = m.category_id
     WHERE m.id = $1`,
    [id],
  )
  return result.rows[0] || null
}

async function createMenuItem({ name, description, price, categoryId, imageUrl }) {
  const result = await db.query(
    `INSERT INTO menu_items (name, description, price, category_id, image_url)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [name, description || null, price, categoryId, imageUrl || null],
  )
  return result.rows[0]
}

async function updateMenuItemById(id, fields) {
  const fieldMap = {
    name: 'name',
    description: 'description',
    price: 'price',
    categoryId:   'category_id',
    category_id:  'category_id',
    imageUrl:     'image_url',
    image_url:    'image_url',
    isAvailable:  'is_available',
    is_available: 'is_available',
  }

  const setClauses = []
  const values = []

  for (const [key, col] of Object.entries(fieldMap)) {
    if (fields[key] !== undefined) {
      values.push(fields[key])
      setClauses.push(`${col} = $${values.length}`)
    }
  }

  if (setClauses.length === 0) return null

  values.push(id)
  const result = await db.query(
    `UPDATE menu_items SET ${setClauses.join(', ')}, updated_at = NOW()
     WHERE id = $${values.length}
     RETURNING *`,
    values,
  )
  return result.rows[0] || null
}

async function toggleMenuItemAvailability(id) {
  const result = await db.query(
    `UPDATE menu_items
     SET is_available = NOT is_available, updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [id],
  )
  return result.rows[0] || null
}

async function deleteMenuItemById(id) {
  const result = await db.query(
    `DELETE FROM menu_items WHERE id = $1 RETURNING id`,
    [id],
  )
  return result.rowCount > 0
}

module.exports = {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItemById,
  toggleMenuItemAvailability,
  deleteMenuItemById,
}
