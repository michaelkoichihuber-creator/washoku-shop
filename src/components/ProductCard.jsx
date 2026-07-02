import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import ProductImage from './ProductImage'
import './ProductCard.css'

export default function ProductCard({ product }) {
  const { dispatch, cart } = useCart()
  const inCart = cart.some(item => item.id === product.id)

  function handleAdd(e) {
    e.preventDefault()
    dispatch({ type: 'ADD_ITEM', product })
  }

  return (
    <article className="product-card">
      <Link to={`/shop/${product.slug}`} className="product-card__image-link">
        <ProductImage product={product} size="md" />
        {!product.inStock && <span className="product-card__badge">Out of Stock</span>}
      </Link>
      <div className="product-card__body">
        <p className="product-card__category">{product.category}</p>
        <h2 className="product-card__name">
          <Link to={`/shop/${product.slug}`}>{product.name}</Link>
        </h2>
        <p className="product-card__brand">{product.brand}</p>
        <div className="product-card__footer">
          <span className="product-card__price">${product.price.toFixed(2)}</span>
          <button
            className={`product-card__btn${inCart ? ' product-card__btn--added' : ''}`}
            onClick={handleAdd}
            aria-label={`${inCart ? 'Add another' : 'Add'} ${product.name} to cart`}
          >
            {inCart ? '✓ In Cart' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </article>
  )
}
