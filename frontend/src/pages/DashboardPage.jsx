import { useAuth } from '../context/AuthContext'

export default function DashboardPage() {
  const { staff, logout, isAdmin } = useAuth()

  return (
    <div className="dashboard-shell">
      <header className="dashboard-topbar">
        <div>
          <span className="eyebrow">CafeX Dashboard</span>
          <h1>Welcome back, {staff?.fullName}</h1>
          <p>
            Signed in as {staff?.role}. {isAdmin ? 'Admin access granted.' : 'Staff access granted.'}
          </p>
        </div>
        <button className="ghost-button" type="button" onClick={logout}>
          Logout
        </button>
      </header>

      <main className="dashboard-grid">
        <section className="metric-card">
          <span>Authentication</span>
          <strong>JWT protected</strong>
          <p>Session state is hydrated from the API and secured with bearer tokens.</p>
        </section>
        <section className="metric-card">
          <span>Role access</span>
          <strong>{staff?.role}</strong>
          <p>Routes and UI actions can be restricted by the current role.</p>
        </section>
        <section className="metric-card">
          <span>Account status</span>
          <strong>{staff?.isActive ? 'Active' : 'Disabled'}</strong>
          <p>Inactive staff are blocked on the backend.</p>
        </section>
      </main>
    </div>
  )
}