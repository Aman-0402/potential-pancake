import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function CTAButton({ label, to, variant = 'primary', isDark, fullWidth = false }) {
  const isPrimary = variant === 'primary'

  return (
    <motion.div
      whileHover={{ scale: 1.04, y: -1.5 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 380, damping: 18 }}
      style={{ width: fullWidth ? '100%' : undefined }}
    >
      <Link
        to={to}
        className={`relative inline-flex items-center justify-center gap-1.5 rounded-full text-[13px] font-semibold tracking-[0.01em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 overflow-hidden ${
          fullWidth ? 'w-full' : ''
        }`}
        style={{
          padding: '7px 16px',
          ...(isPrimary
            ? {
                background: 'linear-gradient(135deg, #3b82f6 0%, #7c3aed 100%)',
                color: 'white',
                boxShadow: '0 2px 16px rgba(59,130,246,0.28), inset 0 1px 0 rgba(255,255,255,0.15)',
              }
            : {
                background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
                color: isDark ? 'rgba(255,255,255,0.85)' : 'rgb(30,41,59)',
                border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)',
              }),
        }}
      >
        {label}

        {isPrimary && (
          <motion.span
            className="flex items-center"
            whileHover={{ x: 2 }}
            transition={{ duration: 0.18 }}
          >
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
          </motion.span>
        )}

        {/* Sheen on hover for primary */}
        {isPrimary && (
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full pointer-events-none"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%)' }}
          />
        )}
      </Link>
    </motion.div>
  )
}
