import { motion } from 'framer-motion'
import {
  ChartColumnBig,
  Download,
  FileText,
  TrendingDown,
  TrendingUp,
  Printer,
} from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '../../components/shared/PageHeader'
import { MetricCard } from '../../components/shared/MetricCard'
import { RevenueChart, OrdersChart } from '../../components/charts/RevenueChart'
import { Spinner } from '../../components/ui/Spinner'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts'

const DATE_RANGES = [
  { label: 'Today',     value: 'today' },
  { label: 'This Week', value: 'week' },
  { label: 'This Month',value: 'month' },
  { label: 'Last 3M',   value: '3months' },
]

const TOP_ITEMS = [
  { name: 'Chicken Momo',     sold: 684, revenue: 129960 },
  { name: 'Cafe Latte',       sold: 521, revenue: 93780 },
  { name: 'Veg Chowmin',      sold: 448, revenue: 98560 },
  { name: 'Masala Fries',     sold: 390, revenue: 58500 },
  { name: 'Brownie',          sold: 356, revenue: 56960 },
  { name: 'Butter Tea',       sold: 312, revenue: 28080 },
]

const PAYMENT_DATA = [
  { method: 'Cash',   count: 312, pct: 42 },
  { method: 'eSewa',  count: 224, pct: 30 },
  { method: 'Card',   count: 148, pct: 20 },
  { method: 'Khalti', count: 60,  pct: 8 },
]

const COLORS = ['var(--primary)', 'var(--info)', 'var(--warning)', 'var(--success)']

const CustomBarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius)', padding: '0.625rem 0.875rem',
      boxShadow: 'var(--shadow-md)', fontSize: '0.8125rem',
    }}>
      <p style={{ fontWeight: 600, marginBottom: '0.25rem', color: 'var(--text)' }}>{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.fill }}>
          {p.name}: <strong>{p.dataKey === 'revenue' ? `Rs ${p.value.toLocaleString()}` : p.value}</strong>
        </p>
      ))}
    </div>
  )
}

export default function ReportsPage() {
  const [range,     setRange]     = useState('week')
  const [exporting, setExporting] = useState(false)

  const handleExport = async (type) => {
    setExporting(true)
    await new Promise((r) => setTimeout(r, 1200))
    setExporting(false)
    alert(`${type.toUpperCase()} export ready (mock)`)
  }

  const summaryMetrics = [
    { label: 'Total Revenue',  value: 'Rs 3,24,800', icon: TrendingUp,  trend: 14.2, trendLabel: 'vs last week', iconColor: 'var(--success-text)', iconBg: 'var(--success-bg)' },
    { label: 'Total Orders',   value: '744',          icon: ChartColumnBig, trend: 8.7, trendLabel: 'vs last week', iconColor: 'var(--primary)', iconBg: 'var(--primary-10)' },
    { label: 'Avg Order Value',value: 'Rs 437',       icon: TrendingUp,  trend: 4.9,  trendLabel: 'vs last week', iconColor: 'var(--info)', iconBg: 'var(--info-bg)' },
    { label: 'Cancelled',      value: '18',           icon: TrendingDown, trend: -12,  trendLabel: 'vs last week', iconColor: 'var(--danger-text)', iconBg: 'var(--danger-bg)' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader title="Reports & Analytics" description="Revenue, sales trends, and performance insights.">
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => handleExport('csv')} disabled={exporting}>
            {exporting ? <Spinner size="sm" /> : <Download size={13} />} CSV
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => handleExport('pdf')} disabled={exporting}>
            {exporting ? <Spinner size="sm" /> : <Printer size={13} />} PDF
          </button>
        </div>
      </PageHeader>

      {/* Date range selector */}
      <div style={{ display: 'flex', gap: '0.375rem' }}>
        {DATE_RANGES.map(({ label, value }) => (
          <button
            key={value}
            className={`tab ${range === value ? 'active' : ''}`}
            onClick={() => setRange(value)}
            type="button"
            style={{
              background: range === value ? 'var(--primary)' : 'var(--surface)',
              color: range === value ? '#fff' : 'var(--muted)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-full)',
              padding: '0.3125rem 0.875rem',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Summary metrics */}
      <div className="metrics-grid">
        {summaryMetrics.map((m, i) => (
          <MetricCard key={m.label} {...m} index={i} />
        ))}
      </div>

      {/* Revenue + Orders charts */}
      <div className="two-col">
        <motion.div className="card" style={{ padding: '1.25rem' }}
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}>
          <div style={{ marginBottom: '1rem' }}>
            <h2 className="section-title">Revenue Trend</h2>
            <p className="section-subtitle">Daily revenue for the selected period</p>
          </div>
          <RevenueChart height={220} />
        </motion.div>

        <motion.div className="card" style={{ padding: '1.25rem' }}
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}>
          <div style={{ marginBottom: '1rem' }}>
            <h2 className="section-title">Order Volume</h2>
            <p className="section-subtitle">Number of orders per day</p>
          </div>
          <OrdersChart height={220} />
        </motion.div>
      </div>

      {/* Top items + Payment breakdown */}
      <div className="two-col">
        <motion.div className="card" style={{ padding: '1.25rem' }}
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}>
          <div style={{ marginBottom: '1rem' }}>
            <h2 className="section-title">Top Selling Items</h2>
            <p className="section-subtitle">Best performers this period</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={TOP_ITEMS} layout="vertical" margin={{ left: 8, right: 16 }}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="4 8" horizontal={false} />
              <XAxis type="number" axisLine={false} tickLine={false}
                tick={{ fill: 'var(--muted)', fontSize: 11 }}
                tickFormatter={(v) => `${v}`} />
              <YAxis type="category" dataKey="name" axisLine={false} tickLine={false}
                tick={{ fill: 'var(--text)', fontSize: 11 }} width={100} />
              <Tooltip content={<CustomBarTooltip />} />
              <Bar dataKey="sold" name="Sold" radius={[0, 4, 4, 0]}>
                {TOP_ITEMS.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? 'var(--primary)' : 'var(--primary-20)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div className="card" style={{ padding: '1.25rem' }}
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <h2 className="section-title">Payment Methods</h2>
            <p className="section-subtitle">Distribution across payment types</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {PAYMENT_DATA.map((p, i) => (
              <div key={p.method}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{p.method}</span>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>
                    {p.count} orders · {p.pct}%
                  </span>
                </div>
                <div style={{ height: '0.375rem', borderRadius: 'var(--radius-full)', background: 'var(--surface-secondary)' }}>
                  <motion.div
                    style={{ height: '100%', borderRadius: 'var(--radius-full)', background: COLORS[i] }}
                    initial={{ width: 0 }}
                    animate={{ width: `${p.pct}%` }}
                    transition={{ delay: 0.3 + i * 0.07, duration: 0.6, ease: 'easeOut' }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Revenue by category */}
          <div style={{ marginTop: '1.5rem' }}>
            <h3 className="section-title" style={{ marginBottom: '0.875rem' }}>Revenue by Category</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              {[
                { cat: 'Momo',    rev: 129960, pct: 40 },
                { cat: 'Drinks',  rev: 93780,  pct: 29 },
                { cat: 'Chowmin', rev: 58560,  pct: 18 },
                { cat: 'Snacks',  rev: 28500,  pct: 9 },
                { cat: 'Desserts',rev: 12960,  pct: 4 },
              ].map((r) => (
                <div key={r.cat} style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.5rem 0.75rem', borderRadius: 'var(--radius)',
                  background: 'var(--surface-secondary)',
                }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 500, flex: 1 }}>{r.cat}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Rs {r.rev.toLocaleString()}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)', width: '2.5rem', textAlign: 'right' }}>
                    {r.pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Export panel */}
      <motion.div className="card" style={{ padding: '1.25rem' }}
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <h2 className="section-title">Export Reports</h2>
            <p className="section-subtitle">Download detailed reports for the selected period</p>
          </div>
          <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
            {[
              { label: 'Revenue Report',  icon: Download },
              { label: 'Order Summary',   icon: FileText },
              { label: 'Staff Report',    icon: FileText },
              { label: 'Tax Summary',     icon: Printer },
            ].map(({ label, icon: Icon }) => (
              <button key={label} className="btn btn-secondary btn-sm"
                onClick={() => handleExport(label)} disabled={exporting} type="button">
                <Icon size={13} /> {label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
