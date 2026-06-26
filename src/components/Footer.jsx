import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner container">
        <div className="footer__brand">
          <span className="footer__kanji" aria-hidden="true">和食</span>
          <span className="footer__name">Washoku Shop</span>
          <p className="footer__tagline">Authentic Japanese ingredients for your kitchen.</p>
        </div>
        <nav className="footer__nav" aria-label="Footer navigation">
          <Link to="/" className="footer__link">Home</Link>
          <Link to="/shop" className="footer__link">Shop</Link>
          <Link to="/cart" className="footer__link">Cart</Link>
        </nav>
      </div>
      <p className="footer__copy">© {new Date().getFullYear()} Washoku Shop. A learning project.</p>
    </footer>
  )
}
