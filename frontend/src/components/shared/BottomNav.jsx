import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Coffee,
  ClipboardList,
  Bell,
  User,
} from 'lucide-react'

const tabs = [
  { to: '/staff/dashboard',      label: 'Home',    icon: LayoutDashboard },
  { to: '/staff/orders',         label: 'Orders',  icon: ClipboardList },
  { to: '/staff/pos',            label: 'POS',     icon: Coffee, primary: true },
  { to: '/staff/notifications',  label: 'Alerts',  icon: Bell },
  { to: '/staff/profile',        label: 'Profile', icon: User },
]

export function BottomNav() {
  return (
    <nav className="bottom-nav">
      {tabs.map(({ to, label, icon: Icon, primary }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
        >
          {({ isActive }) => (
            <>
              <div
                className="bottom-nav-icon"
                style={primary ? {
                  background: isActive ? 'var(--primary)' : 'var(--primary-10)',
                  borderRadius: '14px',
                  width: '2.5rem',
                  height: '2.5rem',
                } : {}}
              >
                <Icon
                  size={primary ? 20 : 18}
                  style={{ color: primary ? (isActive ? '#fff' : 'var(--primary)') : 'inherit' }}
                />
              </div>
              {!primary && <span>{label}</span>}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
