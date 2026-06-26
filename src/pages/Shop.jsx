import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { products, categories } from '../data/products'
import { useMeta } from '../utils/useMeta'
import './Shop.css'

const SORT_OPTIONS = [
  { value: 'default',    label: 'Default' },
  { value: 'price-asc',  label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc',   label: 'Name: A–Z' },
]

const PRICE_RANGES = [
  { label: 'Under $15',  value: '0-15',   min: 0,  max: 15  },
  { label: '$15 – $30',  value: '15-30',  min: 15, max: 30  },
  { label: '$30 – $60',  value: '30-60',  min: 30, max: 60  },
  { label: 'Over $60',   value: '60-999', min: 60, max: 999 },
]

export default function Shop() {
  useMeta({
    title: 'Shop — Washoku',
    description: 'Browse all Japanese cooking ingredients, cookware, kitchen tools, and recipe books.',
  })

  const [searchParams, setSearchParams] = useSearchParams()
  const [sort, setSort] = useState('default')

  const urlQuery    = searchParams.get('q') || ''
  const urlCategory = searchParams.get('category') || ''
  const urlPrice    = searchParams.get('price') || ''

  const [localSearch, setLocalSearch] = useState(urlQuery)

  useEffect(() => {
    setLocalSearch(urlQuery)
  }, [urlQuery])

  function updateParam(key, value) {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next, { replace: true })
  }

  function handleSearchChange(e) {
    const val = e.target.value
    setLocalSearch(val)
    updateParam('q', val)
  }

  function handleCategory(cat) {
    updateParam('category', cat === urlCategory ? '' : cat)
  }

  function handlePrice(value) {
    updateParam('price', value === urlPrice ? '' : value)
  }

  const filtered = products
    .filter(p => {
      if (!urlQuery) return true
      const q = urlQuery.toLowerCase()
      return (
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      )
    })
    .filter(p => !urlCategory || p.category === urlCategory)
    .filter(p => {
      if (!urlPrice) return true
      const range = PRICE_RANGES.find(r => r.value === urlPrice)
      if (!range) return true
      return p.price >= range.min && p.price < range.max
    })
    .sort((a, b) => {
      if (sort === 'price-asc')  return a.price - b.price
      if (sort === 'price-desc') return b.price - a.price
      if (sort === 'name-asc')   return a.name.localeCompare(b.name)
      return 0
    })

  return (
    <div className="shop">
      <div className="shop__layout container">
        <aside className="shop__sidebar">
          <h2 className="shop__sidebar-title">Categories</h2>
          <button
            className={`shop__cat-btn${!urlCategory ? ' shop__cat-btn--active' : ''}`}
            onClick={() => updateParam('category', '')}
          >
            All Products
            <span className="shop__cat-count">{products.length}</span>
          </button>
          {categories.map(cat => {
            const count = products.filter(p => p.category === cat).length
            return (
              <button
                key={cat}
                className={`shop__cat-btn${urlCategory === cat ? ' shop__cat-btn--active' : ''}`}
                onClick={() => handleCategory(cat)}
              >
                {cat}
                <span className="shop__cat-count">{count}</span>
              </button>
            )
          })}

          <h2 className="shop__sidebar-title shop__sidebar-title--spaced">Price</h2>
          {PRICE_RANGES.map(range => {
            const count = products.filter(p => p.price >= range.min && p.price < range.max).length
            return (
              <button
                key={range.value}
                className={`shop__cat-btn${urlPrice === range.value ? ' shop__cat-btn--active' : ''}`}
                onClick={() => handlePrice(range.value)}
              >
                {range.label}
                <span className="shop__cat-count">{count}</span>
              </button>
            )
          })}
        </aside>

        <div className="shop__main">
          <div className="shop__toolbar">
            <input
              type="search"
              className="shop__search"
              placeholder="Search products, brands, tags…"
              value={localSearch}
              onChange={handleSearchChange}
              aria-label="Search products"
            />
            <select
              className="shop__sort"
              value={sort}
              onChange={e => setSort(e.target.value)}
              aria-label="Sort products"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <p className="shop__count">
            {filtered.length === products.length
              ? `${products.length} products`
              : `${filtered.length} of ${products.length} products`}
            {urlCategory && <span> in <strong>{urlCategory}</strong></span>}
            {urlPrice && <span> · <strong>{PRICE_RANGES.find(r => r.value === urlPrice)?.label}</strong></span>}
            {urlQuery && <span> matching <strong>"{urlQuery}"</strong></span>}
          </p>

          {filtered.length > 0 ? (
            <div className="shop__grid">
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="shop__empty">
              <p>No products found.</p>
              <button
                className="shop__empty-reset"
                onClick={() => { setSearchParams({}); setLocalSearch(''); setSort('default') }}
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
