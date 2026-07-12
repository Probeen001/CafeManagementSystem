const db = require('../config/db')

async function getAllCategories() {
  const result = await db.query(
    `SELECT id, name, description, created_at, updated_at
     FROM categories
     ORDER BY name ASC`,
  )

  return result.rows
}

async function getCategoryById(id) {
  const result = await db.query(
    `SELECT id, name, description, created_at, updated_at
     FROM categories
     WHERE id = $1
     LIMIT 1`,
    [id],
  )

  return result.rows[0] || null
}

async function getCategoryByName(name) {
  const result = await db.query(
    `SELECT id, name, description, created_at, updated_at
     FROM categories
     WHERE lower(name) = lower($1)
     LIMIT 1`,
    [name],
  )

  return result.rows[0] || null
}

async function createCategory({ name, description }) {
  const result = await db.query(
    `INSERT INTO categories (name, description)
     VALUES ($1, $2)
     RETURNING id, name, description, created_at, updated_at`,
    [name, description || null],
  )

  return result.rows[0]
}

async function updateCategoryById(id, { name, description }) {
  const result = await db.query(
    `UPDATE categories
     SET name = COALESCE($2, name),
         description = COALESCE($3, description),
         updated_at = NOW()
     WHERE id = $1
     RETURNING id, name, description, created_at, updated_at`,
    [id, name, description],
  )

  return result.rows[0] || null
}

async function deleteCategoryById(id) {
  const result = await db.query(
    `DELETE FROM categories
     WHERE id = $1
     RETURNING id`,
    [id],
  )

  return result.rowCount > 0
}

module.exports = {
  getAllCategories,
  getCategoryById,
  getCategoryByName,
  createCategory,
  updateCategoryById,
  deleteCategoryById,
}