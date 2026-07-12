import { motion, AnimatePresence } from 'framer-motion'
import { Edit2, Grid2x2, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { EmptyState } from '../../components/ui/EmptyState'
import { Modal } from '../../components/ui/Modal'
import { PageHeader } from '../../components/shared/PageHeader'
import { Spinner } from '../../components/ui/Spinner'
import { useCategories, useCreateCategory, useDeleteCategory, useUpdateCategory } from '../../hooks/useCategories'

const EMOJIS = ['🍜', '🥤', '🍰', '🥟', '🍟', '☕', '🍱', '🧃', '🥗', '🍕', '🍔', '🧇']

function CategoryForm({ initial, onSubmit, loading }) {
  const [name, setName]        = useState(initial?.name ?? '')
  const [desc, setDesc]        = useState(initial?.description ?? '')
  const [emoji, setEmoji]      = useState(initial?.emoji ?? '🍜')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    onSubmit({ name: name.trim(), description: desc.trim(), emoji })
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="field">
        <label className="label">Category name *</label>
        <input
          className="input"
          placeholder="e.g. Momos, Drinks, Desserts"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoFocus
        />
      </div>

      <div className="field">
        <label className="label">Description</label>
        <textarea
          className="input textarea"
          placeholder="Brief description of this category"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          rows={3}
        />
      </div>

      <div className="field">
        <label className="label">Icon</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {EMOJIS.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => setEmoji(e)}
              style={{
                fontSize: '1.375rem',
                padding: '0.375rem',
                borderRadius: 'var(--radius-sm)',
                border: `2px solid ${emoji === e ? 'var(--primary)' : 'var(--border)'}`,
                background: emoji === e ? 'var(--primary-10)' : 'transparent',
                cursor: 'pointer',
                transition: 'all 120ms',
                lineHeight: 1,
              }}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        disabled={loading || !name.trim()}
        style={{ marginTop: '0.25rem' }}
      >
        {loading && <Spinner size="sm" />}
        {initial ? 'Save Changes' : 'Create Category'}
      </button>
    </form>
  )
}

function CategoryCard({ category, onEdit, onDelete }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="card card-hover"
      style={{ padding: '1.125rem' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
          <div
            style={{
              fontSize: '1.5rem',
              width: '2.75rem',
              height: '2.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 'var(--radius)',
              background: 'var(--primary-10)',
              flexShrink: 0,
              lineHeight: 1,
            }}
          >
            {category.emoji || '📦'}
          </div>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontWeight: 600,
                fontSize: '0.9375rem',
                color: 'var(--text)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {category.name}
            </div>
            {category.description && (
              <div
                style={{
                  fontSize: '0.8125rem',
                  color: 'var(--muted)',
                  marginTop: '0.125rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {category.description}
              </div>
            )}
            {category.item_count !== undefined && (
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
                {category.item_count} {category.item_count === 1 ? 'item' : 'items'}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.375rem', flexShrink: 0 }}>
          <button
            className="btn btn-ghost btn-icon"
            onClick={() => onEdit(category)}
            type="button"
            aria-label="Edit"
          >
            <Edit2 size={14} />
          </button>
          <button
            className="btn btn-ghost btn-icon"
            onClick={() => onDelete(category)}
            type="button"
            aria-label="Delete"
            style={{ color: 'var(--danger)' }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default function CategoriesPage() {
  const { data: rawCategories = [], isLoading, isError, error, refetch } = useCategories()
  const createMutation = useCreateCategory()
  const updateMutation = useUpdateCategory()
  const deleteMutation = useDeleteCategory()

  const categories = Array.isArray(rawCategories) ? rawCategories : []

  const [createOpen, setCreateOpen] = useState(false)
  const [editTarget, setEditTarget]   = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader
        title="Categories"
        description="Organize your menu into categories to make ordering easier."
      >
        <button
          className="btn btn-primary"
          onClick={() => setCreateOpen(true)}
          type="button"
        >
          <Plus size={15} /> Add Category
        </button>
      </PageHeader>

      {isLoading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <Spinner size="lg" style={{ color: 'var(--primary)' }} />
        </div>
      )}

      {isError && (
        <div className="card" role="alert" style={{ padding: '1rem', borderColor: 'var(--danger-border)', background: 'var(--danger-bg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontWeight: 700, color: 'var(--danger-text)' }}>Could not load categories</p>
              <p style={{ marginTop: '0.25rem', fontSize: '0.8125rem', color: 'var(--danger-text)' }}>
                {error?.response?.data?.message || 'Check the API connection and try again.'}
              </p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => refetch()} type="button">
              Try again
            </button>
          </div>
        </div>
      )}

      {!isLoading && !isError && categories.length === 0 && (
        <div className="card">
          <EmptyState
            icon={Grid2x2}
            title="No categories yet"
            description="Create your first category to organize the menu."
            action={
              <button className="btn btn-primary btn-sm" onClick={() => setCreateOpen(true)} type="button">
                <Plus size={13} /> Add Category
              </button>
            }
          />
        </div>
      )}

      {!isLoading && categories.length > 0 && (
        <div
          style={{
            display: 'grid',
            gap: '0.75rem',
            gridTemplateColumns: 'repeat(auto-fill, minmax(17rem, 1fr))',
          }}
        >
          <AnimatePresence>
            {categories.map((cat) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                onEdit={setEditTarget}
                onDelete={setDeleteTarget}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Create modal */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create Category"
      >
        <CategoryForm
          onSubmit={handleCreate}
          loading={createMutation.isPending}
        />
      </Modal>

      {/* Edit modal */}
      <Modal
        open={Boolean(editTarget)}
        onClose={() => setEditTarget(null)}
        title="Edit Category"
      >
        {editTarget && (
          <CategoryForm
            initial={editTarget}
            onSubmit={handleUpdate}
            loading={updateMutation.isPending}
          />
        )}
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Category"
        description={`"${deleteTarget?.name}" will be permanently deleted. All menu items in this category may be affected.`}
        confirmLabel="Delete"
        loading={deleteMutation.isPending}
      />
    </div>
  )
}
