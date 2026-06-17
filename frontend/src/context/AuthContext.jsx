import { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [staff, setStaff] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('cafex_token'))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const hydrateSession = async () => {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const response = await api.get('/auth/me')
        setStaff(response.data.staff)
      } catch (authError) {
        localStorage.removeItem('cafex_token')
        setToken(null)
        setStaff(null)
      } finally {
        setLoading(false)
      }
    }

    hydrateSession()
  }, [token])

  const register = async ({ fullName, email, password, role }) => {
    setError('')
    const response = await api.post('/auth/register', {
      fullName,
      email,
      password,
      role,
    })

    localStorage.setItem('cafex_token', response.data.token)
    setToken(response.data.token)
    setStaff(response.data.staff)
    return response.data
  }

  const login = async ({ email, password }) => {
    setError('')
    const response = await api.post('/auth/login', { email, password })

    localStorage.setItem('cafex_token', response.data.token)
    setToken(response.data.token)
    setStaff(response.data.staff)
    return response.data
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch (logoutError) {
      // Session is cleared locally even if the API request fails.
    } finally {
      localStorage.removeItem('cafex_token')
      setToken(null)
      setStaff(null)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        staff,
        loading,
        error,
        setError,
        register,
        login,
        logout,
        isAuthenticated: Boolean(token && staff),
        isAdmin: staff?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}