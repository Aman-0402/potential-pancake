import { motion } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router-dom'

export default function NavItem({ label, href, section, isDark, onClick }) {
  const location  = useLocation()
  const navigate  = useNavigate()

  // Active detection
  const isActive = section
    ? location.pathname === '/' && location.hash === `#${section}`
    : href === '/'
      ? location.pathname === '/' && !location.hash
      : location.pathname === href

  const handleClick = (e) => {
    if (section) {
      e.preventDefault()
      const scroll = () => {
        const el = document.getElementById(section)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      if (location.pathname === '/') {
        scroll()
      } else {
        navigate('/')
        setTimeout(scroll, 320)
      }
    }
    onClick?.()
  }

  return (
    <motion.div
      whileHover={{ y: -1.5 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className="relative"
    >
      <Link
        to={href}
        onClick={handleClick}
        aria-current={isActive ? 'page' : undefined}
        className="relative inline-flex items-center px-2 py-1 text-[13.5px] font-medium rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        style={{
          color: isActive
            ? (isDark ? 'white' : 'rgb(15,23,42)')
            : (isDark ? 'rgba(255,255,255,0.55)' : 'rgba(15,23,42,0.55)'),
          transition: 'color 0.2s ease',
        }}
        onMouseEnter={(e) => {
          if (!isActive) e.currentTarget.style.color = isDark ? 'rgba(255,255,255,0.9)' : 'rgb(15,23,42)'
        }}
        onMouseLeave={(e) => {
          if (!isActive) e.currentTarget.style.color = isDark ? 'rgba(255,255,255,0.55)' : 'rgba(15,23,42,0.55)'
        }}
      >
        {label}

        {/* Hover gradient underline */}
        <motion.span
          aria-hidden
          className="absolute bottom-0 left-2 right-2 rounded-full"
          style={{
            height: 1.5,
            background: 'linear-gradient(90deg, #C9A84C, #E4C36E)',
            scaleX: 0,
            transformOrigin: 'left',
          }}
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.22, ease: [0.25, 0.4, 0.25, 1] }}
        />

        {/* Active indicator */}
        {isActive && (
          <motion.span
            layoutId="nav-active-pill"
            aria-hidden
            className="absolute bottom-0 left-2 right-2 rounded-full"
            style={{
              height: 1.5,
              background: 'linear-gradient(90deg, #C9A84C, #E4C36E)',
            }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
        )}
      </Link>
    </motion.div>
  )
}
