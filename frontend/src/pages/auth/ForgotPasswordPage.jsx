import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Coffee, Mail, CheckCircle } from 'lucide-react'
import { authService } from '../../services/authService'
import { Spinner } from '../../components/ui/Spinner'

const ACCENT = '#F97316'

export default function ForgotPasswordPage() {
  const [email,     setEmail]     = useState('')
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await authService.forgotPassword(email.trim().toLowerCase())
      setSubmitted(true)
    } catch (err) {
      // Show server message if present, otherwise generic fallback
      setError(err?.response?.data?.message ?? 'Something went wrong. Please try again.')
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
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1C0D07', letterSpacing: '-0.04em', marginBottom: '0.25rem' }}>
          CafeX
        </h1>
        <p style={{ fontSize: '0.9375rem', color: '#6B5B4B', marginBottom: '1.75rem' }}>
          {submitted ? 'Check your inbox' : 'Forgot your password?'}
        </p>

        {/* ── Success state ── */}
        {submitted ? (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>

            <div style={{
              width: '4.5rem',
              height: '4.5rem',
              borderRadius: '50%',
              background: 'rgba(249,115,22,0.1)',
              border: `2px solid rgba(249,115,22,0.3)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <CheckCircle size={32} color={ACCENT} strokeWidth={1.75} />
            </div>

            <div style={{
              background: '#FEF9F0',
              border: '1px solid #FDDCB5',
              borderRadius: '16px',
              padding: '1.125rem 1.25rem',
              textAlign: 'center',
            }}>
              <p style={{ fontSize: '0.9375rem', color: '#1C0D07', fontWeight: 600, margin: '0 0 0.375rem' }}>
                Reset link sent!
              </p>
              <p style={{ fontSize: '0.875rem', color: '#6B5B4B', lineHeight: 1.6, margin: 0 }}>
                We sent a password reset link to <strong>{email}</strong>.
                Check your inbox (and spam folder) — the link expires in{' '}
                <strong>15 minutes</strong>.
              </p>
            </div>

            <p style={{ fontSize: '0.8125rem', color: '#A89080', textAlign: 'center', lineHeight: 1.6, margin: 0 }}>
              Didn't receive it?{' '}
              <button
                type="button"
                onClick={() => { setSubmitted(false); setEmail('') }}
                style={{ color: ACCENT, fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontSize: 'inherit' }}
              >
                Try again
              </button>
            </p>

            <Link
              to="/auth/admin"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                fontSize: '0.875rem',
                color: '#6B5B4B',
                fontWeight: 600,
                textDecoration: 'none',
                padding: '0.625rem 1.25rem',
                borderRadius: '12px',
                border: '1.5px solid #E8DCCF',
                background: '#FFFDF8',
                marginTop: '0.25rem',
              }}
            >
              <ArrowLeft size={15} />
              Back to Login
            </Link>
          </div>

        ) : (
          /* ── Request form ── */
          <>
            <p style={{ fontSize: '0.875rem', color: '#6B5B4B', textAlign: 'center', lineHeight: 1.6, marginBottom: '1.75rem' }}>
              Enter your registered email address and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

              {/* Email field */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#3D1E12' }}>
                  Email address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail
                    size={16}
                    color="#A89080"
                    style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                  />
                  <input
                    type="email"
                    placeholder="you@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem 0.75rem 2.625rem',
                      borderRadius: '14px',
                      border: '1.5px solid #E8DCCF',
                      background: '#F3EAE0',
                      fontSize: '0.9375rem',
                      color: '#1C0D07',
                      outline: 'none',
                      transition: 'border-color 150ms',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = ACCENT)}
                    onBlur={(e)  => (e.target.style.borderColor = '#E8DCCF')}
                  />
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
                  background: '#1E0E07',
                  color: '#FFFDF8',
                  fontSize: '0.9375rem',
                  fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  opacity: loading ? 0.7 : 1,
                  transition: 'opacity 150ms',
                  letterSpacing: '-0.01em',
                  marginTop: '0.25rem',
                }}
              >
                {loading && <Spinner size="sm" color="#FFFDF8" />}
                {loading ? 'Sending link…' : 'Send Reset Link'}
              </button>
            </form>

            {/* Back link */}
            <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <ArrowLeft size={14} color="#A89080" />
              <Link to="/auth/admin" style={{ fontSize: '0.8125rem', color: '#A89080', fontWeight: 600 }}>
                Back to Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
