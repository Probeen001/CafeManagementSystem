const express = require('express')
const { protect, authorizeRoles } = require('../middleware/authMiddleware')
const {
  getSummary,
  getRevenue,
  getTopItems,
  getOrderStats,
  exportCSV,
  exportPDF,
} = require('../controllers/reportController')

const router = express.Router()

router.use(protect)
router.use(authorizeRoles('admin'))

router.get('/summary', getSummary)
router.get('/revenue', getRevenue)
router.get('/top-items', getTopItems)
router.get('/orders', getOrderStats)
router.get('/export/csv', exportCSV)
router.get('/export/pdf', exportPDF)

module.exports = router
