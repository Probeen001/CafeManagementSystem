import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const mockWeekly = [
  { day: 'Mon', revenue: 18400, orders: 42 },
  { day: 'Tue', revenue: 23200, orders: 58 },
  { day: 'Wed', revenue: 19800, orders: 49 },
  { day: 'Thu', revenue: 27600, orders: 67 },
  { day: 'Fri', revenue: 31400, orders: 78 },
  { day: 'Sat', revenue: 38200, orders: 94 },
  { day: 'Sun', revenue: 29500, orders: 72 },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '0.625rem 0.875rem',
        boxShadow: 'var(--shadow-md)',
        fontSize: '0.8125rem',
      }}
    >
      <p style={{ fontWeight: 600, marginBottom: '0.25rem', color: 'var(--text)' }}>{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: <strong>{p.dataKey === 'revenue' ? `Rs ${p.value.toLocaleString()}` : p.value}</strong>
        </p>
      ))}
    </div>
  )
}

export function RevenueChart({ data = mockWeekly, height = 240 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="var(--primary)" stopOpacity={0.3} />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="ordGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="var(--info)" stopOpacity={0.25} />
            <stop offset="100%" stopColor="var(--info)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid
          stroke="var(--border)"
          strokeDasharray="4 8"
          vertical={false}
        />
        <XAxis
          dataKey="day"
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'var(--muted)', fontSize: 11 }}
          dy={6}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'var(--muted)', fontSize: 11 }}
          tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--border)', strokeWidth: 1 }} />
        <Area
          type="monotone"
          dataKey="revenue"
          name="Revenue"
          stroke="var(--primary)"
          strokeWidth={2}
          fill="url(#revGrad)"
          dot={false}
          activeDot={{ r: 4, fill: 'var(--primary)', strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function OrdersChart({ data = mockWeekly, height = 200 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="ordGrad2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="var(--info)" stopOpacity={0.3} />
            <stop offset="100%" stopColor="var(--info)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="var(--border)" strokeDasharray="4 8" vertical={false} />
        <XAxis
          dataKey="day"
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'var(--muted)', fontSize: 11 }}
          dy={6}
        />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted)', fontSize: 11 }} />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--border)', strokeWidth: 1 }} />
        <Area
          type="monotone"
          dataKey="orders"
          name="Orders"
          stroke="var(--info)"
          strokeWidth={2}
          fill="url(#ordGrad2)"
          dot={false}
          activeDot={{ r: 4, fill: 'var(--info)', strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
