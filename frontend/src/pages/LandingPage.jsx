import { motion } from 'framer-motion'
import {
  ArrowRight, BarChart3, BookOpen, ChartColumnBig,
  Coffee, ShieldCheck, ShoppingBag, UtensilsCrossed,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const features = [
  { icon: ShieldCheck,    title: 'Secure Access',    desc: 'JWT auth with role-based access for admins and staff.' },
  { icon: ShoppingBag,    title: 'POS System',       desc: 'Fast item-to-cart flow with live totals and tax.' },
  { icon: ChartColumnBig, title: 'Analytics',        desc: 'Revenue, order trends, and best-sellers at a glance.' },
  { icon: UtensilsCrossed,title: 'Menu Management',  desc: 'Add, edit, and categorize menu items with ease.' },
  { icon: BookOpen,       title: 'Order Tracking',   desc: 'Live order status from new to completed.' },
  { icon: BarChart3,      title: 'Reports',          desc: 'Detailed reports exportable to CSV and PDF.' },
]

const stats = [
  { value: '2×',   label: 'Faster billing' },
  { value: '99%',  label: 'Uptime' },
  { value: '4.9★', label: 'Satisfaction' },
  { value: '24/7', label: 'Support ready' },
]

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#F8F1E8' }}>
      {/* Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: '#FFFDF8',
        borderBottom: '1px solid #E8DCCF',
      }}>
        <div style={{
          maxWidth: '72rem', margin: '0 auto', padding: '0 1.5rem',
          height: '3.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{
              width: '2rem', height: '2rem', borderRadius: '8px',
              background: '#1E0E07',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Coffee size={14} color="#F8F1E8" />
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.0625rem', letterSpacing: '-0.025em', color: '#1C0D07' }}>CafeX</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <Link to="/auth/staff" style={{
              padding: '0.5rem 1rem', borderRadius: '10px',
              border: '1.5px solid #E8DCCF',
              background: '#FFFDF8',
              fontSize: '0.875rem', fontWeight: 600, color: '#3D1E12',
            }}>
              Staff Login
            </Link>
            <Link to="/auth/admin" style={{
              padding: '0.5rem 1rem', borderRadius: '10px',
              background: '#1E0E07', color: '#F8F1E8',
              fontSize: '0.875rem', fontWeight: 700,
              border: 'none',
            }}>
              Admin Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: '72rem', margin: '0 auto', padding: '5rem 1.5rem 4rem' }}>
        <motion.div
          style={{ maxWidth: '48rem' }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.3125rem 0.875rem', borderRadius: '999px',
            background: 'rgba(249,115,22,0.08)',
            border: '1px solid rgba(249,115,22,0.2)',
            fontSize: '0.8125rem', fontWeight: 700, color: '#F97316',
            marginBottom: '1.5rem',
          }}>
            <Coffee size={13} /> Premium Cafe Management System
          </div>

          <h1 style={{
            fontSize: 'clamp(2.25rem, 6vw, 3.5rem)',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            lineHeight: 1.1,
            marginBottom: '1.25rem',
            color: '#1C0D07',
          }}>
            Run your cafe with{' '}
            <span style={{ color: '#F97316' }}>precision</span>{' '}
            and clarity.
          </h1>

          <p style={{ fontSize: '1.0625rem', color: '#6B5B4B', lineHeight: 1.7, marginBottom: '2rem', maxWidth: '36rem' }}>
            CafeX brings together POS, menu management, staff control, order tracking,
            and analytics — all in one premium system designed for modern cafes.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            <Link to="/auth/admin" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.875rem 1.5rem', borderRadius: '14px',
              background: '#F97316', color: '#fff',
              fontWeight: 700, fontSize: '0.9375rem',
            }}>
              Admin Dashboard <ArrowRight size={16} />
            </Link>
            <Link to="/auth/staff" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.875rem 1.5rem', borderRadius: '14px',
              background: '#FFFDF8', color: '#1C0D07',
              fontWeight: 700, fontSize: '0.9375rem',
              border: '1.5px solid #E8DCCF',
            }}>
              Staff POS <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          style={{ display: 'flex', gap: '2.5rem', marginTop: '4rem', flexWrap: 'wrap' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {stats.map((s) => (
            <div key={s.label}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F97316', letterSpacing: '-0.03em' }}>
                {s.value}
              </div>
              <div style={{ fontSize: '0.8125rem', color: '#6B5B4B', marginTop: '0.25rem' }}>{s.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section style={{
        background: '#FFFDF8',
        borderTop: '1px solid #E8DCCF',
        borderBottom: '1px solid #E8DCCF',
      }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '4rem 1.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              fontWeight: 800, letterSpacing: '-0.03em',
              marginBottom: '0.75rem', color: '#1C0D07',
            }}>
              Everything your cafe needs
            </h2>
            <p style={{ color: '#6B5B4B', fontSize: '1rem', maxWidth: '32rem', margin: '0 auto' }}>
              Built on a modern PERN stack with all features that matter for day-to-day cafe operations.
            </p>
          </div>

          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(17rem, 1fr))' }}>
            {features.map((f, i) => {
              const Icon = f.icon
              return (
                <motion.div
                  key={f.title}
                  style={{
                    background: '#F8F1E8',
                    border: '1px solid #E8DCCF',
                    borderRadius: '20px',
                    padding: '1.5rem',
                    boxShadow: '0 2px 8px rgba(75,31,14,0.06)',
                    transition: 'transform 200ms, box-shadow 200ms',
                  }}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -4, boxShadow: '0 8px 20px rgba(75,31,14,0.1)' }}
                >
                  <div style={{
                    width: '2.75rem', height: '2.75rem', borderRadius: '12px',
                    background: 'rgba(249,115,22,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '1rem', color: '#F97316',
                  }}>
                    <Icon size={20} />
                  </div>
                  <h3 style={{ fontWeight: 700, marginBottom: '0.375rem', color: '#1C0D07' }}>{f.title}</h3>
                  <p style={{ fontSize: '0.875rem', color: '#6B5B4B', lineHeight: 1.6 }}>{f.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: '72rem', margin: '0 auto', padding: '4rem 1.5rem' }}>
        <motion.div
          style={{
            padding: '3rem 2.5rem', borderRadius: '28px',
            background: '#1E0E07', textAlign: 'center', color: '#F8F1E8',
          }}
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.75rem' }}>
            Ready to modernize your cafe?
          </h2>
          <p style={{ opacity: 0.75, fontSize: '1rem', marginBottom: '2rem' }}>
            Sign in and start managing in minutes.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/auth/admin" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.875rem 1.75rem', borderRadius: '14px',
              background: '#F97316', color: '#fff', fontWeight: 700, fontSize: '0.9375rem',
            }}>
              Admin Access <ArrowRight size={16} />
            </Link>
            <Link to="/auth/staff" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.875rem 1.75rem', borderRadius: '14px',
              background: 'rgba(255,255,255,0.1)', color: '#F8F1E8',
              fontWeight: 700, fontSize: '0.9375rem',
              border: '1px solid rgba(255,255,255,0.2)',
            }}>
              Staff Login
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid #E8DCCF',
        padding: '1.5rem',
        textAlign: 'center',
        fontSize: '0.8125rem',
        color: '#6B5B4B',
        background: '#FFFDF8',
      }}>
        © 2026 CafeX — Premium Cafe Management System
      </footer>
    </div>
  )
}
