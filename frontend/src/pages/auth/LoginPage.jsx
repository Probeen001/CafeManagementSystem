import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Coffee } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { Spinner } from '../../components/ui/Spinner'

export default function LoginPage({ brand = 'admin' }) {
  const navigate  = useNavigate()
  const { login } = useAuth()

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  const isAdmin = brand === 'admin'
  const accent  = isAdmin ? '#F97316' : '#2E7D32'

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmedEmail = email.trim().toLowerCase()
    const trimmedPassword = password.trim()

    if (!trimmedEmail || !trimmedPassword) {
      setError('Please enter both your email and password.')
      return
    }

    setLoading(true)
    setError('')
    try {
      const data = await login({ email: trimmedEmail, password: trimmedPassword })
      const role = data?.staff?.role
      navigate(role === 'admin' ? '/admin/dashboard' : '/staff/dashboard', { replace: true })
    } catch (err) {
      setError(err?.response?.data?.message ?? 'Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100svh',
      background: '#F8F1E8',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
    }}>
      {/* Card */}
      <div style={{
        width: '100%',
        maxWidth: '24rem',
        background: '#FFFDF8',
        borderRadius: '28px',
        boxShadow: '0 8px 40px rgba(75,31,14,0.14)',
        border: '1px solid #E8DCCF',
        padding: '2.25rem 2rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        {/* Logo */}
        <div style={{
          width: '5rem',
          height: '5rem',
          borderRadius: '50%',
          background: '#1E0E07',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.25rem',
          boxShadow: '0 4px 20px rgba(30,14,7,0.25)',
        }}>
          <Coffee size={32} color="#F8F1E8" strokeWidth={1.5} />
        </div>

        {/* Brand */}
        <h1 style={{
          fontSize: '1.75rem',
          fontWeight: 800,
          color: '#1C0D07',
          letterSpacing: '-0.04em',
          marginBottom: '0.25rem',
        }}>
          CafeX
        </h1>
        <p style={{ fontSize: '0.9375rem', color: '#6B5B4B', marginBottom: '0.375rem' }}>
          Welcome Back!
        </p>
        <p style={{ fontSize: '0.8125rem', color: '#A89080', marginBottom: '1.75rem', textAlign: 'center' }}>
          Use your registered CafeX credentials to continue.
        </p>

        {/* Role badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.375rem',
          padding: '0.25rem 0.875rem',
          borderRadius: '999px',
          background: isAdmin ? 'rgba(249,115,22,0.1)' : 'rgba(46,125,50,0.1)',
          border: `1px solid ${isAdmin ? 'rgba(249,115,22,0.25)' : 'rgba(46,125,50,0.25)'}`,
          color: accent,
          fontSize: '0.75rem',
          fontWeight: 700,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          marginBottom: '1.75rem',
        }}>
          <div style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: accent,
          }} />
          {isAdmin ? 'Admin Access' : 'Staff Access'}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Email */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#3D1E12' }}>
              Email address
            </label>
            <input
              type="email"
              placeholder={isAdmin ? 'admin@cafex.com' : 'staff@cafex.com'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              autoFocus
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '14px',
                border: '1.5px solid #E8DCCF',
                background: '#F3EAE0',
                fontSize: '0.9375rem',
                color: '#1C0D07',
                outline: 'none',
                transition: 'border-color 150ms',
              }}
              onFocus={(e) => e.target.style.borderColor = accent}
              onBlur={(e) => e.target.style.borderColor = '#E8DCCF'}
            />
          </div>

          {/* Password */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#3D1E12' }}>
                Password
              </label>
              <Link to="/auth/forgot-password" style={{ fontSize: '0.8125rem', color: accent, fontWeight: 600 }}>
                Forgot Password?
              </Link>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 3rem 0.75rem 1rem',
                  borderRadius: '14px',
                  border: '1.5px solid #E8DCCF',
                  background: '#F3EAE0',
                  fontSize: '0.9375rem',
                  color: '#1C0D07',
                  outline: 'none',
                  transition: 'border-color 150ms',
                }}
                onFocus={(e) => e.target.style.borderColor = accent}
                onBlur={(e) => e.target.style.borderColor = '#E8DCCF'}
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                style={{
                  position: 'absolute',
                  right: '0.875rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#A89080',
                  display: 'flex',
                  padding: 0,
                }}
              >
                {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              padding: '0.625rem 0.875rem',
              borderRadius: '12px',
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              fontSize: '0.875rem',
              color: '#991B1B',
            }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.875rem',
              borderRadius: '14px',
              border: 'none',
              background: accent,
              color: '#FFFDF8',
              fontSize: '0.9375rem',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              opacity: loading ? 0.7 : 1,
              transition: 'opacity 150ms, transform 100ms',
              letterSpacing: '-0.01em',
              marginTop: '0.25rem',
            }}
          >
            {loading ? <Spinner size="sm" color="#FFFDF8" /> : null}
            {loading ? 'Signing in…' : 'Login'}
          </button>
        </form>

        {/* Role switch */}
        <p style={{ fontSize: '0.8125rem', color: '#A89080', textAlign: 'center' }}>
          {isAdmin ? (
            <>
              Don&apos;t have an account?{' '}
              <Link to="/auth/staff" style={{ color: accent, fontWeight: 700 }}>
                Contact Super Admin
              </Link>
            </>
          ) : (
            <>
              Admin?{' '}
              <Link to="/auth/admin" style={{ color: accent, fontWeight: 700 }}>
                Contact Admin
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
