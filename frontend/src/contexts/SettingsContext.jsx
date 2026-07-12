/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react'

const defaultSettings = {
  cafeName: 'CafeX',
  address: '',
  phone: '',
  email: '',
  logoUrl: '',
  vatRate: 13,
  serviceChargeRate: 2,
  currency: 'Rs',
}

const SettingsContext = createContext(null)

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('cafex_settings')
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings
    } catch {
      return defaultSettings
    }
  })

  const updateSettings = (updates) => {
    setSettings((prev) => {
      const next = { ...prev, ...updates }
      localStorage.setItem('cafex_settings', JSON.stringify(next))
      return next
    })
  }

  const value = useMemo(() => ({ settings, updateSettings }), [settings])

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}
