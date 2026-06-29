import { motion } from 'framer-motion'

const EASE = [0.25, 0.4, 0.25, 1]

// All 3 bars start centered; top/bottom shift via y
export default function MobileMenuButton({ isOpen, onClick, isDark }) {
  const barColor = isDark ? 'rgba(255,255,255,0.9)' : 'rgb(15,23,42)'
  const barStyle = {
    position: 'absolute',
    left: 0, right: 0,
    height: 1.5,
    top: '50%',
    marginTop: -0.75,
    borderRadius: 999,
    background: barColor,
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
      aria-expanded={isOpen}
      aria-controls="mobile-nav-panel"
      className="lg:hidden flex-shrink-0 flex items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      style={{
        width: 36,
        height: 36,
        background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
        border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)',
      }}
      whileTap={{ scale: 0.88 }}
    >
      {/* 3-bar hamburger → X morph */}
      <div style={{ position: 'relative', width: 18, height: 10 }}>
        {/* Top bar: shifts -4.25px up in closed, center + 45° when open */}
        <motion.span
          style={barStyle}
          animate={isOpen
            ? { y: 0,    rotate: 45  }
            : { y: -4.25, rotate: 0  }
          }
          transition={{ duration: 0.28, ease: EASE }}
        />
        {/* Middle bar: fades */}
        <motion.span
          style={barStyle}
          animate={{ opacity: isOpen ? 0 : 1, scaleX: isOpen ? 0.4 : 1 }}
          transition={{ duration: 0.2 }}
        />
        {/* Bottom bar: shifts +4.25px down in closed, center + -45° when open */}
        <motion.span
          style={barStyle}
          animate={isOpen
            ? { y: 0,   rotate: -45 }
            : { y: 4.25, rotate: 0  }
          }
          transition={{ duration: 0.28, ease: EASE }}
        />
      </div>
    </motion.button>
  )
}
