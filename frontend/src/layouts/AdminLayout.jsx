import { useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Sidebar } from '../components/shared/Sidebar'
import { Header } from '../components/shared/Header'
import DashboardPage from '../pages/admin/DashboardPage'
import MenuPage from '../pages/admin/MenuPage'
import CategoriesPage from '../pages/admin/CategoriesPage'
import InventoryPage from '../pages/admin/InventoryPage'
import StaffPage from '../pages/admin/StaffPage'
import OrdersPage from '../pages/admin/OrdersPage'
import ReportsPage from '../pages/admin/ReportsPage'
import SettingsPage from '../pages/admin/SettingsPage'
import ProfilePage from '../pages/admin/ProfilePage'

const pageMeta = {
  '/admin/dashboard':  { title: 'Dashboard',         subtitle: 'Overview & analytics' },
  '/admin/menu':       { title: 'Menu Management',   subtitle: 'Items, pricing & availability' },
  '/admin/categories': { title: 'Categories',        subtitle: 'Organize your menu' },
  '/admin/inventory':  { title: 'Inventory',         subtitle: 'Stock tracking & alerts' },
  '/admin/staff':      { title: 'Staff Management',  subtitle: 'Team members & roles' },
  '/admin/orders':     { title: 'Orders',            subtitle: 'Live order tracking' },
  '/admin/reports':    { title: 'Reports & Analytics', subtitle: 'Revenue & sales data' },
  '/admin/settings':   { title: 'Settings',          subtitle: 'Cafe configuration' },
  '/admin/profile':    { title: 'Admin Profile',     subtitle: 'Account & security' },
}

function usePageMeta() {
  const location = useLocation()
  const path = location.pathname
  const key = Object.keys(pageMeta).find((k) => path.startsWith(k))
  return pageMeta[key] ?? { title: 'CafeX Admin', subtitle: '' }
}

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const meta = usePageMeta()

  return (
    /* data-role="admin" activates orange accent via CSS vars */
    <div className="admin-shell" data-role="admin">
      <Sidebar
        role="admin"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="admin-content">
        <Header
          onMenuClick={() => setSidebarOpen((o) => !o)}
          title={meta.title}
          subtitle={meta.subtitle}
        />

        <main className="content-area">
          <Routes>
            <Route path="dashboard"  element={<DashboardPage />} />
            <Route path="menu"       element={<MenuPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="inventory"  element={<InventoryPage />} />
            <Route path="staff"      element={<StaffPage />} />
            <Route path="orders"     element={<OrdersPage />} />
            <Route path="reports"    element={<ReportsPage />} />
            <Route path="settings"   element={<SettingsPage />} />
            <Route path="profile"    element={<ProfilePage />} />
            <Route path="*"          element={<Navigate to="dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
