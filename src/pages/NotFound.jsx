import { Link } from 'react-router-dom'
import { useMeta } from '../utils/useMeta'
import './NotFound.css'

export default function NotFound() {
  useMeta({ title: 'Page Not Found — Washoku Shop', description: '' })

  return (
    <div className="notfound container">
      <p className="notfound__kanji" aria-hidden="true">迷子</p>
      <h1 className="notfound__title">Page not found</h1>
      <p className="notfound__body">This page doesn't exist. The shop is still open though.</p>
      <Link to="/shop" className="notfound__btn">Browse the shop →</Link>
    </div>
  )
}
