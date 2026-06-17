import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ allowedRoles }) {
  const { staff, loading, isAuthenticated } = useAuth()

  if (loading) {
    return <div className="loading-screen">Loading secure session...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(staff?.role)) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}