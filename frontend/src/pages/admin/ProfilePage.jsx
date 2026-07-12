import { motion } from 'framer-motion'
import { Eye, EyeOff, Save, Shield } from 'lucide-react'
import { useState } from 'react'
import { Avatar } from '../../components/ui/Avatar'
import { Badge } from '../../components/ui/Badge'
import { PageHeader } from '../../components/shared/PageHeader'
import { Spinner } from '../../components/ui/Spinner'
import { useAuth } from '../../contexts/AuthContext'

function Section({ title, description, children }) {
  return (
    <motion.div className="card" style={{ padding: '1.375rem' }}
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
        <h2 className="section-title">{title}</h2>
        {description && <p className="section-subtitle">{description}</p>}
      </div>
      {children}
    </motion.div>
  )
}

export default function ProfilePage() {
  const { staff } = useAuth()

  const [fullName, setFullName] = useState(staff?.full_name ?? '')
  const [email,    setEmail]    = useState(staff?.email    ?? '')
  const [phone,    setPhone]    = useState(staff?.phone    ?? '')
  const [saving,   setSaving]   = useState(false)
  const [saved,    setSaved]    = useState(false)

  const [currentPw, setCurrentPw] = useState('')
  const [newPw,     setNewPw]     = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [showPw,    setShowPw]    = useState(false)
  const [pwError,   setPwError]   = useState('')
  const [pwSaving,  setPwSaving]  = useState(false)

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    await new Promise((r) => setTimeout(r, 800))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setPwError('')
    if (newPw !== confirmPw) { setPwError('Passwords do not match.'); return }
    if (newPw.length < 8)    { setPwError('Password must be at least 8 characters.'); return }
    setPwSaving(true)
    await new Promise((r) => setTimeout(r, 900))
    setPwSaving(false)
    setCurrentPw(''); setNewPw(''); setConfirmPw('')
    alert('Password updated successfully.')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader title="My Profile" description="Manage your account details and security settings." />

      {/* Avatar + role banner */}
      <motion.div className="card" style={{ padding: '1.375rem' }}
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <Avatar name={staff?.full_name ?? 'U'} size="xl" />
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.125rem' }}>{staff?.full_name}</div>
            <div style={{ color: 'var(--muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>{staff?.email}</div>
            <div style={{ marginTop: '0.625rem' }}>
              <Badge variant={staff?.role === 'admin' ? 'info' : 'neutral'}>
                <Shield size={10} /> {staff?.role === 'admin' ? 'Administrator' : 'Staff Member'}
              </Badge>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="two-col">
        {/* Personal info form */}
        <Section title="Personal Information" description="Update your display name, email, and phone.">
          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <div className="field">
              <label className="label">Full Name</label>
              <input className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>
            <div className="field">
              <label className="label">Email</label>
              <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="field">
              <label className="label">Phone</label>
              <input className="input" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                placeholder="98XXXXXXXX" />
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <Spinner size="sm" /> : <Save size={14} />}
              {saved ? 'Saved!' : 'Save Changes'}
            </button>
          </form>
        </Section>

        {/* Password */}
        <Section title="Change Password" description="Use a strong password with at least 8 characters.">
          <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <div className="field">
              <label className="label">Current Password</label>
              <div style={{ position: 'relative' }}>
                <input className="input" type={showPw ? 'text' : 'password'} value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)} required
                  style={{ paddingRight: '2.75rem' }} />
                <button type="button" onClick={() => setShowPw((v) => !v)}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: '0.25rem' }}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <div className="field">
              <label className="label">New Password</label>
              <input className="input" type={showPw ? 'text' : 'password'} value={newPw}
                onChange={(e) => setNewPw(e.target.value)} required minLength={8} />
            </div>
            <div className="field">
              <label className="label">Confirm New Password</label>
              <input className="input" type={showPw ? 'text' : 'password'} value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)} required />
            </div>

            {pwError && (
              <div style={{
                padding: '0.625rem 0.875rem', borderRadius: 'var(--radius)',
                background: 'var(--danger-bg)', border: '1px solid var(--danger-border)',
                fontSize: '0.8125rem', color: 'var(--danger-text)',
              }}>
                {pwError}
              </div>
            )}

            <button type="submit" className="btn btn-primary" disabled={pwSaving || !currentPw || !newPw || !confirmPw}>
              {pwSaving && <Spinner size="sm" />}
              Update Password
            </button>
          </form>
        </Section>
      </div>
    </div>
  )
}
