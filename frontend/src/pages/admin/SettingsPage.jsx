import { motion } from 'framer-motion'
import { Coffee, Save, Upload } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '../../components/shared/PageHeader'
import { Spinner } from '../../components/ui/Spinner'
import { useSettings } from '../../contexts/SettingsContext'

function Section({ title, description, children }) {
  return (
    <motion.div
      className="card"
      style={{ padding: '1.375rem' }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div style={{ marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
        <h2 className="section-title">{title}</h2>
        {description && <p className="section-subtitle">{description}</p>}
      </div>
      {children}
    </motion.div>
  )
}

export default function SettingsPage() {
  const { settings, updateSettings } = useSettings()
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)
  const [form, setForm]     = useState({ ...settings })

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    await new Promise((r) => setTimeout(r, 800))
    updateSettings(form)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <form onSubmit={handleSave}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <PageHeader title="Settings" description="Configure your cafe's details, billing, and preferences.">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? <Spinner size="sm" /> : <Save size={14} />}
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </PageHeader>

        {/* Cafe Info */}
        <Section title="Cafe Information" description="Basic details about your cafe shown on receipts and reports.">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '0.5rem' }}>
              <div style={{
                width: '4rem', height: '4rem', borderRadius: 'var(--radius-lg)',
                background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {form.logoUrl
                  ? <img src={form.logoUrl} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-lg)' }} />
                  : <Coffee size={24} color="#fff" />
                }
              </div>
              <div>
                <button type="button" className="btn btn-secondary btn-sm">
                  <Upload size={13} /> Upload Logo
                </button>
                <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.375rem' }}>
                  PNG, JPG · max 2 MB · recommended 128×128 px
                </p>
              </div>
            </div>

            <div className="two-col" style={{ gap: '0.875rem' }}>
              <div className="field">
                <label className="label">Cafe Name</label>
                <input className="input" value={form.cafeName}
                  onChange={(e) => set('cafeName', e.target.value)} placeholder="CafeX" />
              </div>
              <div className="field">
                <label className="label">Phone Number</label>
                <input className="input" value={form.phone}
                  onChange={(e) => set('phone', e.target.value)} placeholder="+977 98XXXXXXXX" />
              </div>
            </div>

            <div className="field">
              <label className="label">Email</label>
              <input className="input" type="email" value={form.email}
                onChange={(e) => set('email', e.target.value)} placeholder="hello@cafex.com" />
            </div>

            <div className="field">
              <label className="label">Address</label>
              <textarea className="input textarea" value={form.address}
                onChange={(e) => set('address', e.target.value)}
                placeholder="Thamel, Kathmandu, Nepal" rows={2} />
            </div>
          </div>
        </Section>

        {/* Billing */}
        <Section title="Billing & Taxes" description="VAT and service charge rates applied to every order.">
          <div className="two-col" style={{ gap: '0.875rem' }}>
            <div className="field">
              <label className="label">VAT Rate (%)</label>
              <input className="input" type="number" min="0" max="30" step="0.1"
                value={form.vatRate} onChange={(e) => set('vatRate', e.target.value)} />
              <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
                Nepal standard VAT is 13%
              </p>
            </div>
            <div className="field">
              <label className="label">Service Charge (%)</label>
              <input className="input" type="number" min="0" max="20" step="0.1"
                value={form.serviceChargeRate} onChange={(e) => set('serviceChargeRate', e.target.value)} />
              <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
                Typically 2–10%
              </p>
            </div>
          </div>

          {/* Preview calculation */}
          <div style={{
            marginTop: '1.25rem', padding: '1rem',
            borderRadius: 'var(--radius-lg)', background: 'var(--surface-secondary)',
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)',
              textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.625rem' }}>
              Sample calculation on Rs 500
            </div>
            {(() => {
              const sub = 500
              const vat = sub * (parseFloat(form.vatRate) / 100)
              const svc = sub * (parseFloat(form.serviceChargeRate) / 100)
              const total = sub + vat + svc
              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.875rem' }}>
                  {[
                    ['Subtotal', `Rs ${sub}`],
                    [`VAT (${form.vatRate}%)`, `Rs ${vat.toFixed(2)}`],
                    [`Service (${form.serviceChargeRate}%)`, `Rs ${svc.toFixed(2)}`],
                  ].map(([l, v]) => (
                    <div key={l} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted)' }}>
                      <span>{l}</span><span>{v}</span>
                    </div>
                  ))}
                  <div style={{ borderTop: '1px solid var(--border)', marginTop: '0.375rem', paddingTop: '0.375rem',
                    display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: 'var(--text)' }}>
                    <span>Total</span><span>Rs {total.toFixed(2)}</span>
                  </div>
                </div>
              )
            })()}
          </div>
        </Section>

        {/* Currency & locale */}
        <Section title="Locale & Currency" description="Display preferences for numbers and dates.">
          <div className="two-col" style={{ gap: '0.875rem' }}>
            <div className="field">
              <label className="label">Currency symbol</label>
              <input className="input" value={form.currency}
                onChange={(e) => set('currency', e.target.value)} placeholder="Rs" />
            </div>
            <div className="field">
              <label className="label">Timezone</label>
              <select className="input select">
                <option>Asia/Kathmandu (UTC+5:45)</option>
                <option>Asia/Kolkata (UTC+5:30)</option>
                <option>UTC</option>
              </select>
            </div>
          </div>
        </Section>

        {/* Danger zone */}
        <Section title="Danger Zone" description="Irreversible actions — proceed with caution.">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            <button type="button" className="btn btn-danger btn-sm">
              Clear All Orders
            </button>
            <button type="button" className="btn btn-danger btn-sm">
              Reset Menu
            </button>
          </div>
        </Section>
      </div>
    </form>
  )
}
