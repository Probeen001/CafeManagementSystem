import { AnimatePresence, motion } from 'framer-motion'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { SettingsProvider } from './contexts/SettingsContext'
import AppErrorBoundary from './components/AppErrorBoundary'
import AdminLayout from './layouts/AdminLayout'
import StaffLayout from './layouts/StaffLayout'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'
import './App.css'

/* ─── Page transition wrapper ─── */
function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      {children}
    </motion.div>
  )
}

/* ─── Route guards ─── */
function ProtectedRoute({ allowedRoles, children }) {
  const { staff, loading, isAuthenticated } = useAuth()

  if (loading) {
    return (
      <div className="loading-screen">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
          style={{ animation: 'spin 0.75s linear infinite', color: 'var(--primary)' }}>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.2" />
          <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        Loading…
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/admin" replace />
  }

  if (allowedRoles && !allowedRoles.includes(staff?.role)) {
    return <Navigate to={staff?.role === 'admin' ? '/admin/dashboard' : '/staff/dashboard'} replace />
  }

  return children
}

function LandingRouter() {
  const { staff, loading } = useAuth()
  if (loading) return null
  if (staff?.role === 'admin') return <Navigate to="/admin/dashboard" replace />
  if (staff?.role === 'staff') return <Navigate to="/staff/dashboard" replace />
  return <LandingPage />
}

/* ─── Router ─── */
function AppRouter() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname.split('/')[1]}>
        {/* Public */}
        <Route path="/" element={<PageTransition><LandingRouter /></PageTransition>} />
        <Route path="/auth/admin" element={<PageTransition><LoginPage brand="admin" /></PageTransition>} />
        <Route path="/auth/staff" element={<PageTransition><LoginPage brand="staff" /></PageTransition>} />
        <Route path="/auth/forgot-password" element={<PageTransition><ForgotPasswordPage /></PageTransition>} />
        <Route path="/auth/reset-password/:token" element={<PageTransition><ResetPasswordPage /></PageTransition>} />

        {/* Admin (protected — admin only) */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        />

        {/* Staff (protected — staff + admin) */}
        <Route
          path="/staff/*"
          element={
            <ProtectedRoute allowedRoles={['staff', 'admin']}>
              <StaffLayout />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}

/* ─── Root ─── */
export default function App() {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <AuthProvider>
          <AppErrorBoundary>
            <AppRouter />
          </AppErrorBoundary>
        </AuthProvider>
      </SettingsProvider>
    </ThemeProvider>
  )
}
