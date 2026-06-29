import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { X, ArrowRight, ExternalLink } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import Logo from './Logo'
import { NAV_ITEMS } from './navItems'

const EASE = [0.25, 0.4, 0.25, 1]

const backdropV = {
  hidden: { opacity: 0 },
  show:   { opacity: 1,  transition: { duration: 0.28 } },
  exit:   { opacity: 0,  transition: { duration: 0.22, delay: 0.08 } },
}

const panelV = {
  hidden: { x: '100%', opacity: 0 },
  show:   { x: 0, opacity: 1, transition: { duration: 0.38, ease: EASE } },
  exit:   { x: '100%', opacity: 0, transition: { duration: 0.3, ease: EASE } },
}

const itemV = {
  hidden: { opacity: 0, x: 24 },
  show:   (i) => ({
    opacity: 1, x: 0,
    transition: { delay: i * 0.06 + 0.12, duration: 0.32, ease: EASE },
  }),
}

export default function MobileMenu({ isOpen, onClose, isDark }) {
  const location = useLocation()
  const navigate  = useNavigate()

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.touchAction = 'none'
    } else {
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
    }
  }, [isOpen])

  // Close on route change
  useEffect(() => { onClose() }, [location.pathname, location.hash])

  const handleNavClick = (item, e) => {
    if (item.section) {
      e.preventDefault()
      onClose()
      const scroll = () => {
        const el = document.getElementById(item.section)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      if (location.pathname === '/') {
        setTimeout(scroll, 320)
      } else {
        navigate('/')
        setTimeout(scroll, 480)
      }
    } else {
      onClose()
    }
  }

  const panelBg = isDark
    ? 'rgba(5,8,20,0.96)'
    : 'rgba(255,255,255,0.97)'
  const borderColor = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)'
  const textMuted   = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(15,23,42,0.45)'
  const textMain    = isDark ? 'rgba(255,255,255,0.88)' : 'rgb(15,23,42)'

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropV}
            initial="hidden" animate="show" exit="exit"
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
            onClick={onClose}
            aria-hidden
          />

          {/* Slide panel */}
          <motion.div
            id="mobile-nav-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            variants={panelV}
            initial="hidden" animate="show" exit="exit"
            className="fixed top-0 right-0 bottom-0 z-50 flex flex-col w-full max-w-[340px]"
            style={{
              background: panelBg,
              backdropFilter: 'blur(28px)',
              WebkitBackdropFilter: 'blur(28px)',
              borderLeft: `1px solid ${borderColor}`,
            }}
          >
            {/* Ambient gradient accent */}
            <div
              aria-hidden
              className="absolute top-0 right-0 pointer-events-none"
              style={{
                width: 260, height: 260,
                background: 'radial-gradient(circle at top right, rgba(59,130,246,0.1), rgba(139,92,246,0.06) 40%, transparent 70%)',
              }}
            />
            <div
              aria-hidden
              className="absolute bottom-0 left-0 pointer-events-none"
              style={{
                width: 200, height: 200,
                background: 'radial-gradient(circle at bottom left, rgba(139,92,246,0.07), transparent 60%)',
              }}
            />

            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-5 flex-shrink-0"
              style={{ borderBottom: `1px solid ${borderColor}` }}
            >
              <Logo isDark={isDark} />
              <motion.button
                type="button"
                onClick={onClose}
                aria-label="Close navigation"
                className="flex items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                style={{
                  width: 34, height: 34,
                  background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
                  border: `1px solid ${borderColor}`,
                  color: textMain,
                }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.9, rotate: 90 }}
                transition={{ type: 'spring', stiffness: 380, damping: 18 }}
              >
                <X className="w-[15px] h-[15px]" strokeWidth={2.2} />
              </motion.button>
            </div>

            {/* Nav links */}
            <nav
              aria-label="Mobile navigation"
              className="flex-1 overflow-y-auto overscroll-contain px-4 py-3"
            >
              {NAV_ITEMS.map((item, i) => (
                <motion.div
                  key={item.key}
                  variants={itemV}
                  custom={i}
                  initial="hidden"
                  animate="show"
                >
                  <Link
                    to={item.href}
                    onClick={(e) => handleNavClick(item, e)}
                    className="group flex items-center justify-between w-full px-4 py-3.5 rounded-2xl mb-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    style={{ color: textMain }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    <span className="text-[15px] font-medium">{item.label}</span>
                    <ArrowRight
                      className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
                      style={{ color: textMuted }}
                      strokeWidth={1.8}
                    />
                  </Link>
                </motion.div>
              ))}

              {/* Divider */}
              <div
                className="my-4 mx-4"
                style={{ height: 1, background: borderColor }}
              />

              {/* External links */}
              {[
                { label: 'Documentation', href: '/docs' },
                { label: 'Blog',          href: '/blog' },
                { label: 'Status',        href: '/status' },
              ].map((link, i) => (
                <motion.div
                  key={link.href}
                  variants={itemV}
                  custom={NAV_ITEMS.length + i + 1}
                  initial="hidden"
                  animate="show"
                >
                  <Link
                    to={link.href}
                    onClick={onClose}
                    className="flex items-center justify-between w-full px-4 py-3 rounded-2xl mb-0.5 focus-visible:outline-none"
                    style={{ color: textMuted }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'
                      e.currentTarget.style.color = textMain
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = textMuted
                    }}
                  >
                    <span className="text-[13.5px] font-medium">{link.label}</span>
                    <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.8} />
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Footer CTAs */}
            <motion.div
              className="flex-shrink-0 px-5 pb-6 pt-4 flex flex-col gap-3"
              style={{ borderTop: `1px solid ${borderColor}` }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.3, ease: EASE }}
            >
              {/* Theme toggle row */}
              <div className="flex items-center justify-between px-1 mb-1">
                <span className="text-[12px] font-medium" style={{ color: textMuted }}>
                  Appearance
                </span>
                <ThemeToggle compact />
              </div>

              <Link
                to="/login"
                onClick={onClose}
                className="w-full text-center py-3 rounded-full text-[14px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                style={{
                  color: textMain,
                  background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.04)',
                  border: `1px solid ${borderColor}`,
                }}
              >
                Log in
              </Link>

              <Link
                to="/register"
                onClick={onClose}
                className="w-full text-center py-3 rounded-full text-[14px] font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #7c3aed 100%)',
                  boxShadow: '0 4px 20px rgba(59,130,246,0.35)',
                }}
              >
                Start Free →
              </Link>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
