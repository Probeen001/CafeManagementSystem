import { PackageSearch } from 'lucide-react'

export function EmptyState({
  icon: Icon = PackageSearch,
  title = 'No results',
  description = 'Nothing to show here yet.',
  action,
}) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <Icon size={22} />
      </div>
      <div>
        <p style={{ fontWeight: 600, color: 'var(--text)', marginBottom: '0.25rem' }}>{title}</p>
        <p style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>{description}</p>
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
