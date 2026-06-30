import { Routes, Route } from 'react-router-dom'
import { useTheme } from './contexts/ThemeContext'
import Navbar from './components/navbar/Navbar'
import Footer from './components/footer/Footer'
import Home from './pages/Home'
import Platform from './pages/Platform'

export default function App() {
  const { theme } = useTheme()

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <Navbar />
      <main>
        <Routes>
          <Route path="/"         element={<Home />}     />
          <Route path="/platform" element={<Platform />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
