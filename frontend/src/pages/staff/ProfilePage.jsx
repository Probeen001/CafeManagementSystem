import { useState } from 'react'
import { ChevronRight, Globe, Key, LogOut, Save, User } from 'lucide-react'
import { Avatar } from '../../components/ui/Avatar'
import { Badge } from '../../components/ui/Badge'
import { Spinner } from '../../components/ui/Spinner'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

function MenuItem({ icon: Icon, label, value, onClick, danger }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="profile-menu-item"
      style={{ background: 'var(--surface)', color: danger ? 'var(--danger)' : 'var(--text)', width: '100%', textAlign: 'left' }}
    >
      <div style={{
        width: '2.25rem', height: '2.25rem', borderRadius: 'var(--radius-md)',
        background: danger ? 'var(--danger-bg)' : 'var(--surface-secondary)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: danger ? 'var(--danger)' : 'var(--primary)',
        flexShrink: 0,
      }}>
        <Icon size={16} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.9375rem', fontWeight: 600 }}>{label}</div>
        {value && <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '1px' }}>{value}</div>}
      </div>
      <ChevronRight size={16} color="var(--muted)" />
    </button>
  )
}

export default function StaffProfilePage() {
  const { staff, logout } = useAuth()
  const navigate = useNavigate()

  const [fullName, setFullName] = useState(staff?.full_name ?? '')
  const [phone,    setPhone]    = useState(staff?.phone    ?? '')
  const [saving,   setSaving]   = useState(false)
  const [saved,    setSaved]    = useState(false)
  const [editMode, setEditMode] = useState(false)

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    await new Promise((r) => setTimeout(r, 800))
    setSaving(false)
    setSaved(true)
    setEditMode(false)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/auth/staff')
  }

  return (
    <div style={{ minHeight: '100svh', background: 'var(--background)' }}>
      {/* Header */}
      <div style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        padding: '1rem',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <h1 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)' }}>Profile</h1>
      </div>

      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Avatar section */}
        <div style={{
          background: 'var(--surface)',
          borderRadius: 'var(--radius-2xl)',
          border: '1px solid var(--border)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.875rem',
          textAlign: 'center',
          boxShadow: 'var(--shadow-card)',
        }}>
          <div style={{ position: 'relative' }}>
            <Avatar name={staff?.full_name ?? 'S'} size="xl" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text)' }}>
              {staff?.full_name}
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
              {staff?.email}
            </p>
            <div style={{ marginTop: '0.625rem' }}>
              <Badge variant="success">Staff Member</Badge>
            </div>
          </div>
        </div>

        {/* Edit form (shown when editMode) */}
        {editMode && (
          <form
            onSubmit={handleSave}
            style={{
              background: 'var(--surface)',
              borderRadius: 'var(--radius-2xl)',
              border: '1px solid var(--border)',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.875rem',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.25rem' }}>
              Edit Information
            </h3>
            <div className="field">
              <label className="label">Full Name</label>
              <input className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>
            <div className="field">
              <label className="label">Phone</label>
              <input className="input" type="tel" value={phone}
                onChange={(e) => setPhone(e.target.value)} placeholder="98XXXXXXXX" />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="button" className="btn btn-secondary" style={{ flex: 1 }}
                onClick={() => setEditMode(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={saving}>
                {saving ? <Spinner size="sm" /> : <Save size={14} />}
                {saved ? 'Saved!' : 'Save'}
              </button>
            </div>
          </form>
        )}

        {/* Menu items */}
        <div style={{
          background: 'var(--surface)',
          borderRadius: 'var(--radius-2xl)',
          border: '1px solid var(--border)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-card)',
        }}>
          <MenuItem
            icon={User}
            label="Personal Information"
            value={`${staff?.full_name} · ${staff?.phone || 'No phone'}`}
            onClick={() => setEditMode((v) => !v)}
          />
          <MenuItem
            icon={Key}
            label="Change Password"
            value="Update your password"
            onClick={() => {}}
          />
          <MenuItem
            icon={Globe}
            label="Language"
            value="English"
            onClick={() => {}}
          />
        </div>

        {/* Logout */}
        <div style={{
          background: 'var(--surface)',
          borderRadius: 'var(--radius-2xl)',
          border: '1px solid var(--danger-border)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-card)',
        }}>
          <MenuItem
            icon={LogOut}
            label="Logout"
            onClick={handleLogout}
            danger
          />
        </div>
      </div>
    </div>
  )
}
