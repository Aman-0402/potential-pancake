import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useTheme } from '../../contexts/ThemeContext'
import Logo from './Logo'
import DesktopMenu from './DesktopMenu'
import MobileMenu from './MobileMenu'
import MobileMenuButton from './MobileMenuButton'
import ThemeToggle from './ThemeToggle'
import CTAButton from './CTAButton'
import ScrollProgress from './ScrollProgress'

const EASE = [0.25, 0.4, 0.25, 1]

export default function Navbar() {
  const { theme }     = useTheme()
  const isDark        = theme === 'dark'
  const reduced       = useReducedMotion()
  const [scrolled,    setScrolled]   = useState(false)
  const [mobileOpen,  setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handler, { passive: true })
    handler()
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Dynamic glass style (CSS-transitioned, not FM-animated to avoid conflicts)
  const glass = scrolled
    ? {
        background:          isDark ? 'rgba(5,8,20,0.82)' : 'rgba(255,255,255,0.82)',
        backdropFilter:      'blur(22px) saturate(160%)',
        WebkitBackdropFilter:'blur(22px) saturate(160%)',
        border:              `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)'}`,
        boxShadow:           isDark
          ? '0 8px 48px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)'
          : '0 8px 48px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.95)',
        padding: '9px 20px',
      }
    : {
        background:          'transparent',
        backdropFilter:      'none',
        WebkitBackdropFilter:'none',
        border:              '1px solid transparent',
        boxShadow:           'none',
        padding: '14px 20px',
      }

  return (
    <>
      {/* Fixed outer shell — pointer-events-none so content behind clicks through */}
      <div
        className="fixed top-5 left-0 right-0 z-40 pointer-events-none"
        style={{ paddingLeft: 16, paddingRight: 16 }}
      >
        <div className="max-w-7xl mx-auto pointer-events-auto">
          <motion.header
            role="banner"
            initial={reduced ? {} : { opacity: 0, y: -24, filter: 'blur(12px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.65, ease: EASE, delay: 0.05 }}
            className="relative rounded-[999px] flex items-center justify-between gap-4"
            style={{
              ...glass,
              transition: [
                'background 0.45s ease',
                'border-color 0.45s ease',
                'box-shadow 0.45s ease',
                'padding 0.38s ease',
                'backdrop-filter 0.45s ease',
                '-webkit-backdrop-filter 0.45s ease',
              ].join(', '),
            }}
          >
            {/* Scroll progress — pinned to top of pill */}
            <ScrollProgress />

            {/* ── Logo ──────────────────────────────────── */}
            <Logo isDark={isDark} />

            {/* ── Center: desktop nav ───────────────────── */}
            <DesktopMenu isDark={isDark} />

            {/* ── Right: CTAs (desktop) ─────────────────── */}
            <motion.div
              className="hidden lg:flex items-center gap-1.5"
              initial={reduced ? {} : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE, delay: 0.3 }}
            >
              <ThemeToggle />
              <div style={{ width: 1, height: 18, background: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)', margin: '0 4px' }} />
              <CTAButton label="Log in"     to="/login"    variant="secondary" isDark={isDark} />
              <CTAButton label="Start Free" to="/register" variant="primary"   isDark={isDark} />
            </motion.div>

            {/* ── Right: mobile controls ────────────────── */}
            <div className="flex lg:hidden items-center gap-2">
              <ThemeToggle />
              <MobileMenuButton
                isOpen={mobileOpen}
                onClick={() => setMobileOpen((v) => !v)}
                isDark={isDark}
              />
            </div>
          </motion.header>
        </div>
      </div>

      {/* Mobile nav panel (renders outside header in DOM) */}
      <MobileMenu
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        isDark={isDark}
      />
    </>
  )
}
