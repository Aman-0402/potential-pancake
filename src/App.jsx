import { useTheme } from './contexts/ThemeContext'
import HeroSection from './components/landing/HeroSection'
import TrustedSection from './components/landing/TrustedSection'
import ProblemSection from './components/landing/ProblemSection'
import SolutionSection from './components/landing/SolutionSection'
import { Sun, Moon } from 'lucide-react'

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="fixed top-5 right-5 z-50 flex items-center justify-center w-9 h-9 rounded-full transition-colors"
      style={{
        background: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
        border:     theme === 'dark' ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.10)',
      }}
    >
      {theme === 'dark'
        ? <Sun  className="w-4 h-4 text-amber-400" />
        : <Moon className="w-4 h-4 text-slate-600" />
      }
    </button>
  )
}

export default function App() {
  return (
    <>
      <ThemeToggle />
      <HeroSection />
      <TrustedSection />
      <ProblemSection />
      <SolutionSection />
    </>
  )
}
