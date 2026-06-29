import { motion } from 'framer-motion'

const EASE = [0.25, 0.4, 0.25, 1]

export default function FooterBottom({ isDark }) {
  const muted = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(15,23,42,0.35)'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: EASE, delay: 0.2 }}
      className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6"
      style={{ borderTop: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)' }}
    >
      {/* Left: Copyright */}
      <p className="text-[12px] font-medium order-2 sm:order-1" style={{ color: muted }}>
        © 2026 CertiByt. All Rights Reserved.
      </p>

      {/* Center: Made with */}
      <p className="text-[12px] font-medium order-1 sm:order-2 text-center" style={{ color: muted }}>
        Made with{' '}
        <motion.span
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="inline-block text-rose-400"
          aria-hidden
        >
          ❤️
        </motion.span>{' '}
        for secure online examinations.
      </p>

      {/* Right: Version */}
      <div className="order-3">
        <span
          className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold font-mono"
          style={{
            color: muted,
            background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
            border: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.07)',
          }}
        >
          v1.0.0
        </span>
      </div>
    </motion.div>
  )
}
