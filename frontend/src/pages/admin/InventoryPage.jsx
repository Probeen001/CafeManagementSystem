import { motion, AnimatePresence } from 'framer-motion'
import {
  AlertTriangle,
  Edit2,
  PackageSearch,
  Plus,
  RefreshCw,
  Search,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { EmptyState } from '../../components/ui/EmptyState'
import { Modal } from '../../components/ui/Modal'
import { Badge } from '../../components/ui/Badge'
import { PageHeader } from '../../components/shared/PageHeader'

const INITIAL_INVENTORY = [
  { id: 1, name: 'Coffee Beans', unit: 'kg', quantity: 24, threshold: 5, category: 'Beverages', supplier: 'Nepal Coffee Co.' },
  { id: 2, name: 'Milk', unit: 'L', quantity: 8, threshold: 10, category: 'Dairy', supplier: 'Local Farm' },
  { id: 3, name: 'Chocolate Syrup', unit: 'bottles', quantity: 3, threshold: 5, category: 'Syrups', supplier: 'Hersheys' },
  { id: 4, name: 'Flour', unit: 'kg', quantity: 18, threshold: 8, category: 'Dry Goods', supplier: 'Annapurna Mills' },
]

function getStatus(item) {
  if (item.quantity === 0) return { label: 'Out of Stock', variant: 'danger' }
  if (item.quantity <= item.threshold) return { label: 'Low Stock', variant: 'warning' }
  return { label: 'In Stock', variant: 'success' }
}

function RestockModal({ item, onClose, onSave }) {
  const [qty, setQty] = useState('')
  const [note, setNote] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!qty) return
    onSave({ itemId: item.id, quantity: Number(qty), note })
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{
        padding: '0.875rem', borderRadius: 'var(--radius)', background: 'var(--surface-secondary)',
        display: 'flex', alignItems: 'center', gap: '0.75rem',
      }}>
        <RefreshCw size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{item.name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
            Current stock: {item.quantity} {item.unit}
          </div>
        </div>
      </div>

      <div className="field">
        <label className="label">Add quantity ({item.unit})</label>
        <input className="input" type="number" min="1" placeholder="e.g. 10"
          value={qty} onChange={(e) => setQty(e.target.value)} required autoFocus />
      </div>

      <div className="field">
        <label className="label">Note (optional)</label>
        <input className="input" placeholder="Supplier, batch number…"
          value={note} onChange={(e) => setNote(e.target.value)} />
      </div>

      <button type="submit" className="btn btn-primary" disabled={!qty}>
        <RefreshCw size={14} /> Restock
      </button>
    </form>
  )
}

function AdjustModal({ item, onClose, onSave }) {
  const [qty, setQty] = useState(item.quantity)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({ itemId: item.id, quantity: Number(qty) })
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="field">
        <label className="label">Current stock ({item.unit})</label>
        <input className="input" type="number" min="0" value={qty}
          onChange={(e) => setQty(e.target.value)} autoFocus />
      </div>
      <button type="submit" className="btn btn-primary">
        <Edit2 size={14} /> Save Adjustment
      </button>
    </form>
  )
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState(INITIAL_INVENTORY)
  const [search, setSearch]       = useState('')
  const [statusFilter, setFilter] = useState('all')
  const [restockItem, setRestock] = useState(null)
  const [adjustItem, setAdjust]   = useState(null)

  const filtered = useMemo(() => {
    return inventory.filter((item) => {
      const matchSearch = item.name.toLowerCase().includes(search.toLowerCase())
        || item.category.toLowerCase().includes(search.toLowerCase())
      const status = getStatus(item)
      const matchStatus = statusFilter === 'all'
        || (statusFilter === 'low' && (status.variant === 'warning' || status.variant === 'danger'))
        || (statusFilter === 'ok' && status.variant === 'success')
      return matchSearch && matchStatus
    })
  }, [inventory, search, statusFilter])

  const alerts = inventory.filter((i) => getStatus(i).variant !== 'success')

  const handleRestock = ({ itemId, quantity }) => {
    setInventory((prev) => prev.map((i) =>
      i.id === itemId ? { ...i, quantity: i.quantity + quantity } : i
    ))
  }

  const handleAdjust = ({ itemId, quantity }) => {
    setInventory((prev) => prev.map((i) =>
      i.id === itemId ? { ...i, quantity } : i
    ))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader title="Inventory" description="Track stock levels, manage restock, and monitor alerts.">
        <button className="btn btn-primary" type="button">
          <Plus size={15} /> Add Item
        </button>
      </PageHeader>

      {/* Alert strip */}
      {alerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: '0.875rem 1rem',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--warning-bg)',
            border: '1px solid var(--warning-border)',
          }}
        >
          <AlertTriangle size={16} style={{ color: 'var(--warning)', flexShrink: 0 }} />
          <span style={{ fontSize: '0.875rem', color: 'var(--warning-text)', fontWeight: 500 }}>
            {alerts.length} item{alerts.length > 1 ? 's' : ''} need attention:{' '}
            {alerts.map((a) => a.name).join(', ')}
          </span>
        </motion.div>
      )}

      {/* Filters */}
      <div className="card" style={{ padding: '0.875rem 1rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem', alignItems: 'center' }}>
          <div className="search-bar" style={{ flex: '1 1 12rem', maxWidth: '22rem' }}>
            <Search className="search-icon" size={15} />
            <input className="input" placeholder="Search inventory…" value={search}
              onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: '2.25rem' }} />
          </div>

          <div className="tab-strip">
            {[['all', 'All'], ['low', 'Low Stock'], ['ok', 'In Stock']].map(([v, l]) => (
              <button key={v} className={`tab ${statusFilter === v ? 'active' : ''}`}
                onClick={() => setFilter(v)} type="button">{l}</button>
            ))}
          </div>

          <div style={{ marginLeft: 'auto', fontSize: '0.8125rem', color: 'var(--muted)' }}>
            {filtered.length} items
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        {filtered.length === 0 ? (
          <EmptyState icon={PackageSearch} title="No items found" description="Try adjusting your search or filter." />
        ) : (
          <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Threshold</th>
                  <th>Supplier</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.map((item, idx) => {
                    const status = getStatus(item)
                    return (
                      <motion.tr
                        key={item.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: idx * 0.03 }}
                      >
                        <td>
                          <span style={{ fontWeight: 600, color: 'var(--text)' }}>{item.name}</span>
                        </td>
                        <td>{item.category}</td>
                        <td>
                          <span style={{
                            fontWeight: 700,
                            color: status.variant === 'danger' ? 'var(--danger)' :
                              status.variant === 'warning' ? 'var(--warning)' : 'var(--text)',
                          }}>
                            {item.quantity} {item.unit}
                          </span>
                        </td>
                        <td style={{ color: 'var(--muted)' }}>{item.threshold} {item.unit}</td>
                        <td style={{ color: 'var(--muted)' }}>{item.supplier}</td>
                        <td>
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.375rem' }}>
                            <button className="btn btn-secondary btn-sm"
                              onClick={() => setRestock(item)} type="button">
                              <RefreshCw size={12} /> Restock
                            </button>
                            <button className="btn btn-ghost btn-icon btn-sm"
                              onClick={() => setAdjust(item)} type="button">
                              <Edit2 size={13} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    )
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={Boolean(restockItem)} onClose={() => setRestock(null)} title="Restock Item" size="sm">
        {restockItem && (
          <RestockModal item={restockItem} onClose={() => setRestock(null)} onSave={handleRestock} />
        )}
      </Modal>

      <Modal open={Boolean(adjustItem)} onClose={() => setAdjust(null)} title="Adjust Stock" size="sm">
        {adjustItem && (
          <AdjustModal item={adjustItem} onClose={() => setAdjust(null)} onSave={handleAdjust} />
        )}
      </Modal>
    </div>
  )
}
