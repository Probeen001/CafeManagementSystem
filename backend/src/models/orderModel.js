const db = require('../config/db')
const { pool } = require('../config/db')

async function getAllOrders({ status, staffId, limit = 50, offset = 0 } = {}) {
  const conditions = []
  const values = []

  if (status) {
    values.push(status)
    conditions.push(`o.order_status = $${values.length}`)
  }
  if (staffId) {
    values.push(Number(staffId))
    conditions.push(`o.staff_id = $${values.length}`)
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
  values.push(Number(limit), Number(offset))

  const result = await db.query(
    `SELECT o.*, u.full_name AS staff_name
     FROM orders o
     JOIN users u ON u.id = o.staff_id
     ${where}
     ORDER BY o.created_at DESC
     LIMIT $${values.length - 1} OFFSET $${values.length}`,
    values,
  )
  return result.rows
}

async function getOrderById(id) {
  const orderResult = await db.query(
    `SELECT o.*, u.full_name AS staff_name
     FROM orders o
     JOIN users u ON u.id = o.staff_id
     WHERE o.id = $1`,
    [id],
  )
  if (!orderResult.rows[0]) return null

  const itemsResult = await db.query(
    `SELECT oi.id, oi.order_id, oi.menu_item_id,
            oi.quantity AS qty,
            oi.unit_price AS price,
            oi.total_price,
            m.name, m.image_url
     FROM order_items oi
     JOIN menu_items m ON m.id = oi.menu_item_id
     WHERE oi.order_id = $1
     ORDER BY oi.id`,
    [id],
  )

  return { ...orderResult.rows[0], items: itemsResult.rows }
}

async function createOrder({ staffId, items, orderType = 'dine_in', tableNumber = null }) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const ts = Date.now()
    const rand = Math.floor(Math.random() * 900) + 100
    const orderNumber = `ORD-${ts}-${rand}`

    const itemIds = items.map((i) => i.menuItemId)
    const menuResult = await client.query(
      `SELECT id, price, is_available FROM menu_items WHERE id = ANY($1::int[])`,
      [itemIds],
    )

    const priceMap = {}
    menuResult.rows.forEach((row) => {
      priceMap[row.id] = { price: parseFloat(row.price), isAvailable: row.is_available }
    })

    let subtotal = 0
    const orderItemsData = items.map((item) => {
      const menuItem = priceMap[item.menuItemId]
      if (!menuItem) {
        const err = new Error(`Menu item ${item.menuItemId} not found`)
        err.status = 404
        throw err
      }
      if (!menuItem.isAvailable) {
        const err = new Error(`Menu item ${item.menuItemId} is not available`)
        err.status = 400
        throw err
      }
      const totalPrice = parseFloat((menuItem.price * item.quantity).toFixed(2))
      subtotal += totalPrice
      return { menuItemId: item.menuItemId, quantity: item.quantity, unitPrice: menuItem.price, totalPrice }
    })

    const TAX_RATE = 0.13
    const SERVICE_RATE = 0.02
    const tax = parseFloat((subtotal * TAX_RATE).toFixed(2))
    const serviceCharge = parseFloat((subtotal * SERVICE_RATE).toFixed(2))
    const totalAmount = parseFloat((subtotal + tax + serviceCharge).toFixed(2))

    const validOrderType = ['dine_in', 'take_away'].includes(orderType) ? orderType : 'dine_in'
    const validTableNumber = validOrderType === 'dine_in' ? Number(tableNumber) : null

    const orderResult = await client.query(
      `INSERT INTO orders (order_number, staff_id, order_type, table_number, order_status, subtotal, tax, service_charge, total_amount)
       VALUES ($1, $2, $3, $4, 'new', $5, $6, $7, $8)
       RETURNING *`,
      [orderNumber, staffId, validOrderType, validTableNumber, subtotal.toFixed(2), tax, serviceCharge, totalAmount],
    )
    const order = orderResult.rows[0]

    for (const item of orderItemsData) {
      await client.query(
        `INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, total_price)
         VALUES ($1, $2, $3, $4, $5)`,
        [order.id, item.menuItemId, item.quantity, item.unitPrice, item.totalPrice],
      )
    }

    await client.query('COMMIT')
    return order
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

async function updateOrderStatus(id, status) {
  const result = await db.query(
    `UPDATE orders SET order_status = $1, updated_at = NOW()
     WHERE id = $2
     RETURNING *`,
    [status, id],
  )
  return result.rows[0] || null
}

async function cancelOrder(id) {
  return updateOrderStatus(id, 'cancelled')
}

async function createPayment(orderId, { paymentMethod, amount }) {
  const result = await db.query(
    `INSERT INTO payments (order_id, payment_method, amount)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [orderId, paymentMethod, amount],
  )
  return result.rows[0]
}

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  createPayment,
}
