import './ProductImage.css'

const CATEGORY_CONFIG = {
  'Ingredients':        { emoji: '🫙', bg: '#f0e4d8' },
  'Rice & Noodles':     { emoji: '🍚', bg: '#eeeada' },
  'Sauces & Seasonings':{ emoji: '🍶', bg: '#dceae4' },
  'Cookware':           { emoji: '🍳', bg: '#e4dcea' },
  'Kitchen Tools':      { emoji: '🔪', bg: '#d8e4e0' },
  'Tableware':          { emoji: '🍜', bg: '#e8e2d4' },
  'Cookbooks':          { emoji: '📖', bg: '#d4dce8' },
  'Starter Kits':       { emoji: '📦', bg: '#e8dfd4' },
}

export default function ProductImage({ product, size = 'md' }) {
  const config = CATEGORY_CONFIG[product.category] || { emoji: '🛒', bg: '#e8e2d4' }

  return (
    <div
      className={`product-image product-image--${size}`}
      style={{ backgroundColor: config.bg }}
      aria-hidden="true"
    >
      <span className="product-image__emoji">{config.emoji}</span>
    </div>
  )
}
