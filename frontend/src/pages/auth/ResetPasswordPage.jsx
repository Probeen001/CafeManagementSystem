import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Coffee, CheckCircle, XCircle, Lock } from 'lucide-react'
import { authService } from '../../services/authService'
import { Spinner } from '../../components/ui/Spinner'

const ACCENT = '#F97316'

// Password strength rules
const RULES = [
  { id: 'length',    label: 'At least 8 characters',            test: (p) => p.length >= 8 },
  { id: 'upper',     label: 'One uppercase letter (A–Z)',        test: (p) => /[A-Z]/.test(p) },
  { id: 'lower',     label: 'One lowercase letter (a–z)',        test: (p) => /[a-z]/.test(p) },
  { id: 'number',    label: 'One number (0–9)',                  test: (p) => /\d/.test(p) },
  { id: 'special',   label: 'One special character (!@#$%…)',    test: (p) => /[!@#$%^&*()\-_=+[\]{};':"\\|,.<>/?]/.test(p) },
]

function getStrengthLevel(password) {
  const passed = RULES.filter((r) => r.test(password)).length
  if (passed <= 1) return { level: 0, label: '',         color: '#E8DCCF' }
  if (passed === 2) return { level: 1, label: 'Weak',    color: '#EF4444' }
  if (passed === 3) return { level: 2, label: 'Fair',    color: '#F97316' }
  if (passed === 4) return { level: 3, label: 'Good',    color: '#EAB308' }
  return              { level: 4, label: 'Strong',  color: '#22C55E' }
}

export default function ResetPasswordPage() {
  const { token }    = useParams()
  const navigate     = useNavigate()

  const [newPassword,     setNewPassword]     = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNew,         setShowNew]         = useState(false)
  const [showConfirm,     setShowConfirm]     = useState(false)
  const [loading,         setLoading]         = useState(false)
  const [error,           setError]           = useState('')
  const [success,         setSuccess]         = useState(false)
  const [redirectSecs,    setRedirectSecs]    = useState(5)

  const strength      = getStrengthLevel(newPassword)
  const rulesVisible  = newPassword.length > 0
  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword

  // Auto-redirect countdown after success
  useEffect(() => {
    if (!success) return
    if (redirectSecs <= 0) {
      navigate('/auth/admin', { replace: true })
      return
    }
    const id = setTimeout(() => setRedirectSecs((s) => s - 1), 1000)
    return () => clearTimeout(id)
  }, [success, redirectSecs, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!token) {
      setError('Reset token is missing. Please request a new reset link.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    const allPassed = RULES.every((r) => r.test(newPassword))
    if (!allPassed) {
      setError('Please meet all password requirements.')
      return
    }

    setLoading(true)
    try {
      await authService.resetPassword(token, { newPassword, confirmPassword })
      setSuccess(true)
    } catch (err) {
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

        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1C0D07', letterSpacing: '-0.04em', marginBottom: '0.25rem' }}>
          CafeX
        </h1>
        <p style={{ fontSize: '0.9375rem', color: '#6B5B4B', marginBottom: '1.75rem' }}>
          {success ? 'Password updated!' : 'Set a new password'}
        </p>

        {/* ── Success state ── */}
        {success ? (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>

            <div style={{
              width: '4.5rem',
              height: '4.5rem',
              borderRadius: '50%',
              background: 'rgba(34,197,94,0.1)',
              border: '2px solid rgba(34,197,94,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <CheckCircle size={32} color="#22C55E" strokeWidth={1.75} />
            </div>

            <div style={{
              background: '#F0FDF4',
              border: '1px solid #BBF7D0',
              borderRadius: '16px',
              padding: '1.125rem 1.25rem',
              textAlign: 'center',
              width: '100%',
              boxSizing: 'border-box',
            }}>
              <p style={{ fontSize: '0.9375rem', color: '#1C0D07', fontWeight: 600, margin: '0 0 0.375rem' }}>
                Password reset successfully!
              </p>
              <p style={{ fontSize: '0.875rem', color: '#6B5B4B', lineHeight: 1.6, margin: 0 }}>
                Your password has been updated. You can now log in with your new credentials.
              </p>
            </div>

            <p style={{ fontSize: '0.8125rem', color: '#A89080', textAlign: 'center', margin: 0 }}>
              Redirecting to login in <strong style={{ color: ACCENT }}>{redirectSecs}s</strong>…
            </p>

            <Link
              to="/auth/admin"
              replace
              style={{
                width: '100%',
                padding: '0.875rem',
                borderRadius: '14px',
                border: 'none',
                background: '#1E0E07',
                color: '#FFFDF8',
                fontSize: '0.9375rem',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                letterSpacing: '-0.01em',
                boxSizing: 'border-box',
              }}
            >
              Go to Login
            </Link>
          </div>

        ) : (
          /* ── Reset form ── */
          <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* New Password */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#3D1E12' }}>
                New Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={15}
                  color="#A89080"
                  style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                />
                <input
                  type={showNew ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value)
                    if (error) setError('')
                  }}
                  required
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '0.75rem 3rem 0.75rem 2.5rem',
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
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#A89080', display: 'flex', padding: 0 }}
                >
                  {showNew ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>

              {/* Strength bar */}
              {newPassword.length > 0 && (
                <div style={{ marginTop: '0.25rem' }}>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '0.375rem' }}>
                    {[1, 2, 3, 4].map((seg) => (
                      <div key={seg} style={{
                        flex: 1,
                        height: '4px',
                        borderRadius: '2px',
                        background: seg <= strength.level ? strength.color : '#E8DCCF',
                        transition: 'background 300ms',
                      }} />
                    ))}
                  </div>
                  {strength.label && (
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: strength.color }}>
                      {strength.label}
                    </span>
                  )}
                </div>
              )}

              {/* Rules checklist */}
              {rulesVisible && (
                <ul style={{ margin: '0.375rem 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  {RULES.map((rule) => {
                    const passed = rule.test(newPassword)
                    return (
                      <li key={rule.id} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: passed ? '#15803D' : '#A89080' }}>
                        {passed
                          ? <CheckCircle size={13} color="#22C55E" />
                          : <XCircle size={13} color="#D1C4B8" />}
                        {rule.label}
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>

            {/* Confirm Password */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#3D1E12' }}>
                Confirm New Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={15}
                  color="#A89080"
                  style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Re-enter your new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    if (error) setError('')
                  }}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 3rem 0.75rem 2.5rem',
                    borderRadius: '14px',
                    border: `1.5px solid ${confirmPassword ? (passwordsMatch ? '#22C55E' : '#EF4444') : '#E8DCCF'}`,
                    background: '#F3EAE0',
                    fontSize: '0.9375rem',
                    color: '#1C0D07',
                    outline: 'none',
                    transition: 'border-color 150ms',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    if (!confirmPassword) e.target.style.borderColor = ACCENT
                  }}
                  onBlur={(e) => {
                    if (!confirmPassword) e.target.style.borderColor = '#E8DCCF'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#A89080', display: 'flex', padding: 0 }}
                >
                  {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>

              {/* Match hint */}
              {confirmPassword && (
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: passwordsMatch ? '#15803D' : '#DC2626', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  {passwordsMatch
                    ? <><CheckCircle size={13} color="#22C55E" /> Passwords match</>
                    : <><XCircle size={13} color="#EF4444" /> Passwords do not match</>}
                </span>
              )}
            </div>

            {/* Error banner */}
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
              {loading ? 'Resetting…' : 'Reset Password'}
            </button>

            {/* Back link */}
            <p style={{ textAlign: 'center', margin: 0 }}>
              <Link to="/auth/admin" style={{ fontSize: '0.8125rem', color: '#A89080', fontWeight: 600 }}>
                Back to Login
              </Link>
            </p>

          </form>
        )}
      </div>
    </div>
  )
}
