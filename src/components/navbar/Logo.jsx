import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'

export default function Logo({ isDark }) {
  return (
    <Link
      to="/"
      aria-label="CertiByt — Home"
      className="flex items-center gap-2.5 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg"
    >
      {/* Icon badge */}
      <motion.div
        className="relative flex items-center justify-center rounded-[10px] flex-shrink-0"
        style={{
          width: 32,
          height: 32,
          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          boxShadow: '0 2px 12px rgba(59,130,246,0.35)',
        }}
        whileHover={{ rotate: -10, scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 380, damping: 16 }}
      >
        <ShieldCheck className="w-[17px] h-[17px] text-white" strokeWidth={2.2} />
        {/* Hover glow ring */}
        <motion.span
          className="absolute inset-0 rounded-[10px]"
          initial={{ opacity: 0, scale: 1 }}
          whileHover={{ opacity: 1, scale: 1.25 }}
          transition={{ duration: 0.3 }}
          style={{ boxShadow: '0 0 18px rgba(99,102,241,0.7)', background: 'transparent' }}
        />
      </motion.div>

      {/* Wordmark */}
      <motion.div
        className="flex items-baseline gap-0 leading-none"
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1], delay: 0.15 }}
      >
        <span
          className="text-[17px] font-black tracking-tight"
          style={{ color: isDark ? 'rgba(255,255,255,0.95)' : 'rgb(15,23,42)' }}
        >
          Certi
        </span>
        <span
          className="text-[17px] font-black tracking-tight"
          style={{ color: '#3b82f6' }}
        >
          Byt
        </span>
      </motion.div>
    </Link>
  )
}
