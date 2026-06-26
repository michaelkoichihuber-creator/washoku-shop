import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './PageLayout.css'

export default function PageLayout() {
  return (
    <>
      <Navbar />
      <main className="page-main">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
