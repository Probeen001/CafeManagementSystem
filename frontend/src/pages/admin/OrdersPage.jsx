import { AnimatePresence, motion } from 'framer-motion'
import {
  ChevronRight,
  ClipboardList,
  Clock,
  RefreshCw,
  Search,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { StatusBadge } from '../../components/ui/Badge'
import { EmptyState } from '../../components/ui/EmptyState'
import { Modal } from '../../components/ui/Modal'
import { PageHeader } from '../../components/shared/PageHeader'
import { Spinner } from '../../components/ui/Spinner'
import { useOrder, useOrders, useUpdateOrderStatus } from '../../hooks/useOrders'
import { getMenuImage } from '../../utils/menuImages'

const STATUSES = ['pending', 'preparing', 'ready', 'completed', 'cancelled']

const FALLBACK_ORDERS = [
  {
    id: 1001,
    order_number: 'ORD-1001',
    order_status: 'ready',
    total_amount: 299,
    subtotal: 260,
    tax: 39,
    created_at: new Date(Date.now() - 8 * 60000).toISOString(),
    staff_name: 'Mina Gurung',
    items: [
      { name: 'Cappuccino', qty: 2, price: 120 },
      { name: 'Brownie', qty: 1, price: 150 },
    ],
  },
  {
    id: 1002,
    order_number: 'ORD-1002',
    order_status: 'preparing',
    total_amount: 207,
    subtotal: 180,
    tax: 27,
    created_at: new Date(Date.now() - 18 * 60000).toISOString(),
    staff_name: 'Ritika Gautam',
    items: [
      { name: 'Latte', qty: 1, price: 130 },
      { name: 'Masala Fries', qty: 1, price: 120 },
    ],
  },
  {
    id: 1003,
    order_number: 'ORD-1003',
    order_status: 'pending',
    total_amount: 420,
    subtotal: 370,
    tax: 50,
    created_at: new Date(Date.now() - 34 * 60000).toISOString(),
    staff_name: 'Sujan Thapa',
    items: [
      { name: 'Club Sandwich', qty: 1, price: 220 },
      { name: 'Cold Coffee', qty: 1, price: 110 },
    ],
  },
]

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  return `${Math.floor(diff / 3600)}h ago`
}

const NEXT_STATUS = {
  pending:   'preparing',
  preparing: 'ready',
  ready:     'completed',
}

function OrderItemImage({ item }) {
  const [failed, setFailed] = useState(false)
  const src = failed ? '/images/menu/default.svg' : getMenuImage(item)

  return (
    <img
      src={src}
      alt=""
      onError={() => setFailed(true)}
      style={{ width: '2.25rem', height: '2.25rem', borderRadius: 'var(--radius-sm)', objectFit: 'cover', flexShrink: 0 }}
    />
  )
}

function OrderDetailModal({ order, onStatusChange, updating }) {
  const canAdvance = NEXT_STATUS[order.order_status]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header info */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        padding: '1rem', borderRadius: 'var(--radius-lg)', background: 'var(--surface-secondary)',
      }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '0.25rem' }}>Order</div>
          <div style={{ fontWeight: 700, fontSize: '1.125rem' }}>#{order.order_number}</div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
            <Clock size={11} style={{ display: 'inline', marginRight: 4 }} />
            {timeAgo(order.created_at)} · {order.staff_name}
          </div>
        </div>
        <StatusBadge status={order.order_status} />
      </div>

      {/* Items */}
      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase',
          letterSpacing: '0.06em', marginBottom: '0.5rem' }}>Items</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
          {(order.items ?? []).map((item, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.625rem',
              padding: '0.5rem 0.75rem', borderRadius: 'var(--radius)', background: 'var(--surface-secondary)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', minWidth: 0 }}>
                <OrderItemImage item={item} />
                <span style={{ fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.name} <span style={{ color: 'var(--muted)' }}>×{item.qty}</span>
                </span>
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Rs {(item.price * item.qty).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.875rem' }}>
        {[
          ['Subtotal', `Rs ${order.subtotal?.toLocaleString()}`],
          ['Tax (13%)', `Rs ${order.tax?.toLocaleString()}`],
        ].map(([l, v]) => (
          <div key={l} style={{ display: 'flex', justifyContent: 'space-between',
            fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '0.375rem' }}>
            <span>{l}</span><span>{v}</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between',
          fontWeight: 700, fontSize: '1rem', marginTop: '0.5rem' }}>
          <span>Total</span>
          <span>Rs {order.total_amount?.toLocaleString()}</span>
        </div>
      </div>

      {/* Actions */}
      {canAdvance && (
        <button
          className="btn btn-primary"
          onClick={() => onStatusChange(order.id, canAdvance)}
          disabled={updating}
        >
          {updating && <Spinner size="sm" />}
          Mark as {canAdvance.charAt(0).toUpperCase() + canAdvance.slice(1)}
        </button>
      )}
      {order.order_status === 'pending' && (
        <button
          className="btn btn-danger"
          onClick={() => onStatusChange(order.id, 'cancelled')}
          disabled={updating}
        >
          Cancel Order
        </button>
      )}
    </div>
  )
}

export default function OrdersPage() {
  const { data: apiOrders = [], isLoading, isFetching, refetch } = useOrders()
  const updateStatus = useUpdateOrderStatus()
  const orders = useMemo(() => (Array.isArray(apiOrders) ? apiOrders : []), [apiOrders])
  const hasLiveOrders = orders.length > 0
  const displayOrders = useMemo(() => (hasLiveOrders ? orders : FALLBACK_ORDERS), [hasLiveOrders, orders])
  const showingFallback = !isLoading && !hasLiveOrders

  const [tab,        setTab]        = useState('all')
  const [search,     setSearch]     = useState('')
  const [selectedId, setSelectedId] = useState(null)

  const handleRefresh = async () => {
    await refetch()
  }

  const { data: fullOrder, isLoading: detailLoading } = useOrder(selectedId)
  const detail = selectedId
    ? (fullOrder ?? displayOrders.find((o) => o.id === selectedId) ?? null)
    : null

  const filtered = useMemo(() => {
    return displayOrders.filter((o) => {
      const matchTab    = tab === 'all' || o.order_status === tab
      const matchSearch = !search
        || o.order_number.toLowerCase().includes(search.toLowerCase())
        || o.staff_name?.toLowerCase().includes(search.toLowerCase())
      return matchTab && matchSearch
    })
  }, [orders, tab, search])

  const counts = useMemo(() => {
    const c = { all: displayOrders.length }
    STATUSES.forEach((s) => { c[s] = displayOrders.filter((o) => o.order_status === s).length })
    return c
  }, [displayOrders])

  const handleStatusChange = async (orderId, status) => {
    try {
      await updateStatus.mutateAsync({ id: orderId, status })
    } catch (error) {
      console.error('Failed to update order status', error)
    } finally {
      setSelectedId(null)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader title="Orders" description="Monitor and manage all cafe orders in real time.">
        <button className="btn btn-ghost btn-sm" type="button" onClick={handleRefresh} disabled={isFetching}>
          {isFetching ? <Spinner size="sm" /> : <RefreshCw size={13} />}
          {isFetching ? 'Refreshing…' : 'Refresh'}
        </button>
      </PageHeader>

      {showingFallback && (
        <div className="card" style={{ padding: '0.875rem 1rem', background: 'var(--surface-secondary)', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>
            Live orders are not available right now, so the dashboard is showing a polished preview of recent orders.
          </div>
        </div>
      )}

      {/* Tab strip */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
        {[['all', 'All'], ...STATUSES.map((s) => [s, s.charAt(0).toUpperCase() + s.slice(1)])].map(([v, l]) => (
          <button
            key={v}
            className={`tab ${tab === v ? 'active' : ''}`}
            onClick={() => setTab(v)}
            type="button"
            style={{
              background: tab === v ? 'var(--primary)' : 'var(--surface)',
              color: tab === v ? '#fff' : 'var(--muted)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-full)',
              padding: '0.3125rem 0.875rem',
              fontSize: '0.8125rem',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
            }}
          >
            {l}
            {counts[v] > 0 && (
              <span style={{
                fontSize: '0.6875rem', fontWeight: 700,
                background: tab === v ? 'rgba(255,255,255,0.25)' : 'var(--surface-secondary)',
                borderRadius: 'var(--radius-full)', padding: '0 0.375rem', lineHeight: '1.375rem',
              }}>
                {counts[v]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="card" style={{ padding: '0.875rem 1rem' }}>
        <div className="search-bar" style={{ maxWidth: '22rem' }}>
          <Search className="search-icon" size={15} />
          <input className="input" placeholder="Search order number, staff…" value={search}
            onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: '2.25rem' }} />
        </div>
      </div>

      {/* Orders grid */}
      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <Spinner size="lg" style={{ color: 'var(--primary)' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card">
          <EmptyState icon={ClipboardList} title="No orders found"
            description="No orders match the current filter." />
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fill, minmax(17rem, 1fr))' }}>
          <AnimatePresence>
            {filtered.map((order, idx) => (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ delay: idx * 0.04 }}
                className="card card-hover"
                style={{ padding: '1rem', cursor: 'pointer' }}
                onClick={() => setSelectedId(order.id)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>#{order.order_number}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '2px' }}>
                      {timeAgo(order.created_at)}
                      {order.staff_name && ` · ${order.staff_name}`}
                    </div>
                  </div>
                  <StatusBadge status={order.order_status} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '0.875rem' }}>
                  {(order.items ?? []).slice(0, 3).map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--muted)' }}>
                      <OrderItemImage item={item} />
                      <span>{item.name} ×{item.qty}</span>
                    </div>
                  ))}
                  {(order.items ?? []).length > 3 && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                      +{(order.items ?? []).length - 3} more
                    </div>
                  )}
                  {!order.items && (
                    <div style={{ fontSize: '0.8125rem', color: 'var(--muted)', fontStyle: 'italic' }}>
                      Click to view items
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: '1rem' }}>
                    Rs {order.total_amount?.toLocaleString()}
                  </span>
                  <ChevronRight size={16} style={{ color: 'var(--muted)' }} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Order detail modal */}
      <Modal open={Boolean(selectedId)} onClose={() => setSelectedId(null)}
        title={`Order #${detail?.order_number ?? '…'}`} size="md">
        {detailLoading && !detail && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
            <Spinner size="lg" />
          </div>
        )}
        {detail && (
          <OrderDetailModal
            order={detail}
            onStatusChange={handleStatusChange}
            updating={updateStatus.isPending}
          />
        )}
      </Modal>
    </div>
  )
}
