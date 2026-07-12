import { AnimatePresence, motion } from 'framer-motion'
import {
  Armchair, ArrowLeft, CheckCircle, Coffee, Minus, Plus,
  Search, ShoppingCart, Printer,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { Modal } from '../../components/ui/Modal'
import { Spinner } from '../../components/ui/Spinner'
import { useCart } from '../../contexts/CartContext'
import { useCategories } from '../../hooks/useCategories'
import { useMenuItems } from '../../hooks/useMenuItems'
import { useCreateOrder, useCreatePayment } from '../../hooks/useOrders'
import { getMenuImage } from '../../utils/menuImages'

/* ─── Mock data ─── */
const MOCK_CATEGORIES = [
  { id: 0,  name: 'All' },
  { id: 1,  name: 'Momo' },
  { id: 2,  name: 'Chowmin' },
  { id: 3,  name: 'Snacks' },
  { id: 'drinks', name: 'Drinks' },
]

const MOCK_ITEMS = [
  { id: 1,  name: 'Buff Momo',       price: 140, category_id: 1, category: 'Momo',    description: 'Steamed buffalo dumplings served with house achar.', is_available: true, image_url: '/images/menu/chicken-momo.svg' },
  { id: 2,  name: 'Chicken Momo',    price: 150, category_id: 1, category: 'Momo',    description: 'Juicy chicken dumplings, freshly steamed to order.', is_available: true, image_url: '/images/menu/chicken-momo.svg' },
  { id: 3,  name: 'Dal Bhat Set',    price: 200, category_id: 2, category: 'Chowmin', description: 'A hearty Nepali rice, lentil, and seasonal vegetable set.', is_available: true, image_url: '/images/menu/default.svg' },
  { id: 4,  name: 'Chicken Chowmin', price: 170, category_id: 2, category: 'Chowmin', description: 'Wok-tossed noodles with tender chicken and crisp vegetables.', is_available: true, image_url: '/images/menu/chowmin.svg' },
  { id: 5,  name: 'Katti Roll',      price: 150, category_id: 3, category: 'Snacks',  description: 'Spiced filling wrapped in a warm, flaky paratha.', is_available: true, image_url: '/images/menu/snack.svg' },
  { id: 6,  name: 'Masala Fries',    price: 120, category_id: 3, category: 'Snacks',  description: 'Crisp fries tossed in a bright, savoury masala blend.', is_available: true, image_url: '/images/menu/snack.svg' },
  { id: 7,  name: 'Spring Roll',     price: 130, category_id: 3, category: 'Snacks',  description: 'Golden fried rolls with a seasoned vegetable filling.', is_available: true, image_url: '/images/menu/snack.svg' },
  { id: 8,  name: 'Classic Latte',   price: 130, category_id: 4, category: 'Drinks',  description: 'Double espresso balanced with smooth steamed milk.', is_available: true, image_url: '/images/menu/coffee.svg' },
  { id: 9,  name: 'Cold Coffee',     price: 120, category_id: 4, category: 'Drinks',  description: 'Chilled coffee blended with milk and a light foam.', is_available: true, image_url: '/images/menu/iced-drink.svg' },
  { id: 10, name: 'Cappuccino',      price: 120, category_id: 4, category: 'Drinks',  description: 'Rich espresso finished with velvety milk foam.', is_available: true, image_url: '/images/menu/coffee.svg' },
  { id: 11, name: 'Iced Lemon Tea',  price: 100, category_id: 4, category: 'Drinks',  description: 'Fresh black tea, lemon, and ice for a clean finish.', is_available: true, image_url: '/images/menu/tea.svg' },
  { id: 12, name: 'Masala Chai',     price: 70,  category_id: 4, category: 'Drinks',  description: 'A warming spiced milk tea brewed with aromatic herbs.', is_available: true, image_url: '/images/menu/tea.svg' },
  { id: 13, name: 'Americano',       price: 100, category_id: 4, category: 'Drinks',  description: 'A bold double espresso softened with hot water.', is_available: true, image_url: '/images/menu/coffee.svg' },
  { id: 14, name: 'Espresso',        price: 80,  category_id: 4, category: 'Drinks',  description: 'A rich and concentrated single coffee shot.', is_available: true, image_url: '/images/menu/coffee.svg' },
  { id: 15, name: 'Mocha',           price: 150, category_id: 4, category: 'Drinks',  description: 'Espresso, chocolate, and steamed milk.', is_available: true, image_url: '/images/menu/coffee.svg' },
  { id: 16, name: 'Iced Latte',      price: 130, category_id: 4, category: 'Drinks',  description: 'Smooth espresso and milk served over ice.', is_available: true, image_url: '/images/menu/iced-drink.svg' },
  { id: 17, name: 'Cold Brew',       price: 140, category_id: 4, category: 'Drinks',  description: 'Slow-steeped coffee with a smooth finish.', is_available: true, image_url: '/images/menu/iced-drink.svg' },
  { id: 18, name: 'Frappuccino',     price: 170, category_id: 4, category: 'Drinks',  description: 'Blended iced coffee topped with cream.', is_available: true, image_url: '/images/menu/iced-drink.svg' },
  { id: 19, name: 'Lemonade',        price: 80,  category_id: 4, category: 'Drinks',  description: 'Fresh lemon, mint, and sparkling water.', is_available: true, image_url: '/images/menu/tea.svg' },
  { id: 20, name: 'Mango Smoothie',  price: 120, category_id: 4, category: 'Drinks',  description: 'Creamy mango blended with chilled yogurt.', is_available: true, image_url: '/images/menu/smoothie.svg' },
]

const PAYMENT_METHODS = [
  { id: 'cash', label: 'Cash',  icon: '💵' },
  { id: 'card', label: 'Card',  icon: '💳' },
  { id: 'upi',  label: 'UPI',   icon: '📱' },
]

const TABLES = Array.from({ length: 12 }, (_, index) => index + 1)
const DRINKS_FILTER_ID = 'drinks'

function isDrinkCategory(categoryName) {
  return /coffee|drink|beverage|tea/i.test(String(categoryName ?? ''))
}

function MenuImage({ item, alt, style }) {
  const [failed, setFailed] = useState(false)
  const src = failed ? '/images/menu/default.svg' : getMenuImage(item)

  return <img src={src} alt={alt || item?.name || 'Menu item'} style={style} onError={() => setFailed(true)} />
}

/* ─── Cart view ─── */
function CartView({
  onBack, totals, items, onIncrement, onDecrement, onCheckout,
  orderType, onOrderTypeChange, tableNumber, onTableChange,
}) {
  return (
    <div style={{ minHeight: '100svh', background: 'var(--background)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        padding: '0.875rem 1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <button
          onClick={onBack}
          type="button"
          style={{
            background: 'var(--surface-secondary)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            width: '2.25rem', height: '2.25rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--text)',
          }}
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)' }}>Your Order</h1>
          <p style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
            {items.reduce((s, i) => s + i.qty, 0)} items
          </p>
        </div>
      </div>

      {/* Order type */}
      <div style={{ padding: '1rem', paddingBottom: 0 }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {[
            { label: 'Dine In', value: 'dine_in' },
            { label: 'Take Away', value: 'take_away' },
          ].map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => onOrderTypeChange(type.value)}
              style={{
                flex: 1,
                padding: '0.625rem',
                borderRadius: 'var(--radius-md)',
                border: `2px solid ${orderType === type.value ? 'var(--primary)' : 'var(--border)'}`,
                background: orderType === type.value ? 'var(--primary-10)' : 'var(--surface)',
                color: orderType === type.value ? 'var(--primary)' : 'var(--muted)',
                fontSize: '0.875rem', fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {type.label}
            </button>
          ))}
        </div>
        {orderType === 'dine_in' && (
          <div style={{
            marginTop: '0.75rem', padding: '0.75rem', background: 'var(--surface)',
            borderRadius: 'var(--radius-lg)',
            border: `1px solid ${tableNumber ? 'var(--border)' : 'var(--primary)'}`,
          }}>
            <label htmlFor="pos-table" style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem',
              fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text)',
            }}>
              <Armchair size={15} color="var(--primary)" />
              Table assignment
            </label>
            <select
              id="pos-table"
              className="input"
              value={tableNumber}
              onChange={(event) => onTableChange(event.target.value)}
              style={{ height: '2.75rem', fontWeight: tableNumber ? 700 : 500, cursor: 'pointer' }}
            >
              <option value="">Select a table</option>
              {TABLES.map((table) => <option key={table} value={table}>Table {table}</option>)}
            </select>
            {!tableNumber && (
              <p style={{ margin: '0.5rem 0 0', fontSize: '0.75rem', color: 'var(--primary)' }}>
                Choose a table before checkout.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Items */}
      <div style={{ flex: 1, padding: '1rem', overflow: 'auto' }}>
        {items.map((item) => (
          <div key={item.id} style={{
            display: 'flex', alignItems: 'center', gap: '0.875rem',
            padding: '0.875rem',
            background: 'var(--surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
            marginBottom: '0.625rem',
          }}>
            <div style={{
              width: '3rem', height: '3rem', borderRadius: 'var(--radius-md)',
              background: 'var(--surface-secondary)',
              overflow: 'hidden', flexShrink: 0,
            }}>
              <MenuImage item={item} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--text)' }}>{item.name}</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--primary)', fontWeight: 700, marginTop: '2px' }}>
                Rs {item.price}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button className="qty-btn" onClick={() => onDecrement(item.id)} type="button"><Minus size={11} /></button>
              <span style={{ width: '1.5rem', textAlign: 'center', fontWeight: 700, fontSize: '0.9375rem' }}>{item.qty}</span>
              <button className="qty-btn" onClick={() => onIncrement(item.id)} type="button"><Plus size={11} /></button>
            </div>
            <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text)', width: '3.5rem', textAlign: 'right' }}>
              Rs {(item.price * item.qty)}
            </div>
          </div>
        ))}
      </div>

      {/* Summary + checkout */}
      <div style={{
        padding: '1rem',
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
      }}>
        {[
          ['Subtotal',    `Rs ${totals.subtotal.toFixed(0)}`],
          ['Tax (13%)',   `Rs ${totals.vat.toFixed(0)}`],
          ['Service (2%)',`Rs ${totals.service.toFixed(0)}`],
        ].map(([l, v]) => (
          <div key={l} style={{
            display: 'flex', justifyContent: 'space-between',
            fontSize: '0.875rem', color: 'var(--muted)',
            marginBottom: '0.375rem',
          }}>
            <span>{l}</span><span>{v}</span>
          </div>
        ))}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          fontSize: '1.0625rem', fontWeight: 800, color: 'var(--text)',
          borderTop: '1px solid var(--border)',
          paddingTop: '0.625rem', marginTop: '0.375rem',
        }}>
          <span>Total</span>
          <span>Rs {totals.total.toFixed(0)}</span>
        </div>

        <button
          className="btn btn-primary"
          style={{ width: '100%', padding: '1rem', marginTop: '1rem', fontSize: '1rem', borderRadius: 'var(--radius-lg)' }}
          onClick={onCheckout}
          disabled={items.length === 0 || (orderType === 'dine_in' && !tableNumber)}
        >
          Proceed to Checkout →
        </button>
      </div>
    </div>
  )
}

/* ─── Payment modal ─── */
function PaymentModal({ open, onClose, totals, onConfirm, processing }) {
  const [method,   setMethod]   = useState('cash')
  const [received, setReceived] = useState('')

  const change = method === 'cash' && received
    ? Math.max(0, parseFloat(received) - totals.total) : null

  return (
    <Modal open={open} onClose={onClose} title="Payment" size="sm">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{
          padding: '1.25rem', borderRadius: 'var(--radius-xl)',
          background: '#1E0E07', color: '#F8F1E8', textAlign: 'center',
        }}>
          <div style={{ fontSize: '0.875rem', opacity: 0.7, marginBottom: '0.375rem' }}>Total Amount</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.04em' }}>
            Rs {totals.total.toFixed(0)}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '0.75rem', fontSize: '0.8125rem', opacity: 0.7 }}>
            <span>Subtotal Rs {totals.subtotal.toFixed(0)}</span>
            <span>Tax Rs {(totals.vat + totals.service).toFixed(0)}</span>
          </div>
        </div>

        <div>
          <div className="label" style={{ marginBottom: '0.625rem' }}>Select Payment Method</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.625rem' }}>
            {PAYMENT_METHODS.map((pm) => (
              <button
                key={pm.id}
                type="button"
                onClick={() => setMethod(pm.id)}
                style={{
                  padding: '0.875rem 0.625rem',
                  borderRadius: 'var(--radius-lg)',
                  border: `2px solid ${method === pm.id ? 'var(--primary)' : 'var(--border)'}`,
                  background: method === pm.id ? 'var(--primary-10)' : 'var(--surface)',
                  cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.375rem',
                  color: method === pm.id ? 'var(--primary)' : 'var(--text)',
                  fontWeight: 600, fontSize: '0.8125rem',
                  transition: 'all 120ms',
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>{pm.icon}</span>
                {pm.label}
              </button>
            ))}
          </div>
        </div>

        {method === 'cash' && (
          <div className="field">
            <label className="label">Amount Received</label>
            <input
              className="input"
              type="number"
              min={totals.total}
              step="1"
              placeholder={totals.total.toFixed(0)}
              value={received}
              onChange={(e) => setReceived(e.target.value)}
              autoFocus
            />
            {change !== null && change >= 0 && (
              <div style={{
                marginTop: '0.5rem', padding: '0.625rem 0.875rem',
                borderRadius: 'var(--radius-md)', background: 'var(--success-bg)',
                border: '1px solid var(--success-border)',
                fontSize: '0.9375rem', fontWeight: 700, color: 'var(--success-text)',
                display: 'flex', justifyContent: 'space-between',
              }}>
                <span>Change</span>
                <span>Rs {change.toFixed(0)}</span>
              </div>
            )}
          </div>
        )}

        <button
          className="btn btn-primary"
          style={{ padding: '1rem', fontSize: '1rem', borderRadius: 'var(--radius-lg)' }}
          onClick={() => onConfirm({ method, amountReceived: parseFloat(received) || totals.total })}
          disabled={processing || (method === 'cash' && received && parseFloat(received) < totals.total)}
        >
          {processing ? <Spinner size="sm" /> : <CheckCircle size={18} />}
          Pay Rs {totals.total.toFixed(0)}
        </button>
      </div>
    </Modal>
  )
}

/* ─── Success modal ─── */
function SuccessModal({ open, onClose, order }) {
  return (
    <Modal open={open} onClose={onClose} title="" size="sm">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '0.5rem 0 1rem', textAlign: 'center' }}>
        <div style={{
          width: '5rem', height: '5rem', borderRadius: '50%',
          background: 'var(--success-bg)', border: '3px solid var(--success-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <CheckCircle size={36} color="var(--success)" />
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.375rem' }}>
            Order Placed!
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>
            Your order has been placed successfully. We&apos;ll prepare it fresh!
          </p>
        </div>
        <div style={{
          width: '100%', padding: '0.875rem',
          background: 'var(--surface-secondary)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
        }}>
          <div style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>Order ID</div>
          <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text)' }}>
            {order?.orderNumber}
          </div>
          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary)', marginTop: '0.25rem' }}>
            Total: Rs {order?.total?.toFixed(0)}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.625rem', width: '100%' }}>
          <button
            className="btn btn-secondary"
            style={{ flex: 1 }}
            onClick={() => window.print()}
            type="button"
          >
            <Printer size={15} /> Print
          </button>
          <button
            className="btn btn-primary"
            style={{ flex: 1 }}
            onClick={onClose}
            type="button"
          >
            New Order
          </button>
        </div>
      </div>
    </Modal>
  )
}

/* ─── Main POS Page ─── */
export default function PosPage() {
  const { data: apiCategories = [] } = useCategories()
  const { data: apiItems = [] }      = useMenuItems()
  const createOrder                  = useCreateOrder()
  const createPayment                = useCreatePayment()
  const { items, totals, addItem, increment, decrement, clearCart } = useCart()

  const categories = apiCategories.length
    ? [{ id: 0, name: 'All' }, { id: DRINKS_FILTER_ID, name: 'Drinks' }, ...apiCategories]
    : MOCK_CATEGORIES
  const menuItems = apiItems.length ? apiItems : MOCK_ITEMS

  const [activeCat,   setActiveCat]   = useState(0)
  const [search,      setSearch]      = useState('')
  const [cartView,    setCartView]    = useState(false)
  const [payOpen,     setPayOpen]     = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)
  const [lastOrder,   setLastOrder]   = useState(null)
  const [processing,  setProcessing]  = useState(false)
  const [orderType,   setOrderType]   = useState('dine_in')
  const [tableNumber, setTableNumber] = useState('')

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      if (!item.is_available) return false
      const categoryName = item.category_name || item.category
      const matchCat = activeCat === 0
        || (activeCat === DRINKS_FILTER_ID && isDrinkCategory(categoryName))
        || item.category_id === activeCat
      const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase())
      return matchCat && matchSearch
    })
  }, [menuItems, activeCat, search])

  const handlePaymentConfirm = async ({ method, amountReceived }) => {
    setProcessing(true)
    try {
      let orderNumber = `ORD-${Date.now()}`

      try {
        const orderRes = await createOrder.mutateAsync({
          items:     items.map((i) => ({ menuItemId: i.id, quantity: i.qty })),
          orderType,
          tableNumber: orderType === 'dine_in' ? Number(tableNumber) : null,
        })
        const order = orderRes?.data?.order
        orderNumber = order?.order_number ?? orderNumber

        if (order?.id) {
          await createPayment.mutateAsync({
            orderId:       order.id,
            paymentMethod: method,
            amount:        totals.total,
          })
        }
      } catch { /* API not ready — use mock flow */ }

      setLastOrder({
        orderNumber,
        items: items.map((i) => ({ name: i.name, qty: i.qty, price: i.price })),
        total: totals.total,
        method,
        change: method === 'cash' ? Math.max(0, amountReceived - totals.total) : 0,
      })

      clearCart()
      setTableNumber('')
      setOrderType('dine_in')
      setPayOpen(false)
      setCartView(false)
      setSuccessOpen(true)
    } finally {
      setProcessing(false)
    }
  }

  /* ── Cart view ── */
  if (cartView) {
    return (
      <>
        <CartView
          onBack={() => setCartView(false)}
          totals={totals}
          items={items}
          onIncrement={increment}
          onDecrement={decrement}
          onCheckout={() => setPayOpen(true)}
          orderType={orderType}
          onOrderTypeChange={(type) => {
            setOrderType(type)
            if (type === 'take_away') setTableNumber('')
          }}
          tableNumber={tableNumber}
          onTableChange={setTableNumber}
        />
        <PaymentModal
          open={payOpen}
          onClose={() => setPayOpen(false)}
          totals={totals}
          onConfirm={handlePaymentConfirm}
          processing={processing}
        />
        <SuccessModal
          open={successOpen}
          onClose={() => { setSuccessOpen(false); setLastOrder(null) }}
          order={lastOrder}
        />
      </>
    )
  }

  /* ── Menu view (default) ── */
  return (
    <div style={{ minHeight: '100svh', background: 'var(--background)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        padding: '0.75rem 1rem',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <div className="search-bar" style={{ flex: 1 }}>
            <Search className="search-icon" size={15} />
            <input
              className="input"
              placeholder="Search items…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.375rem', borderRadius: 'var(--radius-full)', height: '2.5rem' }}
            />
          </div>
        </div>

        {/* Category chips */}
        <div className="cat-scroll">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`cat-chip ${activeCat === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCat(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Items grid */}
      <div style={{ flex: 1, padding: '1rem', overflow: 'auto' }}>
        {filteredItems.length === 0 ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', padding: '3rem 1.5rem', gap: '0.75rem', color: 'var(--muted)',
          }}>
            <Coffee size={40} style={{ opacity: 0.25 }} />
            <span style={{ fontSize: '0.9375rem' }}>No items found</span>
          </div>
        ) : (
          <div className="pos-menu-grid">
            <AnimatePresence>
              {filteredItems.map((item, idx) => {
                const inCart = items.find((i) => i.id === item.id)
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.04, duration: 0.2 }}
                    style={{
                      background: 'var(--surface)',
                      border: `1.5px solid ${inCart ? 'var(--primary)' : 'var(--border)'}`,
                      borderRadius: 'var(--radius-xl)',
                      overflow: 'hidden',
                      boxShadow: 'var(--shadow-xs)',
                    }}
                  >
                    {/* Image */}
                    <div style={{
                      width: '100%',
                      aspectRatio: '4/3',
                      background: 'var(--surface-secondary)',
                      overflow: 'hidden',
                      position: 'relative',
                    }}>
                      <MenuImage
                        item={item}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                      {inCart && (
                        <div style={{
                          position: 'absolute', top: '0.5rem', right: '0.5rem',
                          background: 'var(--primary)', color: '#fff',
                          borderRadius: 'var(--radius-full)',
                          width: '1.375rem', height: '1.375rem',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.6875rem', fontWeight: 800,
                        }}>
                          {inCart.qty}
                        </div>
                      )}
                    </div>

                    {/* Info + add button */}
                    <div style={{ padding: '0.625rem' }}>
                      <div style={{
                        fontSize: '0.875rem', fontWeight: 700, color: 'var(--text)',
                        marginBottom: '0.375rem',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {item.name}
                      </div>
                      {item.description && (
                        <div style={{
                          minHeight: '2rem', marginBottom: '0.5rem', fontSize: '0.6875rem',
                          color: 'var(--muted)', lineHeight: 1.4, overflow: 'hidden',
                          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                        }}>
                          {item.description}
                        </div>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary)' }}>
                          Rs {item.price}
                        </span>
                        <button
                          type="button"
                          onClick={() => addItem({
                            id: item.id,
                            name: item.name,
                            price: item.price,
                            image_url: getMenuImage(item),
                          })}
                          style={{
                            width: '1.875rem', height: '1.875rem', borderRadius: '50%',
                            background: 'var(--primary)', border: 'none',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', color: '#fff',
                            transition: 'transform 100ms',
                          }}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Cart bar */}
      {items.length > 0 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          style={{
            position: 'fixed',
            bottom: '5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'calc(100% - 2rem)',
            maxWidth: '440px',
            background: '#1E0E07',
            borderRadius: 'var(--radius-2xl)',
            padding: '0.875rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 8px 30px rgba(30,14,7,0.3)',
            cursor: 'pointer',
            zIndex: 20,
          }}
          onClick={() => setCartView(true)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              background: 'rgba(255,255,255,0.15)',
              borderRadius: 'var(--radius-sm)',
              width: '2rem', height: '2rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
            }}>
              <ShoppingCart size={15} color="#F8F1E8" />
              <div style={{
                position: 'absolute', top: '-5px', right: '-5px',
                background: 'var(--primary)', color: '#fff',
                borderRadius: '50%', width: '1rem', height: '1rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.5625rem', fontWeight: 800,
              }}>
                {items.reduce((s, i) => s + i.qty, 0)}
              </div>
            </div>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#F8F1E8' }}>
              View Cart ({items.reduce((s, i) => s + i.qty, 0)} items)
            </span>
          </div>
          <span style={{ fontSize: '1rem', fontWeight: 800, color: '#F8F1E8' }}>
            Rs {totals.total.toFixed(0)} →
          </span>
        </motion.div>
      )}

      {/* Success modal from order placed elsewhere */}
      <SuccessModal
        open={successOpen}
        onClose={() => { setSuccessOpen(false); setLastOrder(null) }}
        order={lastOrder}
      />
    </div>
  )
}
