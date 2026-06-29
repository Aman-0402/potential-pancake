import { useScroll, motion, useReducedMotion } from 'framer-motion'

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const reduced = useReducedMotion()

  if (reduced) return null

  return (
    <div
      aria-hidden
      className="absolute top-0 left-0 right-0 overflow-hidden pointer-events-none"
      style={{ height: 2, borderRadius: '999px 999px 0 0' }}
    >
      <motion.div
        className="h-full origin-left"
        style={{
          scaleX: scrollYProgress,
          background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)',
          opacity: 0.85,
        }}
      />
    </div>
  )
}
