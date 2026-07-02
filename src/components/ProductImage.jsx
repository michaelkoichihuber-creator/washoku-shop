import { useState } from 'react'
import './ProductImage.css'

export default function ProductImage({ product, size = 'md' }) {
  const [loaded, setLoaded] = useState(false)
  const [errored, setErrored] = useState(false)

  return (
    <div className={`product-image product-image--${size}`}>
      {!errored && (
        <img
          className={`product-image__img${loaded ? ' product-image__img--loaded' : ''}`}
          src={product.image}
          alt={product.name}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
        />
      )}
      {errored && (
        <div className="product-image__placeholder" aria-hidden="true">
          <span className="product-image__placeholder-mark">和</span>
          <span className="product-image__placeholder-label">Photography coming soon</span>
        </div>
      )}
    </div>
  )
}
