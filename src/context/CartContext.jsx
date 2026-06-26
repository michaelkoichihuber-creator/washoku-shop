import { createContext, useContext, useReducer, useEffect } from 'react'

const CartContext = createContext(null)

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.find(item => item.id === action.product.id)
      if (existing) {
        return state.map(item =>
          item.id === action.product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...state, { ...action.product, quantity: 1 }]
    }
    case 'REMOVE_ITEM':
      return state.filter(item => item.id !== action.id)
    case 'UPDATE_QUANTITY': {
      const qty = Math.max(0, action.quantity)
      if (qty === 0) return state.filter(item => item.id !== action.id)
      return state.map(item =>
        item.id === action.id ? { ...item, quantity: qty } : item
      )
    }
    case 'CLEAR_CART':
      return []
    default:
      return state
  }
}

function loadCart() {
  try {
    const saved = localStorage.getItem('washoku-cart')
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, [], loadCart)

  useEffect(() => {
    localStorage.setItem('washoku-cart', JSON.stringify(cart))
  }, [cart])

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider value={{ cart, dispatch, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
