const { pool } = require('../database/db')

async function seedOrders() {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    const staffResult = await client.query(
      `SELECT id FROM users WHERE role IN ('admin', 'staff') ORDER BY id LIMIT 1`,
    )
    const staffId = staffResult.rows[0]?.id

    const menuItemsResult = await client.query(
      `SELECT id, price FROM menu_items ORDER BY id LIMIT 4`,
    )

    if (!staffId || menuItemsResult.rowCount < 2) {
      throw new Error('Unable to seed orders: missing staff or menu items in the database.')
    }

    const menuItems = menuItemsResult.rows
    const sampleOrders = [
      {
        orderNumber: 'ORD-1001',
        orderStatus: 'ready',
        orderType: 'dine_in',
        tableNumber: 5,
        subtotal: 260,
        tax: 33.8,
        serviceCharge: 5.2,
        totalAmount: 299,
        items: [
          { menuItemId: menuItems[0].id, quantity: 2, unitPrice: menuItems[0].price, totalPrice: Number((menuItems[0].price * 2).toFixed(2)) },
          { menuItemId: menuItems[1].id, quantity: 1, unitPrice: menuItems[1].price, totalPrice: Number(Number(menuItems[1].price).toFixed(2)) },
        ],
      },
      {
        orderNumber: 'ORD-1002',
        orderStatus: 'preparing',
        orderType: 'take_away',
        tableNumber: null,
        subtotal: 180,
        tax: 23.4,
        serviceCharge: 3.6,
        totalAmount: 207,
        items: [
          { menuItemId: menuItems[2].id, quantity: 1, unitPrice: menuItems[2].price, totalPrice: Number(Number(menuItems[2].price).toFixed(2)) },
        ],
      },
    ]

    for (const orderData of sampleOrders) {
      const existing = await client.query(
        'SELECT id FROM orders WHERE order_number = $1',
        [orderData.orderNumber],
      )

      if (existing.rowCount > 0) {
        continue
      }

      const orderResult = await client.query(
        `INSERT INTO orders (
          order_number, staff_id, order_type, table_number, order_status,
          subtotal, tax, service_charge, total_amount
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
        [
          orderData.orderNumber,
          staffId,
          orderData.orderType,
          orderData.tableNumber,
          orderData.orderStatus,
          orderData.subtotal,
          orderData.tax,
          orderData.serviceCharge,
          orderData.totalAmount,
        ],
      )

      const orderId = orderResult.rows[0].id

      for (const item of orderData.items) {
        await client.query(
          `INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, total_price)
           VALUES ($1, $2, $3, $4, $5)`,
          [orderId, item.menuItemId, item.quantity, item.unitPrice, item.totalPrice],
        )
      }
    }

    await client.query('COMMIT')
    console.log('Sample orders seeded successfully.')
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Failed to seed sample orders:', error.message)
    process.exitCode = 1
  } finally {
    client.release()
    await pool.end()
  }
}

seedOrders()
