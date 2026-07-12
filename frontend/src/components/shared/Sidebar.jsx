import { AnimatePresence, motion } from 'framer-motion'
import {
  ChartColumnBig,
  ClipboardList,
  Coffee,
  Grid2x2,
  LayoutDashboard,
  LogOut,
  PackageSearch,
  Settings,
  ShieldCheck,
  Users,
  UtensilsCrossed,
} from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Avatar } from '../ui/Avatar'

const adminNav = [
  { section: 'Overview' },
  { to: '/admin/dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
  { to: '/admin/reports',    label: 'Reports',     icon: ChartColumnBig },
  { section: 'Catalog' },
  { to: '/admin/menu',       label: 'Menu',        icon: UtensilsCrossed },
  { to: '/admin/categories', label: 'Categories',  icon: Grid2x2 },
  { to: '/admin/inventory',  label: 'Inventory',   icon: PackageSearch },
  { section: 'Operations' },
  { to: '/admin/orders',     label: 'Orders',      icon: ClipboardList },
  { to: '/admin/staff',      label: 'Staff',       icon: Users },
  { section: 'Account' },
  { to: '/admin/settings',   label: 'Settings',    icon: Settings },
  { to: '/admin/profile',    label: 'My Profile',  icon: ShieldCheck },
]

export function Sidebar({ role = 'admin', open, onClose }) {
  const { staff, logout } = useAuth()
  const navigate = useNavigate()
  const panelLabel = role === 'staff' ? 'Staff Panel' : 'Admin Panel'

  const handleLogout = async () => {
    await logout()
    navigate('/auth/admin')
  }

  const content = (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      {/* Brand */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <Coffee size={16} />
        </div>
        <div>
          <div className="sidebar-brand">CafeX</div>
          <div className="sidebar-role">{panelLabel}</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {adminNav.map((item, i) => {
          if (item.section) {
            return (
              <div key={`sec-${i}`} className="sidebar-section-label">
                {item.section}
              </div>
            )
          }
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <Icon size={16} style={{ flexShrink: 0 }} />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.625rem',
          padding: '0.625rem 0.75rem',
          borderRadius: 'var(--radius-sm)',
          background: 'var(--sidebar-surface)',
          marginBottom: '0.5rem',
        }}>
          <Avatar name={staff?.full_name ?? 'User'} size="sm" />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--sidebar-text)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {staff?.full_name ?? 'Admin User'}
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--sidebar-muted)', marginTop: '1px' }}>
              {staff?.email}
            </div>
          </div>
        </div>

        <button
          className="nav-link"
          onClick={handleLogout}
          type="button"
          style={{ width: '100%', color: 'var(--sidebar-muted)' }}
        >
          <LogOut size={15} />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  )

  return (
    <>
      {content}
      <AnimatePresence>
        {open && (
          <motion.div
            className="sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>
    </>
  )
}
