import api from './api'

export const staffService = {
  getAll:     (params)    => api.get('/staff', { params }),
  getById:    (id)        => api.get(`/staff/${id}`),
  create:     (data)      => api.post('/staff', data),
  update:     (id, data)  => api.put(`/staff/${id}`, data),
  toggleActive: (id)      => api.patch(`/staff/${id}/toggle-active`),
  remove:     (id)        => api.delete(`/staff/${id}`),
  updateProfile: (data)   => api.put('/staff/profile', data),
}
