import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const EASE = [0.25, 0.4, 0.25, 1]

export default function FooterColumn({ title, links, isDark, delay = 0 }) {
  const mutedColor  = isDark ? 'rgba(255,255,255,0.38)' : 'rgba(15,23,42,0.38)'
  const normalColor = isDark ? 'rgba(255,255,255,0.58)' : 'rgba(15,23,42,0.55)'
  const hoverColor  = isDark ? 'rgba(255,255,255,0.92)' : 'rgb(15,23,42)'

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, ease: EASE, delay }}
    >
      {/* Column title */}
      <h3
        className="text-[11px] font-bold uppercase tracking-[0.12em] mb-4"
        style={{ color: mutedColor }}
      >
        {title}
      </h3>

      {/* Links */}
      <ul className="flex flex-col gap-2.5" role="list">
        {links.map(({ label, to }) => (
          <li key={label}>
            <motion.div whileHover={{ x: 2 }} transition={{ duration: 0.15 }}>
              <Link
                to={to}
                className="group relative inline-flex items-center text-[13.5px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                style={{ color: normalColor, transition: 'color 0.2s ease' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = hoverColor }}
                onMouseLeave={(e) => { e.currentTarget.style.color = normalColor }}
              >
                {label}
                {/* Gradient underline slides in on hover */}
                <motion.span
                  aria-hidden
                  className="absolute -bottom-px left-0 h-px rounded-full"
                  style={{ background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)' }}
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.2, ease: EASE }}
                />
              </Link>
            </motion.div>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}
