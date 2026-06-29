import { useTheme } from './contexts/ThemeContext'
import Navbar from './components/navbar/Navbar'
import HeroSection from './components/landing/HeroSection'
import TrustedSection from './components/landing/TrustedSection'
import ProblemSection from './components/landing/ProblemSection'
import SolutionSection from './components/landing/SolutionSection'
import InteractiveShowcase from './components/landing/InteractiveShowcase'
import EnterpriseBentoSection from './components/landing/EnterpriseBentoSection'

export default function App() {
  const { theme } = useTheme()

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <Navbar />
      <main>
        <HeroSection />
        <TrustedSection />
        <ProblemSection />
        <SolutionSection />
        <InteractiveShowcase />
        <EnterpriseBentoSection />
      </main>
    </div>
  )
}
