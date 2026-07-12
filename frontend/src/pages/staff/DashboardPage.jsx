import { motion } from 'framer-motion'
import {
  ArrowRight, CheckCircle, Circle, ClipboardList,
  Clock, Coffee, TrendingUp,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { StatusBadge } from '../../components/ui/Badge'
import { useAuth } from '../../contexts/AuthContext'

const LIVE_ORDERS = [
  { id: '#1034', status: 'New',      time: '11:30 AM', items: 'Cappuccino, Burger',   amount: 'Rs 270' },
  { id: '#1033', status: 'Preparing',time: '11:20 AM', items: 'Cold Coffee, Brownie', amount: 'Rs 210' },
  { id: '#1032', status: 'Ready',    time: '11:10 AM', items: 'Latte, Sandwich',      amount: 'Rs 150' },
]

export default function StaffDashboardPage() {
  const { staff } = useAuth()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div style={{ minHeight: '100svh', background: 'var(--background)' }}>
      {/* Header */}
      <div style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        padding: '1rem',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        boxShadow: 'var(--shadow-xs)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{
              width: '2rem', height: '2rem', borderRadius: 'var(--radius-sm)',
              background: '#1E0E07',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Coffee size={14} color="#F8F1E8" />
            </div>
            <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)', letterSpacing: '-0.025em' }}>
              CafeX
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              padding: '0.25rem 0.625rem',
              borderRadius: 'var(--radius-full)',
              background: 'var(--primary-10)',
              border: '1px solid var(--primary-20)',
              fontSize: '0.6875rem',
              fontWeight: 700,
              color: 'var(--primary)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}>
              Staff
            </div>
            <Link to="/staff/profile" style={{
              width: '2.25rem', height: '2.25rem',
              borderRadius: '50%',
              background: 'var(--primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 800, fontSize: '0.875rem',
            }}>
              {(staff?.full_name?.[0] ?? 'S').toUpperCase()}
            </Link>
          </div>
        </div>
      </div>

      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Greeting */}
        <div>
          <h1 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em' }}>
            {greeting}, {staff?.full_name?.split(' ')[0] ?? 'Staff'}!
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
            Here&apos;s your workspace for today.
          </p>
        </div>

        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          {[
            { label: "Open Orders",     value: '8',           icon: ClipboardList, color: '#2E7D32', bg: 'rgba(46,125,50,0.1)' },
            { label: "Completed",        value: '42',          icon: CheckCircle,   color: '#2563EB', bg: '#EFF6FF' },
            { label: "In Progress",      value: '3',           icon: Clock,         color: '#D97706', bg: '#FFFBEB' },
            { label: "Today's Sales",    value: 'Rs 12,430',    icon: TrendingUp,    color: '#F97316', bg: 'rgba(249,115,22,0.1)' },
          ].map((m, i) => {
            const Icon = m.icon
            return (
              <motion.div
                key={m.label}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '1rem',
                  boxShadow: 'var(--shadow-card)',
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <div style={{
                  width: '2.25rem', height: '2.25rem',
                  borderRadius: 'var(--radius-md)',
                  background: m.bg, color: m.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '0.625rem',
                }}>
                  <Icon size={16} />
                </div>
                <div style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.04em' }}>
                  {m.value}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '2px' }}>
                  {m.label}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Order Status Overview */}
        <motion.div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            padding: '1.125rem',
            boxShadow: 'var(--shadow-card)',
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
            <h2 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text)' }}>
              Order Status Overview
            </h2>
            <span style={{
              display: 'flex', alignItems: 'center', gap: '0.375rem',
              fontSize: '0.6875rem', color: 'var(--success-text)', fontWeight: 700,
            }}>
              <Circle size={6} fill="currentColor" />
              Live
            </span>
          </div>

          {/* Status bars */}
          {[
            { label: 'New',       count: 8,  color: '#2563EB', total: 42 },
            { label: 'Preparing', count: 3,  color: '#D97706', total: 42 },
            { label: 'Ready',     count: 4,  color: '#16A34A', total: 42 },
            { label: 'Completed', count: 27, color: '#6B5B4B', total: 42 },
          ].map((s) => (
            <div key={s.label} style={{ marginBottom: '0.625rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>{s.label}</span>
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text)' }}>{s.count}</span>
              </div>
              <div style={{ height: '6px', borderRadius: '99px', background: 'var(--surface-secondary)' }}>
                <div style={{
                  height: '100%',
                  width: `${(s.count / s.total) * 100}%`,
                  borderRadius: '99px',
                  background: s.color,
                  transition: 'width 0.8s ease',
                }} />
              </div>
            </div>
          ))}
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            padding: '1.125rem',
            boxShadow: 'var(--shadow-card)',
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
            <h2 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text)' }}>Recent Orders</h2>
            <Link to="/staff/orders" style={{
              fontSize: '0.8125rem', color: 'var(--primary)', fontWeight: 700,
              display: 'flex', alignItems: 'center', gap: '0.25rem',
            }}>
              View all <ArrowRight size={13} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {LIVE_ORDERS.map((order) => (
              <div key={order.id} style={{
                display: 'flex', alignItems: 'center', gap: '0.875rem',
                padding: '0.75rem',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--surface-secondary)',
                border: order.status === 'Ready' ? '1px solid var(--success-border)' : '1px solid transparent',
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text)' }}>{order.id}</span>
                    <StatusBadge status={order.status} />
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                    {order.items} · {order.time}
                  </div>
                </div>
                <div style={{ fontWeight: 700, color: 'var(--text)', flexShrink: 0 }}>{order.amount}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            padding: '1.125rem',
            boxShadow: 'var(--shadow-card)',
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.875rem' }}>
            Quick Actions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Link to="/staff/pos" className="btn btn-primary"
              style={{ justifyContent: 'flex-start', gap: '0.75rem', padding: '0.875rem 1rem' }}>
              <Coffee size={16} />
              <span style={{ flex: 1 }}>Open POS</span>
              <ArrowRight size={14} style={{ opacity: 0.7 }} />
            </Link>
            <Link to="/staff/orders" className="btn btn-secondary"
              style={{ justifyContent: 'flex-start', gap: '0.75rem', padding: '0.875rem 1rem' }}>
              <ClipboardList size={16} />
              <span style={{ flex: 1 }}>View Orders</span>
              <ArrowRight size={14} style={{ opacity: 0.7 }} />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
