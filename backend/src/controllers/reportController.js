const db = require('../config/db')

async function getSummary(req, res, next) {
  try {
    const [ordersToday, revenueToday, activeStaff, availableItems] = await Promise.all([
      db.query(`SELECT COUNT(*) AS count FROM orders WHERE DATE(created_at) = CURRENT_DATE`),
      db.query(
        `SELECT COALESCE(SUM(total_amount), 0) AS total
         FROM orders
         WHERE DATE(created_at) = CURRENT_DATE AND order_status != 'cancelled'`,
      ),
      db.query(`SELECT COUNT(*) AS count FROM users WHERE is_active = true`),
      db.query(`SELECT COUNT(*) AS count FROM menu_items WHERE is_available = true`),
    ])

    return res.json({
      summary: {
        ordersToday: Number(ordersToday.rows[0].count),
        revenueToday: parseFloat(revenueToday.rows[0].total),
        activeStaff: Number(activeStaff.rows[0].count),
        availableMenuItems: Number(availableItems.rows[0].count),
      },
    })
  } catch (error) {
    return next(error)
  }
}

async function getRevenue(req, res, next) {
  try {
    const { period = 'daily', days = 7 } = req.query
    const safeDays = Math.min(Math.max(Number(days) || 7, 1), 365)

    let groupBy, label
    if (period === 'monthly') {
      groupBy = `DATE_TRUNC('month', created_at)`
      label = `TO_CHAR(DATE_TRUNC('month', created_at), 'YYYY-MM')`
    } else if (period === 'weekly') {
      groupBy = `DATE_TRUNC('week', created_at)`
      label = `TO_CHAR(DATE_TRUNC('week', created_at), 'YYYY-MM-DD')`
    } else {
      groupBy = `DATE(created_at)`
      label = `TO_CHAR(DATE(created_at), 'YYYY-MM-DD')`
    }

    const result = await db.query(
      `SELECT ${label} AS period,
              COUNT(*) AS orders,
              COALESCE(SUM(total_amount), 0) AS revenue
       FROM orders
       WHERE created_at >= NOW() - ($1 * INTERVAL '1 day')
         AND order_status != 'cancelled'
       GROUP BY ${groupBy}
       ORDER BY ${groupBy}`,
      [safeDays],
    )

    return res.json({ revenue: result.rows })
  } catch (error) {
    return next(error)
  }
}

async function getTopItems(req, res, next) {
  try {
    const limit = Math.min(Number(req.query.limit) || 10, 50)

    const result = await db.query(
      `SELECT m.id, m.name, c.name AS category,
              SUM(oi.quantity)::int AS total_quantity,
              SUM(oi.total_price) AS total_revenue
       FROM order_items oi
       JOIN menu_items m ON m.id = oi.menu_item_id
       JOIN categories c ON c.id = m.category_id
       JOIN orders o ON o.id = oi.order_id
       WHERE o.order_status != 'cancelled'
       GROUP BY m.id, m.name, c.name
       ORDER BY total_quantity DESC
       LIMIT $1`,
      [limit],
    )

    return res.json({ topItems: result.rows })
  } catch (error) {
    return next(error)
  }
}

async function getOrderStats(req, res, next) {
  try {
    const result = await db.query(
      `SELECT order_status AS status, COUNT(*)::int AS count
       FROM orders
       GROUP BY order_status`,
    )
    return res.json({ orderStats: result.rows })
  } catch (error) {
    return next(error)
  }
}

async function exportCSV(req, res, next) {
  try {
    const result = await db.query(
      `SELECT o.order_number, o.order_status, o.subtotal, o.tax, o.total_amount,
              o.created_at, u.full_name AS staff_name
       FROM orders o
       JOIN users u ON u.id = o.staff_id
       ORDER BY o.created_at DESC`,
    )

    const headers = ['order_number', 'status', 'subtotal', 'tax', 'total', 'created_at', 'staff']
    const rows = result.rows.map((r) => [
      r.order_number,
      r.order_status,
      r.subtotal,
      r.tax,
      r.total_amount,
      new Date(r.created_at).toISOString(),
      `"${r.staff_name}"`,
    ])

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')

    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment; filename="cafex-orders.csv"')
    return res.send(csv)
  } catch (error) {
    return next(error)
  }
}

async function exportPDF(req, res, next) {
  try {
    const result = await db.query(
      `SELECT o.order_number, o.order_status, o.total_amount, o.created_at, u.full_name AS staff_name
       FROM orders o
       JOIN users u ON u.id = o.staff_id
       ORDER BY o.created_at DESC
       LIMIT 200`,
    )

    const lines = [
      'CafeX - Orders Report',
      `Generated: ${new Date().toLocaleString()}`,
      '='.repeat(70),
      '',
      `${'Order #'.padEnd(20)} ${'Status'.padEnd(12)} ${'Total'.padEnd(10)} ${'Staff'.padEnd(20)} Date`,
      '-'.repeat(70),
      ...result.rows.map(
        (r) =>
          `${r.order_number.padEnd(20)} ${r.order_status.padEnd(12)} ${String(r.total_amount).padEnd(10)} ${r.staff_name.padEnd(20)} ${new Date(r.created_at).toLocaleDateString()}`,
      ),
    ]

    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.setHeader('Content-Disposition', 'attachment; filename="cafex-report.txt"')
    return res.send(lines.join('\n'))
  } catch (error) {
    return next(error)
  }
}

module.exports = { getSummary, getRevenue, getTopItems, getOrderStats, exportCSV, exportPDF }
