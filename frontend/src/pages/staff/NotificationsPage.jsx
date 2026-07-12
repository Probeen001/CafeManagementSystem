import { Bell, CheckCircle, AlertTriangle, Package, ShoppingBag } from 'lucide-react'

const NOTIFICATIONS = [
  {
    id: 1,
    type: 'order',
    icon: ShoppingBag,
    iconColor: '#2E7D32',
    iconBg: 'rgba(46,125,50,0.1)',
    title: 'Order #1026 completed',
    message: 'Order has been marked as completed successfully.',
    time: '11:35 AM',
    read: false,
  },
  {
    id: 2,
    type: 'stock',
    icon: AlertTriangle,
    iconColor: '#D97706',
    iconBg: '#FFFBEB',
    title: 'Low stock: Milk',
    message: 'Only 2L remaining. Please restock soon.',
    time: '11:20 AM',
    read: false,
  },
  {
    id: 3,
    type: 'order',
    icon: Package,
    iconColor: '#2563EB',
    iconBg: '#EFF6FF',
    title: 'New order received',
    message: 'Order #1025 has been placed by a customer.',
    time: '11:15 AM',
    read: true,
  },
  {
    id: 4,
    type: 'payment',
    icon: CheckCircle,
    iconColor: '#16A34A',
    iconBg: '#F0FDF4',
    title: 'Payment received',
    message: 'Payment for Order #1023 confirmed via UPI.',
    time: '11:00 AM',
    read: true,
  },
]

export default function NotificationsPage() {
  return (
    <div style={{ minHeight: '100svh', background: 'var(--background)' }}>
      {/* Header */}
      <div style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        padding: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <div style={{
          width: '2.25rem', height: '2.25rem',
          borderRadius: 'var(--radius-md)',
          background: 'var(--primary-10)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--primary)',
        }}>
          <Bell size={18} />
        </div>
        <div>
          <h1 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)' }}>
            Notifications
          </h1>
          <p style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
            {NOTIFICATIONS.filter(n => !n.read).length} unread
          </p>
        </div>
      </div>

      {/* List */}
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        {NOTIFICATIONS.map((notif) => {
          const Icon = notif.icon
          return (
            <div
              key={notif.id}
              style={{
                background: 'var(--surface)',
                border: `1px solid ${notif.read ? 'var(--border)' : 'var(--primary-20)'}`,
                borderRadius: 'var(--radius-xl)',
                padding: '1rem',
                display: 'flex',
                gap: '0.875rem',
                alignItems: 'flex-start',
                position: 'relative',
              }}
            >
              {/* Icon */}
              <div style={{
                width: '2.5rem', height: '2.5rem', borderRadius: 'var(--radius-md)',
                background: notif.iconBg, color: notif.iconColor,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon size={16} />
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <h3 style={{
                    fontSize: '0.875rem',
                    fontWeight: notif.read ? 500 : 700,
                    color: 'var(--text)',
                  }}>
                    {notif.title}
                  </h3>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--muted)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                    {notif.time}
                  </span>
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--muted)', marginTop: '0.25rem', lineHeight: 1.5 }}>
                  {notif.message}
                </p>
              </div>

              {/* Unread dot */}
              {!notif.read && (
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'var(--primary)',
                }} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
