/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useReducer } from 'react'

const CartContext = createContext(null)

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const existing = state.find((i) => i.id === action.item.id)
      if (existing) {
        return state.map((i) =>
          i.id === action.item.id ? { ...i, qty: i.qty + 1 } : i,
        )
      }
      return [...state, { ...action.item, qty: 1 }]
    }
    case 'REMOVE':
      return state.filter((i) => i.id !== action.id)
    case 'INCREMENT':
      return state.map((i) =>
        i.id === action.id ? { ...i, qty: i.qty + 1 } : i,
      )
    case 'DECREMENT':
      return state
        .map((i) => (i.id === action.id ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0)
    case 'CLEAR':
      return []
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [])

  const addItem     = useCallback((item) => dispatch({ type: 'ADD', item }), [])
  const removeItem  = useCallback((id)   => dispatch({ type: 'REMOVE', id }), [])
  const increment   = useCallback((id)   => dispatch({ type: 'INCREMENT', id }), [])
  const decrement   = useCallback((id)   => dispatch({ type: 'DECREMENT', id }), [])
  const clearCart   = useCallback(()     => dispatch({ type: 'CLEAR' }), [])

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0)
    const vatRate = 0.13
    const serviceRate = 0.02
    const vat = subtotal * vatRate
    const service = subtotal * serviceRate
    const total = subtotal + vat + service
    return { subtotal, vat, service, total, count: items.reduce((s, i) => s + i.qty, 0) }
  }, [items])

  const value = useMemo(
    () => ({ items, totals, addItem, removeItem, increment, decrement, clearCart }),
    [items, totals, addItem, removeItem, increment, decrement, clearCart],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
