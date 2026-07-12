/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

function getStoredToken() {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem('cafex_token')
}

export function AuthProvider({ children }) {
  const [staff, setStaff] = useState(null)
  const [token, setToken] = useState(() => getStoredToken())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    const initializeAuth = async () => {
      if (!token) {
        if (active) setLoading(false)
        return
      }

      try {
        const res = await authService.me()
        if (active) {
          setStaff(res?.data?.staff ?? null)
        }
      } catch {
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem('cafex_token')
        }
        if (active) {
          setToken(null)
          setStaff(null)
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    initializeAuth()

    return () => {
      active = false
    }
  }, [token])

  const persistAuth = (authToken, authStaff) => {
    if (authToken) {
      localStorage.setItem('cafex_token', authToken)
    } else {
      localStorage.removeItem('cafex_token')
    }
    setToken(authToken)
    setStaff(authStaff)
  }

  const login = async (credentials) => {
    const res = await authService.login(credentials)
    persistAuth(res?.data?.token, res?.data?.staff)
    return res.data
  }

  const register = async (data) => {
    const res = await authService.register(data)
    persistAuth(res?.data?.token, res?.data?.staff)
    return res.data
  }

  const logout = async () => {
    try { await authService.logout() } catch { /* ignore */ }
    persistAuth(null, null)
  }

  const value = useMemo(() => ({
    staff,
    loading,
    login,
    register,
    logout,
    isAuthenticated: Boolean(token && staff),
    isAdmin: staff?.role === 'admin',
  }), [staff, loading, token]) // eslint-disable-line react-hooks/exhaustive-deps

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
