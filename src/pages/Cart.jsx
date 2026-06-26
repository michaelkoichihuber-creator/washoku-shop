import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import ProductImage from '../components/ProductImage'
import { useMeta } from '../utils/useMeta'
import './Cart.css'

export default function Cart() {
  const { cart, dispatch, cartTotal } = useCart()
  const [ordered, setOrdered] = useState(false)

  useMeta({
    title: `Cart (${cart.length}) — Washoku Shop`,
    description: 'Review your cart and place your order.',
  })

  function handleCheckout() {
    dispatch({ type: 'CLEAR_CART' })
    setOrdered(true)
  }

  if (ordered) {
    return (
      <div className="cart cart--success container">
        <div className="cart__success-inner">
          <p className="cart__success-icon" aria-hidden="true">✓</p>
          <h1 className="cart__success-title">Order placed!</h1>
          <p className="cart__success-body">
            Thank you for your order. In a real store, you would receive a confirmation email here.
          </p>
          <Link to="/shop" className="cart__success-btn">Continue shopping</Link>
        </div>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="cart cart--empty container">
        <h1 className="cart__empty-title">Your cart is empty</h1>
        <p className="cart__empty-body">Add some products to get started.</p>
        <Link to="/shop" className="cart__empty-btn">Browse the shop →</Link>
      </div>
    )
  }

  const shipping = cartTotal >= 60 ? 0 : 4.99
  const total = cartTotal + shipping

  return (
    <div className="cart">
      <div className="cart__inner container">
        <h1 className="cart__title">Your Cart</h1>

        <div className="cart__layout">
          <div className="cart__items">
            {cart.map(item => (
              <div key={item.id} className="cart__item">
                <div className="cart__item-image">
                  <ProductImage product={item} size="sm" />
                </div>
                <div className="cart__item-info">
                  <Link to={`/shop/${item.slug}`} className="cart__item-name">{item.name}</Link>
                  <p className="cart__item-brand">{item.brand}</p>
                  <p className="cart__item-unit">${item.price.toFixed(2)} each</p>
                </div>
                <div className="cart__item-qty">
                  <button
                    className="cart__qty-btn"
                    onClick={() => dispatch({ type: 'UPDATE_QUANTITY', id: item.id, quantity: item.quantity - 1 })}
                    aria-label="Decrease quantity"
                  >−</button>
                  <span className="cart__qty-value">{item.quantity}</span>
                  <button
                    className="cart__qty-btn"
                    onClick={() => dispatch({ type: 'UPDATE_QUANTITY', id: item.id, quantity: item.quantity + 1 })}
                    aria-label="Increase quantity"
                  >+</button>
                </div>
                <p className="cart__item-total">${(item.price * item.quantity).toFixed(2)}</p>
                <button
                  className="cart__item-remove"
                  onClick={() => dispatch({ type: 'REMOVE_ITEM', id: item.id })}
                  aria-label={`Remove ${item.name}`}
                >✕</button>
              </div>
            ))}
          </div>

          <aside className="cart__summary">
            <h2 className="cart__summary-title">Order Summary</h2>
            <div className="cart__summary-row">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="cart__summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
            </div>
            {shipping > 0 && (
              <p className="cart__shipping-note">
                Free shipping on orders over $60.00
              </p>
            )}
            <div className="cart__summary-row cart__summary-row--total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button className="cart__checkout-btn" onClick={handleCheckout}>
              Place Order
            </button>
            <Link to="/shop" className="cart__continue">← Continue shopping</Link>
          </aside>
        </div>
      </div>
    </div>
  )
}
