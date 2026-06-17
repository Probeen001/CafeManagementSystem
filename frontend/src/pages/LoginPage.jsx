import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, error, setError } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError('')

    if (!form.email || !form.password) {
      setFormError('Email and password are required')
      return
    }

    try {
      setLoading(true)
      await login(form)
      navigate('/dashboard')
    } catch (loginError) {
      setError(loginError.response?.data?.message || 'Unable to login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-shell">
      <section className="auth-panel auth-copy">
        <span className="eyebrow">CafeX Staff Portal</span>
        <h1>Sign in to manage tables, orders, and billing.</h1>
        <p>
          Secure staff access with JWT authentication, role-based access, and a
          clean handoff into the dashboard.
        </p>
        <div className="feature-list">
          <article>
            <strong>JWT sessions</strong>
            <span>Bearer token auth for protected endpoints</span>
          </article>
          <article>
            <strong>Role control</strong>
            <span>Admin and staff permissions enforced at the API and UI</span>
          </article>
        </div>
      </section>

      <section className="auth-panel auth-form-panel">
        <div className="card-head">
          <h2>Login</h2>
          <p>Use your staff email and password.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              placeholder="staff@cafex.com"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(event) =>
                setForm({ ...form, password: event.target.value })
              }
              placeholder="••••••••"
            />
          </label>

          {(formError || error) && <div className="alert error">{formError || error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <p className="switch-link">
          New staff account? <Link to="/register">Register here</Link>
        </p>
      </section>
    </div>
  )
}