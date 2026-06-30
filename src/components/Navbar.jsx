import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import './Navbar.css'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { cartCount } = useCart()

  return (
    <header className="navbar">
      <div className="navbar__inner container">
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-kanji" aria-hidden="true">和食</span>
          <span>Washoku Shop</span>
        </Link>

        <nav className="navbar__nav" aria-label="Main navigation">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'navbar__link navbar__link--active' : 'navbar__link'}>Home</NavLink>
          <NavLink to="/shop" className={({ isActive }) => isActive ? 'navbar__link navbar__link--active' : 'navbar__link'}>Shop</NavLink>
          <Link to="/cart" className="navbar__cart" aria-label={`Cart, ${cartCount} item${cartCount !== 1 ? 's' : ''}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {cartCount > 0 && <span className="navbar__cart-badge">{cartCount}</span>}
          </Link>
        </nav>

        <button
          className="navbar__hamburger"
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          <span className={`navbar__hamburger-icon${open ? ' navbar__hamburger-icon--open' : ''}`} aria-hidden="true" />
        </button>
      </div>

      {open && (
        <div className="navbar__mobile">
          <NavLink to="/" end className={({ isActive }) => `navbar__mobile-link${isActive ? ' active' : ''}`} onClick={() => setOpen(false)}>Home</NavLink>
          <NavLink to="/shop" className={({ isActive }) => `navbar__mobile-link${isActive ? ' active' : ''}`} onClick={() => setOpen(false)}>Shop</NavLink>
          <Link to="/cart" className="navbar__mobile-link" onClick={() => setOpen(false)}>
            Cart {cartCount > 0 && <span className="navbar__cart-badge navbar__cart-badge--inline">{cartCount}</span>}
          </Link>
        </div>
      )}
    </header>
  )
}
