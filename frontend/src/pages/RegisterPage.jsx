import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register, error, setError, isAdmin } = useAuth()
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'staff',
  })
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError('')

    if (!form.fullName || !form.email || !form.password) {
      setFormError('Full name, email, and password are required')
      return
    }

    try {
      setLoading(true)
      await register(form)
      navigate('/dashboard')
    } catch (registerError) {
      setError(registerError.response?.data?.message || 'Unable to register')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-shell">
      <section className="auth-panel auth-copy">
        <span className="eyebrow">CafeX Onboarding</span>
        <h1>Create a new staff account.</h1>
        <p>
          Register staff members with a controlled role, hashed passwords, and
          secure default access.
        </p>
        <div className="feature-list">
          <article>
            <strong>Password hashing</strong>
            <span>bcryptjs stores only salted password hashes</span>
          </article>
          <article>
            <strong>Admin only</strong>
            <span>
              Staff registration is protected on the backend and the admin-only
              role option is hidden for non-admin users.
            </span>
          </article>
        </div>
      </section>

      <section className="auth-panel auth-form-panel">
        <div className="card-head">
          <h2>Register staff</h2>
          <p>Create a new login for your cafe team.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Full name
            <input
              type="text"
              value={form.fullName}
              onChange={(event) =>
                setForm({ ...form, fullName: event.target.value })
              }
              placeholder="Jane Doe"
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              placeholder="jane@cafex.com"
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
              placeholder="Create a strong password"
            />
          </label>
          <label>
            Role
            <select
              value={form.role}
              onChange={(event) => setForm({ ...form, role: event.target.value })}
              disabled={!isAdmin}
            >
              <option value="staff">Staff</option>
              {isAdmin && <option value="admin">Admin</option>}
            </select>
          </label>

          {(formError || error) && <div className="alert error">{formError || error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="switch-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </section>
    </div>
  )
}