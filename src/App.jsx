import { Routes, Route } from 'react-router-dom'
import { useTheme } from './contexts/ThemeContext'
import Navbar from './components/navbar/Navbar'
import Footer from './components/footer/Footer'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import Platform from './pages/Platform'
import Features from './pages/Features'
import Security from './pages/Security'

export default function App() {
  const { theme } = useTheme()
  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <ScrollToTop />
      <Navbar />
      <main>
        <Routes>
          <Route path="/"         element={<Home />}     />
          <Route path="/platform" element={<Platform />} />
          <Route path="/features" element={<Features />} />
          <Route path="/security" element={<Security />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
