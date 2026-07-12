import { motion } from 'framer-motion'
import { TrendingDown, TrendingUp } from 'lucide-react'

export function MetricCard({
  label,
  value,
  icon: Icon,
  iconColor = 'var(--primary)',
  iconBg = 'var(--primary-10)',
  trend,
  trendLabel,
  index = 0,
}) {
  const trendPositive = trend > 0
  const trendColor = trendPositive ? 'var(--success-text)' : 'var(--danger-text)'
  const TrendIcon = trendPositive ? TrendingUp : TrendingDown

  return (
    <motion.div
      className="card"
      style={{ padding: '1.125rem 1.25rem' }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <p className="metric-label">{label}</p>
          <p className="metric-value" style={{ marginTop: '0.375rem' }}>{value}</p>
          {trend !== undefined && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                marginTop: '0.5rem',
                fontSize: '0.75rem',
                color: trendColor,
                fontWeight: 600,
              }}
            >
              <TrendIcon size={13} />
              <span>{trendPositive ? '+' : ''}{trend}%</span>
              {trendLabel && (
                <span style={{ color: 'var(--muted)', fontWeight: 400 }}>{trendLabel}</span>
              )}
            </div>
          )}
        </div>
        {Icon && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: 'var(--radius)',
              background: iconBg,
              color: iconColor,
              flexShrink: 0,
            }}
          >
            <Icon size={18} />
          </div>
        )}
      </div>
    </motion.div>
  )
}
