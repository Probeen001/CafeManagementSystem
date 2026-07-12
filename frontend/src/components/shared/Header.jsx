import { Bell, Menu, Settings } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { Avatar } from '../ui/Avatar'
import { Link } from 'react-router-dom'

export function Header({ onMenuClick, title, subtitle }) {
  const { staff } = useAuth()
  const isAdmin = staff?.role === 'admin'

  return (
    <header className="topbar">
      {/* Mobile menu toggle */}
      <button
        className="btn btn-ghost btn-icon mobile-only"
        onClick={onMenuClick}
        type="button"
        aria-label="Open menu"
        style={{ marginRight: '0.125rem' }}
      >
        <Menu size={18} color="var(--muted)" />
      </button>

      {/* Page title */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && (
          <h1 style={{
            fontSize: '1rem',
            fontWeight: 700,
            color: 'var(--text)',
            letterSpacing: '-0.02em',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {title}
          </h1>
        )}
        {subtitle && (
          <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '1px' }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
        <Link
          to={isAdmin ? '/admin/profile' : '/staff/profile'}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '2.125rem',
            height: '2.125rem',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--surface-secondary)',
            color: 'var(--muted)',
            border: '1px solid var(--border)',
          }}
        >
          <Bell size={15} />
        </Link>

        <Link
          to={isAdmin ? '/admin/settings' : '/staff/profile'}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '2.125rem',
            height: '2.125rem',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--surface-secondary)',
            color: 'var(--muted)',
            border: '1px solid var(--border)',
          }}
          className="desktop-only"
        >
          <Settings size={15} />
        </Link>

        <Link
          to={isAdmin ? '/admin/profile' : '/staff/profile'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.25rem 0.625rem 0.25rem 0.25rem',
            borderRadius: 'var(--radius-full)',
            background: 'var(--surface-secondary)',
            border: '1px solid var(--border)',
            textDecoration: 'none',
          }}
        >
          <Avatar name={staff?.full_name ?? 'U'} size="sm" />
          <div className="desktop-only">
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1.2 }}>
              {staff?.full_name?.split(' ')[0] ?? 'User'}
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--muted)' }}>
              {staff?.role}
            </div>
          </div>
        </Link>
      </div>
    </header>
  )
}
