import { AnimatePresence, motion } from 'framer-motion'
import {
  Edit2,
  ImageOff,
  Plus,
  Search,
  ToggleLeft,
  ToggleRight,
  Trash2,
  UtensilsCrossed,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { EmptyState } from '../../components/ui/EmptyState'
import { Modal } from '../../components/ui/Modal'
import { StatusBadge } from '../../components/ui/Badge'
import { PageHeader } from '../../components/shared/PageHeader'
import { Spinner } from '../../components/ui/Spinner'
import { useCategories } from '../../hooks/useCategories'
import { useCreateMenuItem, useDeleteMenuItem, useMenuItems, useToggleAvailability, useUpdateMenuItem } from '../../hooks/useMenuItems'
import { getMenuImage } from '../../utils/menuImages'

/* ─── Static mock items (used when API has no data yet) ─── */
const MOCK_ITEMS = [
  { id: 1, name: 'Chicken Momo', price: 190, category_id: 1, category: 'Momo', is_available: true, description: 'Steamed dumplings with juicy chicken filling.', image_url: '/images/menu/chicken-momo.svg' },
  { id: 2, name: 'Veg Chowmin',  price: 220, category_id: 2, category: 'Chowmin', is_available: true, description: 'Stir-fried noodles with fresh vegetables.', image_url: '/images/menu/chowmin.svg' },
  { id: 3, name: 'Classic Latte',price: 180, category_id: 3, category: 'Drinks', is_available: true, description: 'Smooth espresso with steamed milk.', image_url: '/images/menu/coffee.svg' },
  { id: 4, name: 'Masala Fries', price: 150, category_id: 4, category: 'Snacks', is_available: true, description: 'Crispy fries tossed with spicy masala.', image_url: '/images/menu/snack.svg' },
  { id: 5, name: 'Brownie',      price: 160, category_id: 5, category: 'Desserts', is_available: false, description: 'Rich chocolate fudge brownie.', image_url: '/images/menu/dessert.svg' },
  { id: 6, name: 'Butter Tea',   price: 90,  category_id: 3, category: 'Drinks', is_available: true, description: 'Traditional Tibetan butter tea.', image_url: '/images/menu/tea.svg' },
  { id: 7, name: 'Cappuccino',   price: 170, category_id: 3, category: 'Drinks', is_available: true, description: 'Bold espresso topped with velvety milk foam.', image_url: '/images/menu/coffee.svg' },
  { id: 8, name: 'Cold Coffee',  price: 160, category_id: 3, category: 'Drinks', is_available: true, description: 'Chilled coffee blended with milk and a light foam.', image_url: '/images/menu/iced-drink.svg' },
  { id: 9, name: 'Iced Lemon Tea', price: 120, category_id: 3, category: 'Drinks', is_available: true, description: 'Refreshing black tea with lemon and ice.', image_url: '/images/menu/tea.svg' },
  { id: 10, name: 'Masala Chai', price: 80, category_id: 3, category: 'Drinks', is_available: true, description: 'A warming milk tea with aromatic spices.', image_url: '/images/menu/tea.svg' },
  { id: 11, name: 'Americano', price: 100, category_id: 3, category: 'Drinks', is_available: true, description: 'A bold double espresso softened with hot water.', image_url: '/images/menu/coffee.svg' },
  { id: 12, name: 'Espresso', price: 80, category_id: 3, category: 'Drinks', is_available: true, description: 'A rich and concentrated coffee shot.', image_url: '/images/menu/coffee.svg' },
  { id: 13, name: 'Mocha', price: 150, category_id: 3, category: 'Drinks', is_available: true, description: 'Espresso with chocolate and steamed milk.', image_url: '/images/menu/coffee.svg' },
  { id: 14, name: 'Iced Latte', price: 130, category_id: 3, category: 'Drinks', is_available: true, description: 'Smooth espresso and milk served over ice.', image_url: '/images/menu/iced-drink.svg' },
  { id: 15, name: 'Cold Brew', price: 140, category_id: 3, category: 'Drinks', is_available: true, description: 'Slow-steeped coffee with a smooth finish.', image_url: '/images/menu/iced-drink.svg' },
  { id: 16, name: 'Frappuccino', price: 170, category_id: 3, category: 'Drinks', is_available: true, description: 'Blended iced coffee topped with cream.', image_url: '/images/menu/iced-drink.svg' },
  { id: 17, name: 'Lemonade', price: 80, category_id: 3, category: 'Drinks', is_available: true, description: 'Fresh lemon, mint, and sparkling water.', image_url: '/images/menu/tea.svg' },
  { id: 18, name: 'Mango Smoothie', price: 120, category_id: 3, category: 'Drinks', is_available: true, description: 'Creamy mango blended with chilled yogurt.', image_url: '/images/menu/smoothie.svg' },
]

const DRINKS_FILTER_ID = 'drinks'

function isDrinkCategory(categoryName) {
  return /coffee|drink|beverage|tea/i.test(String(categoryName ?? ''))
}

function MenuItemForm({ initial, categories = [], onSubmit, loading }) {
  const [name,        setName]        = useState(initial?.name ?? '')
  const [price,       setPrice]       = useState(initial?.price ?? '')
  const [categoryId,  setCategoryId]  = useState(initial?.category_id ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [imageUrl,    setImageUrl]    = useState(initial?.image_url ?? initial?.imageUrl ?? '')
  const [available,   setAvailable]   = useState(initial?.is_available ?? true)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim() || !price) return
    onSubmit({
      name: name.trim(),
      price: parseFloat(price),
      category_id: categoryId || null,
      description: description.trim(),
      image_url: imageUrl.trim() || getMenuImage({ name }),
      is_available: available,
    })
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
      <div className="two-col" style={{ gap: '0.875rem' }}>
        <div className="field">
          <label className="label">Item name *</label>
          <input className="input" placeholder="e.g. Chicken Momo" value={name}
            onChange={(e) => setName(e.target.value)} required autoFocus />
        </div>
        <div className="field">
          <label className="label">Price (Rs) *</label>
          <input className="input" type="number" min="0" step="0.01" placeholder="190"
            value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>
      </div>

      <div className="field">
        <label className="label">Category</label>
        <select className="input select" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value="">— Select category —</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div className="field">
        <label className="label">Description</label>
        <textarea className="input textarea" placeholder="Brief description…" value={description}
          onChange={(e) => setDescription(e.target.value)} rows={2} />
      </div>

      <div className="field">
        <label className="label">Image URL</label>
        <input className="input" type="url" placeholder="https://example.com/item.jpg" value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)} />
      </div>

      {imageUrl && (
        <div style={{ border: '1px dashed var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', background: 'var(--surface-2)', minHeight: '8rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src={imageUrl}
            alt="Preview"
            style={{ width: '100%', maxHeight: '8rem', objectFit: 'cover' }}
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
        </div>
      )}

      <label style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer' }}>
        <div
          style={{
            width: '2.25rem', height: '1.25rem', borderRadius: '1rem',
            background: available ? 'var(--primary)' : 'var(--border-strong)',
            position: 'relative', transition: 'background 150ms',
          }}
        >
          <div
            style={{
              position: 'absolute', top: '2px',
              left: available ? 'calc(100% - 1.0625rem)' : '2px',
              width: '0.9375rem', height: '0.9375rem',
              borderRadius: '50%', background: '#fff',
              transition: 'left 150ms',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }}
          />
        </div>
        <input type="checkbox" checked={available} onChange={(e) => setAvailable(e.target.checked)} style={{ display: 'none' }} />
        <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
          {available ? 'Available' : 'Unavailable'}
        </span>
      </label>

      <button type="submit" className="btn btn-primary" disabled={loading || !name.trim() || !price}>
        {loading && <Spinner size="sm" />}
        {initial ? 'Save Changes' : 'Add Item'}
      </button>
    </form>
  )
}

function MenuItemCard({ item, onEdit, onDelete, onToggle }) {
  const [imageError, setImageError] = useState(false)
  const imageSrc = imageError ? '/images/menu/default.svg' : getMenuImage(item)

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="card"
      style={{ overflow: 'hidden' }}
    >
      {/* Image placeholder */}
      <div
        style={{
          height: 'clamp(13rem, 28vw, 17rem)',
          background: imageSrc ? undefined : 'linear-gradient(135deg, var(--primary-light) 0%, rgba(79,121,66,0.2) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={item.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onError={() => setImageError(true)}
          />
        ) : (
          <ImageOff size={28} style={{ color: 'rgba(79,121,66,0.4)' }} />
        )}
      </div>

      <div style={{ padding: '0.875rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: '0.9375rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {item.name}
            </div>
            {(item.category_name || item.category) && (
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '2px' }}>
                {item.category_name || item.category}
              </div>
            )}
          </div>
          <StatusBadge status={item.is_available ? 'Available' : 'Unavailable'} />
        </div>

        {item.description && (
          <p style={{ fontSize: '0.8125rem', color: 'var(--muted)', marginBottom: '0.75rem', lineHeight: 1.5,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {item.description}
          </p>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text)' }}>
            Rs {Number(item.price).toLocaleString()}
          </span>
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <button className="btn btn-ghost btn-icon btn-sm"
              onClick={() => onToggle(item)} type="button" aria-label="Toggle availability">
              {item.is_available ? <ToggleRight size={15} style={{ color: 'var(--primary)' }} /> : <ToggleLeft size={15} />}
            </button>
            <button className="btn btn-ghost btn-icon btn-sm"
              onClick={() => onEdit(item)} type="button" aria-label="Edit">
              <Edit2 size={14} />
            </button>
            <button className="btn btn-ghost btn-icon btn-sm"
              onClick={() => onDelete(item)} type="button" aria-label="Delete"
              style={{ color: 'var(--danger)' }}>
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

export default function MenuPage() {
  const { data: rawCategories = [], refetch: refetchCategories } = useCategories()
  const {
    data: rawItems,
    isLoading,
    isError,
    error,
    refetch,
  } = useMenuItems()
  const createMutation  = useCreateMenuItem()
  const updateMutation  = useUpdateMenuItem()
  const deleteMutation  = useDeleteMenuItem()
  const toggleMutation  = useToggleAvailability()

  const categories = Array.isArray(rawCategories) ? rawCategories : []
  const apiItems = Array.isArray(rawItems) ? rawItems : []
  const isUsingFallback = !isLoading && isError && apiItems.length === 0
  const items = isUsingFallback ? MOCK_ITEMS : apiItems

  const [search,       setSearch]       = useState('')
  const [catFilter,    setCatFilter]    = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [createOpen,   setCreateOpen]   = useState(false)
  const [editTarget,   setEditTarget]   = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const name = String(item?.name ?? '').toLowerCase()
      const matchSearch = name.includes(search.toLowerCase())
      const categoryName = item?.category_name || item?.category
      const matchCat = catFilter === 'all'
        || (catFilter === DRINKS_FILTER_ID && isDrinkCategory(categoryName))
        || String(item?.category_id ?? '') === catFilter
      const matchStatus = statusFilter === 'all'
        || (statusFilter === 'available' && item?.is_available)
        || (statusFilter === 'unavailable' && !item?.is_available)
      return matchSearch && matchCat && matchStatus
    })
  }, [items, search, catFilter, statusFilter])

  const handleCreate = async (data) => {
    await createMutation.mutateAsync(data)
    setCreateOpen(false)
  }

  const handleUpdate = async (data) => {
    if (!editTarget?.id) return
    await updateMutation.mutateAsync({ id: editTarget.id, ...data })
    setEditTarget(null)
  }

  const handleDelete = async () => {
    if (!deleteTarget?.id) return
    await deleteMutation.mutateAsync(deleteTarget.id)
    setDeleteTarget(null)
  }

  const handleToggle = async (item) => {
    if (!item?.id) return
    await toggleMutation.mutateAsync(item.id)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader title="Menu Management" description="Manage items, pricing, and availability.">
        <button className="btn btn-primary" onClick={() => setCreateOpen(true)} type="button">
          <Plus size={15} /> Add Item
        </button>
      </PageHeader>

      {isUsingFallback && (
        <div className="card" role="status" style={{ padding: '0.875rem 1rem', borderColor: 'rgba(245, 158, 11, 0.35)', background: 'rgba(245, 158, 11, 0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontWeight: 700, color: 'var(--warning-text)' }}>Showing sample menu data</p>
              <p style={{ marginTop: '0.25rem', fontSize: '0.8125rem', color: 'var(--muted)' }}>
                The menu API is unavailable right now, so this page is using demo items until the connection is restored.
              </p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => { refetch(); refetchCategories() }} type="button">
              Retry connection
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card" style={{ padding: '0.875rem 1rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem', alignItems: 'center' }}>
          <div className="search-bar" style={{ flex: '1 1 12rem', maxWidth: '22rem' }}>
            <Search className="search-icon" size={15} />
            <input className="input" placeholder="Search items…" value={search}
              onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: '2.25rem' }} />
          </div>

          <select className="input select" value={catFilter} onChange={(e) => setCatFilter(e.target.value)}
            style={{ width: 'auto', minWidth: '9rem' }}>
            <option value="all">All categories</option>
            <option value={DRINKS_FILTER_ID}>Drinks</option>
            {categories.map((c) => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
          </select>

          <select className="input select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: 'auto', minWidth: '9rem' }}>
            <option value="all">All status</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>

          <div style={{ marginLeft: 'auto', fontSize: '0.8125rem', color: 'var(--muted)' }}>
            {filtered.length} items
          </div>
        </div>
      </div>

      {isLoading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <Spinner size="lg" style={{ color: 'var(--primary)' }} />
        </div>
      )}

      {!isLoading && isError && (
        <div
          className="card"
          role="alert"
          style={{ padding: '1rem', borderColor: 'var(--danger-border)', background: 'var(--danger-bg)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontWeight: 700, color: 'var(--danger-text)' }}>Could not load menu data</p>
              <p style={{ marginTop: '0.25rem', fontSize: '0.8125rem', color: 'var(--danger-text)' }}>
                {error?.response?.data?.message || 'Check that the backend is running, then try again.'}
              </p>
            </div>
            <button className="btn btn-secondary" onClick={() => refetch()} type="button">
              Try again
            </button>
          </div>
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="card">
          <EmptyState
            icon={UtensilsCrossed}
            title={search ? 'No matching items' : 'No menu items yet'}
            description={search ? 'Try a different search term.' : 'Add your first item to get started.'}
            action={!search && (
              <button className="btn btn-primary btn-sm" onClick={() => setCreateOpen(true)} type="button">
                <Plus size={13} /> Add Item
              </button>
            )}
          />
        </div>
      )}

      {!isLoading && filtered.length > 0 && (
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(15rem, 1fr))' }}>
          <AnimatePresence>
            {filtered.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                onEdit={setEditTarget}
                onDelete={setDeleteTarget}
                onToggle={handleToggle}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Add Menu Item" size="lg">
        <MenuItemForm categories={categories} onSubmit={handleCreate} loading={createMutation.isPending} />
      </Modal>

      <Modal open={Boolean(editTarget)} onClose={() => setEditTarget(null)} title="Edit Menu Item" size="lg">
        {editTarget && (
          <MenuItemForm initial={editTarget} categories={categories}
            onSubmit={handleUpdate} loading={updateMutation.isPending} />
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Menu Item"
        description={`"${deleteTarget?.name}" will be permanently removed from the menu.`}
        confirmLabel="Delete"
        loading={deleteMutation.isPending}
      />
    </div>
  )
}
