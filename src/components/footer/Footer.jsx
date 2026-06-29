import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useTheme } from '../../contexts/ThemeContext'
import FooterCTA from './FooterCTA'
import AnimatedDivider from './AnimatedDivider'
import FooterColumns from './FooterColumns'
import NewsletterCard from './NewsletterCard'
import FooterBottom from './FooterBottom'

// Pre-generated particles (never recalculated on re-render)
const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  x:     (i * 73 + 17) % 100,
  y:     (i * 47 + 33) % 100,
  size:  ((i * 31) % 4) + 2,
  dur:   12 + ((i * 19) % 18),
  dy:    -18 - ((i * 9) % 22),
  dx:    (((i * 13) % 24) - 12),
  color: ['#3b82f6', '#8b5cf6', '#22d3ee'][i % 3],
  op:    0.12 + ((i * 11) % 14) / 100,
}))

const EASE = [0.25, 0.4, 0.25, 1]

export default function Footer() {
  const { theme } = useTheme()
  const isDark    = theme === 'dark'
  const reduced   = useReducedMotion()
  const ref       = useRef(null)
  const inView    = useInView(ref, { once: true, margin: '0px 0px -80px 0px' })

  const gridColor = isDark ? 'rgba(59,130,246,0.022)' : 'rgba(59,130,246,0.03)'
  const bgBase    = isDark ? 'rgb(4,6,18)' : 'rgb(248,250,252)'

  return (
    <footer
      ref={ref}
      aria-label="Site footer"
      className="relative overflow-hidden"
      style={{ background: bgBase }}
    >
      {/* ── Animated background ──────────────────────────────────────────── */}
      <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Dot grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle, ${gridColor} 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />

        {/* Primary radial glow — blue */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 900, height: 900,
            top: '-15%', left: '-10%',
            background: isDark
              ? 'radial-gradient(circle, rgba(59,130,246,0.07) 0%, rgba(59,130,246,0.02) 40%, transparent 70%)'
              : 'radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 60%)',
            filter: 'blur(1px)',
          }}
          animate={reduced ? {} : {
            x: [0, 30, -15, 0],
            y: [0, -20, 10, 0],
            scale: [1, 1.06, 0.97, 1],
          }}
          transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Secondary radial glow — purple */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 700, height: 700,
            bottom: '-10%', right: '-5%',
            background: isDark
              ? 'radial-gradient(circle, rgba(139,92,246,0.07) 0%, rgba(139,92,246,0.02) 40%, transparent 70%)'
              : 'radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 60%)',
            filter: 'blur(1px)',
          }}
          animate={reduced ? {} : {
            x: [0, -25, 12, 0],
            y: [0, 18, -10, 0],
            scale: [1, 0.95, 1.04, 1],
          }}
          transition={{ duration: 32, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
        />

        {/* Tertiary glow — cyan top-right */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 500, height: 500,
            top: '5%', right: '10%',
            background: isDark
              ? 'radial-gradient(circle, rgba(34,211,238,0.04) 0%, transparent 65%)'
              : 'radial-gradient(circle, rgba(34,211,238,0.03) 0%, transparent 65%)',
          }}
          animate={reduced ? {} : {
            x: [0, 20, -10, 0],
            y: [0, -15, 8, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        />

        {/* Floating particles */}
        {!reduced && PARTICLES.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: p.size, height: p.size,
              left: `${p.x}%`, top: `${p.y}%`,
              background: p.color,
              opacity: 0,
            }}
            animate={{
              x: [0, p.dx, 0],
              y: [0, p.dy, 0],
              opacity: [0, p.op, 0],
            }}
            transition={{
              duration: p.dur,
              repeat: Infinity,
              delay: i * 0.38,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <motion.div
        initial={reduced ? {} : { opacity: 0, y: 48 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.75, ease: EASE }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        style={{ paddingTop: 120, paddingBottom: 50 }}
      >
        {/* Top CTA */}
        <FooterCTA isDark={isDark} />

        {/* Divider */}
        <div className="my-16">
          <AnimatedDivider isDark={isDark} />
        </div>

        {/* 5-column link grid */}
        <FooterColumns isDark={isDark} />

        {/* Newsletter card */}
        <div className="mt-14">
          <NewsletterCard isDark={isDark} />
        </div>

        {/* Bottom divider + bar */}
        <div className="mt-12">
          <FooterBottom isDark={isDark} />
        </div>
      </motion.div>
    </footer>
  )
}
