import { Component } from 'react'

export default class AppErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <main className="loading-screen" style={{ flexDirection: 'column', padding: '1.5rem', textAlign: 'center' }}>
        <h1 style={{ color: 'var(--text)', fontSize: '1.25rem' }}>This page could not be displayed</h1>
        <p style={{ maxWidth: '32rem' }}>
          Refresh the page. If the problem continues, make sure the frontend and backend development servers are running.
        </p>
        <button className="btn btn-primary" type="button" onClick={this.handleReload}>
          Reload page
        </button>
      </main>
    )
  }
}
