import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { products, categories } from '../data/products'
import { useMeta } from '../utils/useMeta'
import './Home.css'

const featured = products.filter(p => p.featured)

const CATEGORY_EMOJI = {
  'Ingredients':         '🫙',
  'Rice & Noodles':      '🍚',
  'Sauces & Seasonings': '🍶',
  'Cookware':            '🍳',
  'Kitchen Tools':       '🔪',
  'Tableware':           '🍜',
  'Cookbooks':           '📖',
  'Starter Kits':        '📦',
}

const RECIPE_CARDS = [
  {
    title: 'Miso Soup',
    kanji: '味噌汁',
    description: 'Start with white miso and kombu dashi. Three ingredients, ten minutes, the foundation of every Japanese breakfast.',
    query: 'miso',
  },
  {
    title: 'Tamagoyaki',
    kanji: '玉子焼き',
    description: 'A rolled sweet-savoury omelette made in a rectangular pan. The dish that shows you whether someone can really cook.',
    query: 'tamagoyaki',
  },
  {
    title: 'Ramen at Home',
    kanji: 'ラーメン',
    description: 'Build a proper broth, cook the noodles separately, arrange the toppings. Slower than instant but worth every minute.',
    query: 'ramen',
  },
]

export default function Home() {
  useMeta({
    title: 'Washoku Shop — Japanese Cooking Ingredients & Cookware',
    description: 'Authentic Japanese cooking ingredients, cookware, and recipe books. Everything you need to bring Japanese home cooking to your kitchen.',
  })

  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  function handleSearch(e) {
    e.preventDefault()
    if (search.trim()) navigate(`/shop?q=${encodeURIComponent(search.trim())}`)
    else navigate('/shop')
  }

  return (
    <div className="home">
      <section className="home__hero">
        <div className="home__hero-inner container">
          <p className="home__hero-eyebrow" aria-hidden="true">和食の台所</p>
          <h1 className="home__hero-title">Simple Japanese<br />Cooking, Delivered.</h1>
          <p className="home__hero-sub">
            Authentic ingredients, quality cookware, and recipe books —
            everything you need to cook Japanese food at home.
          </p>
          <form className="home__search" onSubmit={handleSearch} role="search">
            <input
              type="search"
              className="home__search-input"
              placeholder="Search miso, knife, cookbook…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Search products"
            />
            <button type="submit" className="home__search-btn">Search</button>
          </form>
          <div className="home__hero-links">
            <Link to="/shop" className="home__cta">Browse All Products</Link>
            <Link to="/shop?category=Starter+Kits" className="home__cta home__cta--outline">Starter Kits</Link>
          </div>
        </div>
      </section>

      <section className="home__featured container">
        <div className="home__section-header">
          <h2 className="home__section-title">Featured Products</h2>
          <Link to="/shop" className="home__section-link">View all →</Link>
        </div>
        <div className="home__product-grid">
          {featured.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="home__categories">
        <div className="container">
          <h2 className="home__section-title">Shop by Category</h2>
          <div className="home__categories-grid">
            {categories.map(cat => (
              <Link
                key={cat}
                to={`/shop?category=${encodeURIComponent(cat)}`}
                className="home__category-tile"
              >
                <span className="home__category-emoji" aria-hidden="true">{CATEGORY_EMOJI[cat]}</span>
                <span className="home__category-name">{cat}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home__recipes container">
        <h2 className="home__section-title">Featured Recipe Collection</h2>
        <p className="home__recipes-sub">Find the right ingredients for these Japanese classics.</p>
        <div className="home__recipes-grid">
          {RECIPE_CARDS.map(recipe => (
            <div key={recipe.title} className="home__recipe-card">
              <p className="home__recipe-kanji" aria-hidden="true">{recipe.kanji}</p>
              <h3 className="home__recipe-title">{recipe.title}</h3>
              <p className="home__recipe-desc">{recipe.description}</p>
              <Link
                to={`/shop?q=${recipe.query}`}
                className="home__recipe-link"
              >
                Shop ingredients →
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
