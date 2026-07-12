export function PageHeader({ title, description, children }) {
  return (
    <div className="page-header">
      <div className="page-header-left">
        <h1 className="page-title">{title}</h1>
        {description && (
          <p style={{ fontSize: '0.8125rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
            {description}
          </p>
        )}
      </div>
      {children && <div className="page-header-right">{children}</div>}
    </div>
  )
}
