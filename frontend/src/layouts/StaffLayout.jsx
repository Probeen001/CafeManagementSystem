import { Navigate, Route, Routes } from 'react-router-dom'
import { CartProvider } from '../contexts/CartContext'
import { BottomNav } from '../components/shared/BottomNav'
import StaffDashboardPage   from '../pages/staff/DashboardPage'
import StaffPosPage         from '../pages/staff/PosPage'
import StaffOrdersPage      from '../pages/staff/OrdersPage'
import StaffProfilePage     from '../pages/staff/ProfilePage'
import StaffNotificationsPage from '../pages/staff/NotificationsPage'

export default function StaffLayout() {
  return (
    /* data-role="staff" activates green accent via CSS vars */
    <CartProvider>
      <div data-role="staff" style={{
        minHeight: '100svh',
        background: 'var(--background)',
        position: 'relative',
      }}>
        {/* Page content */}
        <div style={{
          paddingBottom: '5rem', /* space for bottom nav */
          minHeight: '100svh',
        }}>
          <Routes>
            <Route path="dashboard"     element={<StaffDashboardPage />} />
            <Route path="pos"           element={<StaffPosPage />} />
            <Route path="orders"        element={<StaffOrdersPage />} />
            <Route path="profile"       element={<StaffProfilePage />} />
            <Route path="notifications" element={<StaffNotificationsPage />} />
            <Route path="*"             element={<Navigate to="dashboard" replace />} />
          </Routes>
        </div>

        {/* Fixed bottom navigation */}
        <BottomNav />
      </div>
    </CartProvider>
  )
}
