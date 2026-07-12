const request = require('supertest')
const app = require('../src/app')

describe('Auth API', () => {
  it('returns health status for the API', async () => {
    const res = await request(app).get('/api/health')

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
  })

  it('rejects login without credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({})

    expect(res.status).toBe(400)
    expect(res.body.message).toMatch(/required/i)
  })

  it('rejects login with invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nope@example.com', password: 'Wrong@123' })

    expect(res.status).toBe(401)
    expect(res.body.message).toMatch(/invalid credentials/i)
  })

  it('rejects password reset with a missing token', async () => {
    const res = await request(app)
      .post('/api/auth/reset-password/invalid-token')
      .send({ newPassword: 'NewPass@123', confirmPassword: 'NewPass@123' })

    expect(res.status).toBe(400)
    expect(res.body.message).toMatch(/invalid or has expired/i)
  })

  it('requires a valid email for forgot password', async () => {
    const res = await request(app)
      .post('/api/auth/forgot-password')
      .send({})

    expect(res.status).toBe(400)
    expect(res.body.message).toMatch(/required/i)
  })

  it('blocks access to protected routes without a token', async () => {
    const res = await request(app).get('/api/auth/me')

    expect(res.status).toBe(401)
    expect(res.body.message).toMatch(/token missing|authorized/i)
  })
})
