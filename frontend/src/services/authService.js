import api from './api'

export const authService = {
  login:          (credentials) => api.post('/auth/login', credentials),
  register:       (data)        => api.post('/auth/register', data),
  logout:         ()            => api.post('/auth/logout'),
  me:             ()            => api.get('/auth/me'),
  changePassword: (data)        => api.patch('/auth/password', data),

  // Password reset flow
  forgotPassword: (email)         => api.post('/auth/forgot-password', { email }),
  resetPassword:  (token, data)   => api.post(`/auth/reset-password/${token}`, data),
}
