import { useParams, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import ProductCard from '../components/ProductCard'
import ProductImage from '../components/ProductImage'
import { products } from '../data/products'
import { useMeta } from '../utils/useMeta'
import './ProductDetail.css'

export default function ProductDetail() {
  const { slug } = useParams()
  const product = products.find(p => p.slug === slug)
  const { dispatch, cart } = useCart()

  const inCart = product ? cart.some(item => item.id === product.id) : false
  const related = product
    ? products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4)
    : []

  useMeta({
    title: product ? `${product.name} — Washoku Shop` : 'Product Not Found — Washoku Shop',
    description: product ? product.description.slice(0, 155) : '',
  })

  if (!product) {
    return (
      <div className="product-detail product-detail--missing container">
        <h1>Product not found</h1>
        <Link to="/shop" className="product-detail__back">← Back to Shop</Link>
      </div>
    )
  }

  return (
    <div className="product-detail">
      <div className="product-detail__inner container">
        <Link to="/shop" className="product-detail__back">← Back to Shop</Link>

        <div className="product-detail__grid">
          <div className="product-detail__image-col">
            <ProductImage product={product} size="lg" />
          </div>

          <div className="product-detail__info">
            <p className="product-detail__category">
              <Link to={`/shop?category=${encodeURIComponent(product.category)}`}>
                {product.category}
              </Link>
            </p>
            <h1 className="product-detail__name">{product.name}</h1>
            <p className="product-detail__brand">by {product.brand}</p>

            <p className="product-detail__price">${product.price.toFixed(2)}</p>

            <div className="product-detail__meta">
              <span className={`product-detail__stock${product.inStock ? '' : ' product-detail__stock--out'}`}>
                {product.inStock
                  ? `In stock (${product.stockQuantity} available)`
                  : 'Out of stock'}
              </span>
              <span className="product-detail__difficulty">
                Level: {product.difficulty}
              </span>
            </div>

            <p className="product-detail__description">{product.description}</p>

            {product.tags.length > 0 && (
              <ul className="product-detail__tags" aria-label="Tags">
                {product.tags.map(tag => (
                  <li key={tag}>
                    <Link to={`/shop?q=${encodeURIComponent(tag)}`} className="product-detail__tag">
                      {tag}
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            <button
              className={`product-detail__add-btn${inCart ? ' product-detail__add-btn--added' : ''}`}
              onClick={() => dispatch({ type: 'ADD_ITEM', product })}
              disabled={!product.inStock}
            >
              {inCart ? '✓ Added to Cart' : 'Add to Cart'}
            </button>

            {inCart && (
              <Link to="/cart" className="product-detail__view-cart">
                View cart →
              </Link>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <section className="product-detail__related">
            <h2 className="product-detail__related-title">More in {product.category}</h2>
            <div className="product-detail__related-grid">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
