import { AnimatePresence, motion } from 'framer-motion'
import { Edit2, Plus, Search, ShieldCheck, ShieldOff, Trash2, Users } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Avatar } from '../../components/ui/Avatar'
import { Badge } from '../../components/ui/Badge'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { EmptyState } from '../../components/ui/EmptyState'
import { Modal } from '../../components/ui/Modal'
import { Spinner } from '../../components/ui/Spinner'
import { PageHeader } from '../../components/shared/PageHeader'
import { useCreateStaff, useDeleteStaff, useStaff, useToggleStaffActive, useUpdateStaff } from '../../hooks/useStaff'

const MOCK_STAFF = [
  { id: 1, full_name: 'Aarav Sharma',    email: 'aarav@cafex.com',   role: 'admin', is_active: true,  phone: '9841000001' },
  { id: 2, full_name: 'Mina Gurung',     email: 'mina@cafex.com',    role: 'staff', is_active: true,  phone: '9841000002' },
  { id: 3, full_name: 'Sujan Rai',       email: 'sujan@cafex.com',   role: 'staff', is_active: false, phone: '9841000003' },
  { id: 4, full_name: 'Priya Shrestha',  email: 'priya@cafex.com',   role: 'staff', is_active: true,  phone: '9841000004' },
  { id: 5, full_name: 'Rohan Tamang',    email: 'rohan@cafex.com',   role: 'staff', is_active: true,  phone: '9841000005' },
]

function StaffForm({ initial, onSubmit, loading }) {
  const [fullName, setFullName] = useState(initial?.full_name ?? '')
  const [email, setEmail] = useState(initial?.email ?? '')
  const [phone, setPhone] = useState(initial?.phone ?? '')
  const [role, setRole] = useState(initial?.role ?? 'staff')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [formError, setFormError] = useState('')

  const isEditing = Boolean(initial)
  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    const normalizedFullName = fullName.trim()
    const normalizedEmail = email.trim()
    const normalizedPhone = phone.trim()
    const normalizedPassword = password.trim()

    if (!normalizedFullName || !normalizedEmail || (!isEditing && !normalizedPassword)) {
      setFormError('Please complete the required fields before saving.')
      return
    }

    if (!isEditing && normalizedPassword.length < 8) {
      setFormError('Password must be at least 8 characters long.')
      return
    }

    if (!isEditing && normalizedPassword !== confirmPassword) {
      setFormError('Passwords do not match.')
      return
    }

    const data = {
      full_name: normalizedFullName,
      email: normalizedEmail,
      phone: normalizedPhone,
      role,
    }

    if (!isEditing) {
      data.password = normalizedPassword
    }

    try {
      await onSubmit(data)
    } catch (error) {
      setFormError(error?.response?.data?.message || 'Unable to save this staff member. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
      <div className="two-col" style={{ gap: '0.875rem' }}>
        <div className="field">
          <label className="label">Full name *</label>
          <input className="input" placeholder="Aarav Sharma" value={fullName}
            onChange={(e) => setFullName(e.target.value)} required autoFocus />
        </div>
        <div className="field">
          <label className="label">Role</label>
          <select className="input select" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      <div className="field">
        <label className="label">Email *</label>
        <input className="input" type="email" placeholder="staff@cafex.com" value={email}
          onChange={(e) => setEmail(e.target.value)} required />
      </div>

      <div className="field">
        <label className="label">Phone</label>
        <input className="input" type="tel" placeholder="98XXXXXXXX" value={phone}
          onChange={(e) => setPhone(e.target.value)} />
      </div>

      {!initial && (
        <div className="two-col" style={{ gap: '0.875rem' }}>
          <div className="field">
            <label className="label">Password *</label>
            <input className="input" type="password" placeholder="Min. 8 characters" value={password}
              onChange={(e) => setPassword(e.target.value)} minLength={8} autoComplete="new-password" required />
          </div>
          <div className="field">
            <label className="label">Confirm password *</label>
            <input className="input" type="password" placeholder="Re-enter password" value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} minLength={8} autoComplete="new-password" required />
          </div>
        </div>
      )}

      {formError && (
        <div style={{ padding: '0.75rem 0.875rem', borderRadius: '0.75rem', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', color: 'var(--danger)', fontSize: '0.875rem' }}>
          {formError}
        </div>
      )}

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading && <Spinner size="sm" />}
        {initial ? 'Save Changes' : 'Add Staff Member'}
      </button>
    </form>
  )
}

export default function StaffPage() {
  const { data: apiStaff = [], isLoading, isError, error, refetch } = useStaff()
  const createMutation = useCreateStaff()
  const updateMutation = useUpdateStaff()
  const deleteMutation = useDeleteStaff()
  const toggleMutation = useToggleStaffActive()

  const staffData = Array.isArray(apiStaff) ? apiStaff : []
  const isUsingFallback = !isLoading && isError && staffData.length === 0
  const staff = isUsingFallback ? MOCK_STAFF : staffData

  const [search,       setSearch]       = useState('')
  const [roleFilter,   setRoleFilter]   = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [createOpen,   setCreateOpen]   = useState(false)
  const [editTarget,   setEditTarget]   = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const filtered = useMemo(() => {
    return staff.filter((s) => {
      const matchSearch = String(s?.full_name ?? '').toLowerCase().includes(search.toLowerCase())
        || String(s?.email ?? '').toLowerCase().includes(search.toLowerCase())
      const matchRole   = roleFilter === 'all' || s?.role === roleFilter
      const matchStatus = statusFilter === 'all'
        || (statusFilter === 'active' && s?.is_active)
        || (statusFilter === 'inactive' && !s?.is_active)
      return matchSearch && matchRole && matchStatus
    })
  }, [staff, search, roleFilter, statusFilter])

  const handleCreate = async (data) => {
    try {
      await createMutation.mutateAsync(data)
      setCreateOpen(false)
    } catch (error) {
      console.error('Failed to create staff member', error)
      throw error
    }
  }

  const handleUpdate = async (data) => {
    if (!editTarget?.id) return
    try {
      await updateMutation.mutateAsync({ id: editTarget.id, ...data })
      setEditTarget(null)
    } catch (error) {
      console.error('Failed to update staff member', error)
      throw error
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget?.id) return
    await deleteMutation.mutateAsync(deleteTarget.id)
    setDeleteTarget(null)
  }

  const handleToggle = async (member) => {
    if (!member?.id) return
    await toggleMutation.mutateAsync(member.id)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader title="Staff Management" description="Add, edit, and manage cafe team members.">
        <button className="btn btn-primary" onClick={() => setCreateOpen(true)} type="button">
          <Plus size={15} /> Add Staff
        </button>
      </PageHeader>

      {isUsingFallback && (
        <div className="card" role="status" style={{ padding: '0.875rem 1rem', borderColor: 'rgba(245, 158, 11, 0.35)', background: 'rgba(245, 158, 11, 0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontWeight: 700, color: 'var(--warning-text)' }}>Showing sample staff data</p>
              <p style={{ marginTop: '0.25rem', fontSize: '0.8125rem', color: 'var(--muted)' }}>
                {error?.response?.data?.message || 'The staff API is currently unavailable, so the table is using demo records.'}
              </p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => refetch()} type="button">
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Summary cards */}
      <div className="metrics-grid">
        {[
          { label: 'Total Staff',    value: staff.length,                             color: 'var(--primary)' },
          { label: 'Active',         value: staff.filter((s) => s.is_active).length,  color: 'var(--success-text)' },
          { label: 'Inactive',       value: staff.filter((s) => !s.is_active).length, color: 'var(--warning)' },
          { label: 'Admins',         value: staff.filter((s) => s.role === 'admin').length, color: 'var(--info)' },
        ].map((m, i) => (
          <motion.div key={m.label} className="card" style={{ padding: '1rem' }}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}>
            <div className="metric-label">{m.label}</div>
            <div className="metric-value" style={{ color: m.color, marginTop: '0.25rem' }}>{m.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: '0.875rem 1rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem', alignItems: 'center' }}>
          <div className="search-bar" style={{ flex: '1 1 12rem', maxWidth: '22rem' }}>
            <Search className="search-icon" size={15} />
            <input className="input" placeholder="Search by name or email…" value={search}
              onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: '2.25rem' }} />
          </div>
          <select className="input select" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
            style={{ width: 'auto', minWidth: '8rem' }}>
            <option value="all">All roles</option>
            <option value="admin">Admin</option>
            <option value="staff">Staff</option>
          </select>
          <div className="tab-strip">
            {[['all', 'All'], ['active', 'Active'], ['inactive', 'Inactive']].map(([v, l]) => (
              <button key={v} className={`tab ${statusFilter === v ? 'active' : ''}`}
                onClick={() => setStatusFilter(v)} type="button">{l}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Staff table */}
      <div className="card">
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
            <Spinner size="lg" style={{ color: 'var(--primary)' }} />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={Users} title="No staff found" description="Try adjusting your search or filters." />
        ) : (
          <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Role</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.map((member, idx) => (
                    <motion.tr key={member.id}
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }} transition={{ delay: idx * 0.03 }}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <Avatar name={member.full_name} size="md" />
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--text)' }}>{member.full_name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{member.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <Badge variant={member.role === 'admin' ? 'info' : 'neutral'}>
                          {member.role === 'admin' ? 'Admin' : 'Staff'}
                        </Badge>
                      </td>
                      <td style={{ color: 'var(--muted)' }}>{member.phone || '—'}</td>
                      <td>
                        <Badge variant={member.is_active ? 'success' : 'neutral'}>
                          {member.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.375rem' }}>
                          <button className="btn btn-ghost btn-icon btn-sm"
                            onClick={() => handleToggle(member)} type="button"
                            title={member.is_active ? 'Deactivate' : 'Activate'}>
                            {member.is_active
                              ? <ShieldOff size={14} style={{ color: 'var(--warning)' }} />
                              : <ShieldCheck size={14} style={{ color: 'var(--success)' }} />}
                          </button>
                          <button className="btn btn-ghost btn-icon btn-sm"
                            onClick={() => setEditTarget(member)} type="button">
                            <Edit2 size={14} />
                          </button>
                          <button className="btn btn-ghost btn-icon btn-sm"
                            onClick={() => setDeleteTarget(member)} type="button"
                            style={{ color: 'var(--danger)' }}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Add Staff Member" size="lg">
        <StaffForm onSubmit={handleCreate} loading={createMutation.isPending} />
      </Modal>

      <Modal open={Boolean(editTarget)} onClose={() => setEditTarget(null)} title="Edit Staff Member" size="lg">
        {editTarget && (
          <StaffForm initial={editTarget} onSubmit={handleUpdate} loading={updateMutation.isPending} />
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Remove Staff Member"
        description={`"${deleteTarget?.full_name}" will be permanently removed from the system.`}
        confirmLabel="Remove"
        loading={deleteMutation.isPending}
      />
    </div>
  )
}
