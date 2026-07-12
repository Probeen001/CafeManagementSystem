import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

const emptyForm = {
  name: '',
  description: '',
}

export default function CategoriesPage() {
  const { staff, logout } = useAuth()
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const isEditing = useMemo(() => editingId !== null, [editingId])

  useEffect(() => {
    let isMounted = true

    const fetchCategories = async () => {
      if (!isMounted) {
        return
      }

      setLoading(true)
      setError('')

      try {
        const response = await api.get('/categories')
        if (isMounted) {
          setCategories(response.data.categories || [])
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.response?.data?.message || 'Failed to load categories')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    void fetchCategories()

    return () => {
      isMounted = false
    }
  }, [])

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!form.name.trim()) {
      setError('Category name is required')
      return
    }

    try {
      setSaving(true)

      if (isEditing) {
        await api.put(`/categories/${editingId}`, form)
        setSuccess('Category updated successfully')
      } else {
        await api.post('/categories', form)
        setSuccess('Category created successfully')
      }

      resetForm()
      const response = await api.get('/categories')
      setCategories(response.data.categories || [])
    } catch (saveError) {
      setError(saveError.response?.data?.message || 'Unable to save category')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (category) => {
    setEditingId(category.id)
    setForm({
      name: category.name || '',
      description: category.description || '',
    })
    setSuccess('')
    setError('')
  }

  const handleDelete = async (categoryId) => {
    const confirmDelete = window.confirm('Delete this category?')
    if (!confirmDelete) {
      return
    }

    setError('')
    setSuccess('')

    try {
      await api.delete(`/categories/${categoryId}`)
      setSuccess('Category deleted successfully')
      const response = await api.get('/categories')
      setCategories(response.data.categories || [])
    } catch (deleteError) {
      setError(deleteError.response?.data?.message || 'Unable to delete category')
    }
  }

  return (
    <div className="dashboard-shell">
      <header className="dashboard-topbar">
        <div>
          <span className="eyebrow">CafeX Admin</span>
          <h1>Menu Categories</h1>
          <p>
            Manage category records for the cafe menu. Logged in as {staff?.fullName}.
          </p>
        </div>

        <div className="topbar-actions">
          <Link className="ghost-button" to="/dashboard">
            Dashboard
          </Link>
          <button className="ghost-button" type="button" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <main className="categories-layout">
        <section className="panel-card">
          <div className="card-head">
            <h2>{isEditing ? 'Update Category' : 'Create Category'}</h2>
            <p>Add, rename, or remove menu categories.</p>
          </div>

          <form className="auth-form category-form" onSubmit={handleSubmit}>
            <label>
              Category name
              <input
                type="text"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                placeholder="Hot Drinks"
              />
            </label>

            <label>
              Description
              <textarea
                rows="4"
                value={form.description}
                onChange={(event) =>
                  setForm({ ...form, description: event.target.value })
                }
                placeholder="Coffee, tea, and seasonal beverages"
              />
            </label>

            {(error || success) && (
              <div className={error ? 'alert error' : 'alert success'}>
                {error || success}
              </div>
            )}

            <div className="form-actions">
              <button type="submit" disabled={saving}>
                {saving ? 'Saving...' : isEditing ? 'Update Category' : 'Create Category'}
              </button>
              {isEditing && (
                <button type="button" className="ghost-button" onClick={resetForm}>
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="panel-card category-list-card">
          <div className="card-head">
            <h2>Categories</h2>
            <p>{loading ? 'Loading categories...' : `${categories.length} categories found`}</p>
          </div>

          {loading ? (
            <div className="loading-screen inline">Loading categories...</div>
          ) : categories.length === 0 ? (
            <div className="empty-state">No categories created yet.</div>
          ) : (
            <div className="category-list">
              {categories.map((category) => (
                <article key={category.id} className="category-item">
                  <div>
                    <strong>{category.name}</strong>
                    <p>{category.description || 'No description provided.'}</p>
                  </div>

                  <div className="category-actions">
                    <button type="button" className="ghost-button" onClick={() => handleEdit(category)}>
                      Edit
                    </button>
                    <button type="button" className="ghost-button danger" onClick={() => handleDelete(category.id)}>
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}