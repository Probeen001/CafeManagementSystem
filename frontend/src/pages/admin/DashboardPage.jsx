import { motion } from 'framer-motion'
import {
  ClipboardList, TrendingUp, Users, Wallet, ArrowRight,
  Circle, Coffee, ShoppingBag, CreditCard,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { MetricCard } from '../../components/shared/MetricCard'
import { PageHeader } from '../../components/shared/PageHeader'
import { RevenueChart, OrdersChart } from '../../components/charts/RevenueChart'
import { StatusBadge } from '../../components/ui/Badge'

const metrics = [
  {
    label: 'Total Sales',
    value: '₹ 24,350',
    icon: Wallet,
    trend: 12.9,
    trendLabel: 'vs yesterday',
    iconColor: '#F97316',
    iconBg: 'rgba(249,115,22,0.1)',
  },
  {
    label: 'Orders Today',
    value: '128',
    icon: ClipboardList,
    trend: 8.2,
    trendLabel: 'vs yesterday',
    iconColor: '#2563EB',
    iconBg: '#EFF6FF',
  },
  {
    label: 'Total Staff',
    value: '12',
    icon: Users,
    trendLabel: 'Active',
    iconColor: '#16A34A',
    iconBg: '#F0FDF4',
  },
  {
    label: 'Avg Order',
    value: '₹ 190',
    icon: TrendingUp,
    trend: -3.2,
    trendLabel: 'vs yesterday',
    iconColor: '#D97706',
    iconBg: '#FFFBEB',
  },
]

const recentOrders = [
  { id: '#1024', time: '11:30 AM', amount: '₹ 270',  status: 'New',       items: 2 },
  { id: '#1023', time: '11:20 AM', amount: '₹ 210',  status: 'Preparing', items: 2 },
  { id: '#1022', time: '11:10 AM', amount: '₹ 100',  status: 'Ready',     items: 1 },
  { id: '#1021', time: '10:55 AM', amount: '₹ 260',  status: 'Completed', items: 3 },
]

const topItems = [
  { rank: 1, name: 'Cappuccino',    category: 'Coffee',    cups: '120 Cups' },
  { rank: 2, name: 'Cold Coffee',   category: 'Beverage',  cups: '80 Orders' },
  { rank: 3, name: 'Burger',        category: 'Snacks',    cups: '60 Orders' },
  { rank: 4, name: 'Sandwich',      category: 'Snacks',    cups: '45 Orders' },
]

const quickActions = [
  { label: 'View All Orders', to: '/admin/orders',  icon: ClipboardList },
  { label: 'Manage Menu',     to: '/admin/menu',    icon: ShoppingBag },
  { label: 'Staff List',      to: '/admin/staff',   icon: Users },
  { label: 'Reports',         to: '/admin/reports', icon: CreditCard },
]

export default function DashboardPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader
        title="Dashboard"
        description={`Good morning! Here's what's happening at your cafe today.`}
      >
        <Link to="/admin/reports" className="btn btn-secondary btn-sm">
          View Reports
        </Link>
        <Link to="/admin/staff" className="btn btn-primary btn-sm">
          + Add Staff
        </Link>
      </PageHeader>

      {/* Metrics */}
      <div className="metrics-grid">
        {metrics.map((m, i) => (
          <MetricCard key={m.label} {...m} index={i} />
        ))}
      </div>

      {/* Charts */}
      <div className="dashboard-grid">
        <motion.div
          className="card"
          style={{ padding: '1.5rem' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h2 className="section-title">Sales Overview</h2>
              <p className="section-subtitle">Last 7 days</p>
            </div>
            <span className="badge badge-success">
              <Circle size={6} fill="currentColor" /> Live
            </span>
          </div>
          <RevenueChart height={200} />
        </motion.div>

        <motion.div
          className="card"
          style={{ padding: '1.5rem' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
        >
          <div style={{ marginBottom: '1.25rem' }}>
            <h2 className="section-title">Quick Actions</h2>
            <p className="section-subtitle">Jump to any section</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {quickActions.map(({ label, to, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="btn btn-secondary"
                style={{ justifyContent: 'flex-start', gap: '0.75rem', padding: '0.75rem 1rem' }}
              >
                <Icon size={15} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <span style={{ flex: 1, textAlign: 'left' }}>{label}</span>
                <ArrowRight size={13} style={{ color: 'var(--muted)' }} />
              </Link>
            ))}
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <h2 className="section-title" style={{ marginBottom: '1rem' }}>Order Activity</h2>
            <OrdersChart height={130} />
          </div>
        </motion.div>
      </div>

      {/* Recent orders + Top items */}
      <div className="two-col">
        <motion.div
          className="card"
          style={{ padding: '1.5rem' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <h2 className="section-title">Recent Orders</h2>
              <p className="section-subtitle">Latest transactions</p>
            </div>
            <Link to="/admin/orders" style={{ fontSize: '0.8125rem', color: 'var(--primary)', fontWeight: 700 }}>
              View all
            </Link>
          </div>

          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Time</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <span style={{ fontWeight: 700, color: 'var(--text)' }}>{o.id}</span>
                    </td>
                    <td style={{ color: 'var(--muted)' }}>{o.time}</td>
                    <td style={{ fontWeight: 700 }}>{o.amount}</td>
                    <td>
                      <StatusBadge status={o.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div
          className="card"
          style={{ padding: '1.5rem' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.25 }}
        >
          <div style={{ marginBottom: '1rem' }}>
            <h2 className="section-title">Top Selling Items</h2>
            <p className="section-subtitle">Best performers today</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {topItems.map((item) => (
              <div
                key={item.rank}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.875rem',
                  padding: '0.875rem',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--surface-secondary)',
                  border: '1px solid var(--border)',
                }}
              >
                <div style={{
                  width: '2.25rem', height: '2.25rem',
                  borderRadius: 'var(--radius-sm)',
                  background: item.rank === 1 ? 'var(--primary)' : 'var(--surface)',
                  border: item.rank !== 1 ? '1px solid var(--border)' : 'none',
                  color: item.rank === 1 ? '#fff' : 'var(--muted)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.875rem', fontWeight: 800, flexShrink: 0,
                }}>
                  {item.rank === 1 ? <Coffee size={14} /> : item.rank}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '0.875rem', fontWeight: 700, color: 'var(--text)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '1px' }}>
                    {item.category}
                  </div>
                </div>
                <div style={{
                  fontSize: '0.8125rem', fontWeight: 700,
                  color: 'var(--primary)', whiteSpace: 'nowrap',
                }}>
                  {item.cups}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
