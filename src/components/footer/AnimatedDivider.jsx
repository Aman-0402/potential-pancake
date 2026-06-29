import { motion, useReducedMotion } from 'framer-motion'

export default function AnimatedDivider({ isDark }) {
  const reduced = useReducedMotion()

  return (
    <div className="relative" style={{ height: 1 }}>
      {/* Static gradient line */}
      <div
        style={{
          position: 'absolute', inset: 0,
          background: isDark
            ? 'linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.35) 30%, rgba(139,92,246,0.5) 50%, rgba(34,211,238,0.35) 70%, transparent 100%)'
            : 'linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.2) 30%, rgba(139,92,246,0.3) 50%, rgba(34,211,238,0.2) 70%, transparent 100%)',
        }}
      />
      {/* Animated glow pulse */}
      {!reduced && (
        <motion.div
          aria-hidden
          style={{
            position: 'absolute', inset: '-2px 0',
            background: isDark
              ? 'linear-gradient(90deg, transparent 10%, rgba(99,102,241,0.6) 40%, rgba(139,92,246,0.7) 50%, rgba(99,102,241,0.6) 60%, transparent 90%)'
              : 'linear-gradient(90deg, transparent 10%, rgba(99,102,241,0.25) 40%, rgba(139,92,246,0.3) 50%, rgba(99,102,241,0.25) 60%, transparent 90%)',
            filter: 'blur(3px)',
          }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </div>
  )
}
