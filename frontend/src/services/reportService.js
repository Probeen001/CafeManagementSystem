import api from './api'

export const reportService = {
  getSummary:    (params) => api.get('/reports/summary', { params }),
  getRevenue:    (params) => api.get('/reports/revenue', { params }),
  getTopItems:   (params) => api.get('/reports/top-items', { params }),
  getOrderStats: (params) => api.get('/reports/orders', { params }),
  exportCSV:     (params) => api.get('/reports/export/csv', { params, responseType: 'blob' }),
  exportPDF:     (params) => api.get('/reports/export/pdf', { params, responseType: 'blob' }),
}
