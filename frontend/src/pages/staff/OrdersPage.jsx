import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle, ClipboardList, RefreshCw } from 'lucide-react'
import { useMemo, useState } from 'react'
import { StatusBadge } from '../../components/ui/Badge'
import { Modal } from '../../components/ui/Modal'
import { Spinner } from '../../components/ui/Spinner'
import { useOrders, useUpdateOrderStatus } from '../../hooks/useOrders'

const MOCK_ORDERS = [
  {
    id: 1024, order_number: 'ORD-1024', order_status: 'new',
    total_amount: 270, created_at: new Date(Date.now() - 60000).toISOString(),
    items: [{ name: 'Cappuccino', qty: 1, price: 120 }, { name: 'Chicken Burger', qty: 1, price: 150 }],
  },
  {
    id: 1023, order_number: 'ORD-1023', order_status: 'preparing',
    total_amount: 210, created_at: new Date(Date.now() - 300000).toISOString(),
    items: [{ name: 'Cold Coffee', qty: 1, price: 110 }, { name: 'Brownie', qty: 1, price: 100 }],
  },
  {
    id: 1022, order_number: 'ORD-1022', order_status: 'ready',
    total_amount: 100, created_at: new Date(Date.now() - 660000).toISOString(),
    items: [{ name: 'Latte', qty: 1, price: 100 }],
  },
  {
    id: 1021, order_number: 'ORD-1021', order_status: 'completed',
    total_amount: 260, created_at: new Date(Date.now() - 1800000).toISOString(),
    items: [{ name: 'Cappuccino', qty: 1, price: 120 }, { name: 'Club Sandwich', qty: 1, price: 140 }],
  },
]

const TABS = ['All', 'New', 'Preparing', 'Ready', 'Completed']

const NEXT = {
  new:       'preparing',
  preparing: 'ready',
  ready:     'completed',
}

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  return `${Math.floor(diff / 3600)}h ago`
}

function getStatusColor(status) {
  const s = status?.toLowerCase()
  if (s === 'new' || s === 'pending')    return { bg: '#EFF6FF', color: '#1E40AF', border: '#BFDBFE' }
  if (s === 'preparing')                 return { bg: '#FFFBEB', color: '#92400E', border: '#FDE68A' }
  if (s === 'ready')                     return { bg: '#F0FDF4', color: '#166534', border: '#BBF7D0' }
  if (s === 'completed')                 return { bg: 'var(--surface-secondary)', color: 'var(--muted)', border: 'var(--border)' }
  return { bg: 'var(--surface-secondary)', color: 'var(--muted)', border: 'var(--border)' }
}

export default function StaffOrdersPage() {
  const { data: apiOrders = [], isLoading, isFetching, refetch } = useOrders()
  const updateStatus = useUpdateOrderStatus()

  const orders = apiOrders.length ? apiOrders : MOCK_ORDERS

  const [tab,    setTab]    = useState('All')
  const [detail, setDetail] = useState(null)

  const handleRefresh = async () => {
    await refetch()
  }

  const filtered = useMemo(() => {
    if (tab === 'All') return orders
    return orders.filter((o) => (o.order_status ?? '').toLowerCase() === tab.toLowerCase())
  }, [orders, tab])

  const handleAdvance = async (order) => {
    const next = NEXT[order.order_status]
    if (!next) return
    await updateStatus.mutateAsync({ id: order.id, status: next })
    setDetail(null)
  }

  return (
    <div style={{ minHeight: '100svh', background: 'var(--background)' }}>
      {/* Header */}
      <div style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        padding: '0.875rem 1rem',
        position: 'sticky', top: 0, zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <h1 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)' }}>Orders</h1>
          <div style={{
            background: 'var(--primary-10)', color: 'var(--primary)',
            borderRadius: 'var(--radius-full)', padding: '0.125rem 0.5rem',
            fontSize: '0.75rem', fontWeight: 700,
          }}>
            {orders.length}
          </div>
        </div>
        <button
          className="btn btn-ghost btn-sm"
          onClick={handleRefresh}
          disabled={isFetching}
          type="button"
          style={{ color: 'var(--primary)' }}
        >
          {isFetching ? <Spinner size="sm" /> : <RefreshCw size={14} />}
        </button>
      </div>

      {/* Tabs */}
      <div style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        padding: '0.625rem 1rem',
        display: 'flex',
        gap: '0.375rem',
        overflowX: 'auto',
        scrollbarWidth: 'none',
      }}>
        {TABS.map((t) => {
          const count = t === 'All'
            ? orders.length
            : orders.filter((o) => (o.order_status ?? '').toLowerCase() === t.toLowerCase()).length
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              type="button"
              style={{
                flexShrink: 0,
                padding: '0.375rem 0.875rem',
                borderRadius: 'var(--radius-full)',
                border: `1.5px solid ${tab === t ? 'var(--primary)' : 'var(--border)'}`,
                background: tab === t ? 'var(--primary)' : 'var(--surface)',
                color: tab === t ? '#fff' : 'var(--muted)',
                fontSize: '0.8125rem', fontWeight: 600,
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '0.375rem',
                transition: 'all 120ms',
              }}
            >
              {t}
              {count > 0 && (
                <span style={{
                  fontSize: '0.625rem', fontWeight: 800,
                  background: tab === t ? 'rgba(255,255,255,0.25)' : 'var(--surface-secondary)',
                  borderRadius: 'var(--radius-full)', padding: '0.05rem 0.375rem',
                }}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Orders list */}
      <div style={{ padding: '1rem' }}>
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
            <Spinner />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '3rem 1.5rem', gap: '0.75rem', color: 'var(--muted)',
          }}>
            <ClipboardList size={40} style={{ opacity: 0.25 }} />
            <span style={{ fontSize: '0.9375rem' }}>No orders found</span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <AnimatePresence>
              {filtered.map((order, idx) => {
                const sc = getStatusColor(order.order_status)
                const nextStatus = NEXT[order.order_status]
                return (
                  <motion.div
                    key={order.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ delay: idx * 0.04 }}
                    onClick={() => setDetail(order)}
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-xl)',
                      padding: '1rem',
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-xs)',
                      borderLeft: order.order_status === 'Ready' || order.order_status === 'ready'
                        ? '3px solid var(--success)' : '3px solid transparent',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)' }}>
                          {order.order_number}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '2px' }}>
                          {order.items?.length ?? 0} Items · {timeAgo(order.created_at)}
                        </div>
                      </div>
                      <div style={{
                        padding: '0.25rem 0.625rem',
                        borderRadius: 'var(--radius-full)',
                        background: sc.bg,
                        color: sc.color,
                        border: `1px solid ${sc.border}`,
                        fontSize: '0.6875rem', fontWeight: 700,
                        textTransform: 'uppercase', letterSpacing: '0.05em',
                      }}>
                        {order.order_status}
                      </div>
                    </div>

                    {/* Items preview */}
                    <div style={{ marginBottom: '0.875rem' }}>
                      {(order.items ?? []).slice(0, 2).map((item, i) => (
                        <div key={i} style={{
                          fontSize: '0.8125rem', color: 'var(--muted)',
                          display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem',
                        }}>
                          <span>{item.name} ×{item.qty}</span>
                          <span>Rs {(item.price * item.qty)}</span>
                        </div>
                      ))}
                      {(order.items?.length ?? 0) > 2 && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                          +{order.items.length - 2} more items
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)' }}>
                        Rs {order.total_amount?.toLocaleString()}
                      </span>
                      {nextStatus && (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={(e) => { e.stopPropagation(); handleAdvance(order) }}
                          type="button"
                          disabled={updateStatus.isPending}
                          style={{ fontSize: '0.8125rem' }}
                        >
                          {updateStatus.isPending ? <Spinner size="sm" /> : <CheckCircle size={12} />}
                          Mark {nextStatus}
                        </button>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Order detail modal */}
      <Modal
        open={Boolean(detail)}
        onClose={() => setDetail(null)}
        title={`Order ${detail?.order_number}`}
        size="sm"
      >
        {detail && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>
                {timeAgo(detail.created_at)}
              </div>
              <StatusBadge status={detail.order_status} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {(detail.items ?? []).map((item, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '0.625rem 0.875rem',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--surface-secondary)',
                  fontSize: '0.875rem',
                }}>
                  <div>
                    <span style={{ fontWeight: 600 }}>{item.name}</span>
                    <span style={{ color: 'var(--muted)' }}> ×{item.qty}</span>
                  </div>
                  <span style={{ fontWeight: 700 }}>Rs {(item.price * item.qty)}</span>
                </div>
              ))}
            </div>

            <div style={{
              borderTop: '1px solid var(--border)',
              paddingTop: '0.875rem',
              display: 'flex', justifyContent: 'space-between',
              fontWeight: 800, fontSize: '1.0625rem',
            }}>
              <span>Total</span>
              <span>Rs {detail.total_amount?.toLocaleString()}</span>
            </div>

            {NEXT[detail.order_status] && (
              <button
                className="btn btn-primary"
                style={{ padding: '0.875rem' }}
                onClick={() => handleAdvance(detail)}
                disabled={updateStatus.isPending}
                type="button"
              >
                {updateStatus.isPending && <Spinner size="sm" />}
                Mark as {NEXT[detail.order_status]}
              </button>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
