const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  createPayment,
} = require('../models/orderModel')

const VALID_STATUSES = ['new', 'preparing', 'ready', 'completed', 'cancelled']
const VALID_PAYMENT_METHODS = ['cash', 'card', 'upi', 'esewa', 'khalti']

function normalizeStatus(status) {
  const normalized = String(status ?? '').toLowerCase()
  if (normalized === 'pending') return 'new'
  return normalized
}

async function listOrders(req, res, next) {
  try {
    const orders = await getAllOrders(req.query)
    return res.json({ orders })
  } catch (error) {
    return next(error)
  }
}

async function getOrderHandler(req, res, next) {
  try {
    const order = await getOrderById(Number(req.params.id))
    if (!order) return res.status(404).json({ message: 'Order not found' })
    return res.json({ order })
  } catch (error) {
    return next(error)
  }
}

async function createOrderHandler(req, res, next) {
  try {
    const { items, orderType, tableNumber } = req.body
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'items array is required and must not be empty' })
    }
    if (orderType === 'dine_in' && (!Number.isInteger(Number(tableNumber)) || Number(tableNumber) < 1)) {
      return res.status(400).json({ message: 'A valid table number is required for dine-in orders' })
    }
    const order = await createOrder({ staffId: req.user.id, items, orderType, tableNumber })
    return res.status(201).json({ message: 'Order created', order })
  } catch (error) {
    return next(error)
  }
}

async function updateOrderStatusHandler(req, res, next) {
  try {
    const { status } = req.body
    const normalizedStatus = normalizeStatus(status)
    if (!VALID_STATUSES.includes(normalizedStatus)) {
      return res.status(400).json({ message: `status must be one of: ${VALID_STATUSES.join(', ')}` })
    }
    const order = await updateOrderStatus(Number(req.params.id), normalizedStatus)
    if (!order) return res.status(404).json({ message: 'Order not found' })
    return res.json({ message: 'Order status updated', order })
  } catch (error) {
    return next(error)
  }
}

async function cancelOrderHandler(req, res, next) {
  try {
    const order = await cancelOrder(Number(req.params.id))
    if (!order) return res.status(404).json({ message: 'Order not found' })
    return res.json({ message: 'Order cancelled', order })
  } catch (error) {
    return next(error)
  }
}

async function createPaymentHandler(req, res, next) {
  try {
    const { paymentMethod, amount } = req.body
    if (!paymentMethod || !VALID_PAYMENT_METHODS.includes(paymentMethod)) {
      return res.status(400).json({ message: `paymentMethod must be one of: ${VALID_PAYMENT_METHODS.join(', ')}` })
    }
    if (!amount) {
      return res.status(400).json({ message: 'amount is required' })
    }
    await updateOrderStatus(Number(req.params.id), 'completed')
    const payment = await createPayment(Number(req.params.id), { paymentMethod, amount })
    return res.status(201).json({ message: 'Payment recorded', payment })
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  listOrders,
  getOrderHandler,
  createOrderHandler,
  updateOrderStatusHandler,
  cancelOrderHandler,
  createPaymentHandler,
}
