import api from './api'

export const menuService = {
  getAll:     (params)        => api.get('/menu', { params }),
  getById:    (id)            => api.get(`/menu/${id}`),
  create:     (data)          => api.post('/menu', data),
  update:     (id, data)      => api.put(`/menu/${id}`, data),
  remove:     (id)            => api.delete(`/menu/${id}`),
  toggleAvailability: (id)    => api.patch(`/menu/${id}/availability`),
  uploadImage: (id, formData) => api.post(`/menu/${id}/image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
}
