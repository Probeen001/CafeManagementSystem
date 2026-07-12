const express = require('express')
const { protect, authorizeRoles } = require('../middleware/authMiddleware')
const {
  listOrders,
  getOrderHandler,
  createOrderHandler,
  updateOrderStatusHandler,
  cancelOrderHandler,
  createPaymentHandler,
} = require('../controllers/orderController')

const router = express.Router()

router.use(protect)

router.get('/', listOrders)
router.get('/:id', getOrderHandler)
router.post('/', createOrderHandler)
router.patch('/:id/status', updateOrderStatusHandler)
router.patch('/:id/cancel', cancelOrderHandler)
router.post('/:id/payment', createPaymentHandler)

module.exports = router
