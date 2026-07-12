const variants = {
  success: 'badge-success',
  warning: 'badge-warning',
  danger:  'badge-danger',
  info:    'badge-info',
  neutral: 'badge-neutral',
}

const statusMap = {
  /* Order statuses */
  new:        'info',
  pending:    'info',
  preparing:  'warning',
  ready:      'success',
  completed:  'neutral',
  cancelled:  'danger',
  /* User/item statuses */
  active:     'success',
  available:  'success',
  inactive:   'neutral',
  disabled:   'neutral',
  unavailable:'danger',
  /* Inventory */
  in_stock:   'success',
  low_stock:  'warning',
  out_of_stock:'danger',
  /* Payment */
  paid:       'success',
  failed:     'danger',
}

export function Badge({ variant = 'neutral', children, className = '' }) {
  return (
    <span className={`badge ${variants[variant] ?? variants.neutral} ${className}`}>
      {children}
    </span>
  )
}

export function StatusBadge({ status }) {
  const key = String(status ?? '').toLowerCase().replace(/\s+/g, '_')
  const variant = statusMap[key] ?? 'neutral'
  const label = String(status ?? '').replace(/_/g, ' ')
  return (
    <Badge variant={variant}>{label}</Badge>
  )
}
