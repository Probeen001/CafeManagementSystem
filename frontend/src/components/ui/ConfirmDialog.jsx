import { AlertTriangle } from 'lucide-react'
import { Spinner } from './Spinner'
import { Modal } from './Modal'

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Confirm action',
  description = 'Are you sure you want to proceed?',
  confirmLabel = 'Confirm',
  variant = 'danger',
  loading = false,
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <button className="btn-secondary btn" onClick={onClose} type="button" disabled={loading}>
            Cancel
          </button>
          <button
            className={variant === 'danger' ? 'btn-danger btn' : 'btn-primary btn'}
            onClick={onConfirm}
            type="button"
            disabled={loading}
          >
            {loading && <Spinner size="sm" />}
            {confirmLabel}
          </button>
        </>
      }
    >
      <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
        <div
          style={{
            flexShrink: 0,
            width: '2.25rem',
            height: '2.25rem',
            borderRadius: 'var(--radius)',
            background: variant === 'danger' ? 'var(--danger-bg)' : 'var(--warning-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: variant === 'danger' ? 'var(--danger)' : 'var(--warning)',
          }}
        >
          <AlertTriangle size={18} />
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.6 }}>
          {description}
        </p>
      </div>
    </Modal>
  )
}
