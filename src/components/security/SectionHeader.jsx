import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'

const EASE = [0.25, 0.4, 0.25, 1]

function CharReveal({ text, style, delay = 0 }) {
  return (
    <span style={{ display: 'inline', ...style }}>
      {text.split('').map((ch, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 22, filter: 'blur(5px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.42, delay: delay + i * 0.022, ease: EASE }}
          style={{ display: 'inline-block', whiteSpace: ch === ' ' ? 'pre' : undefined }}
        >{ch}</motion.span>
      ))}
    </span>
  )
}

export default function SectionHeader({ isDark, inView }) {
  const muted = isDark ? 'rgba(148,163,184,0.85)' : 'rgba(71,85,105,0.9)'
  const line2Delay = 0.1 + 19 * 0.022   // after "Enterprise Security"
  const line2bDelay = line2Delay + 15 * 0.022  // after "Meets Real-Time "

  return (
    <div className="text-center max-w-3xl mx-auto mb-20">
      <motion.div
        initial={{ opacity: 0, y: -14, filter: 'blur(8px)' }}
        animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
        transition={{ duration: 0.5, ease: EASE }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
        style={{
          background:     isDark ? 'rgba(16,185,129,0.1)' : 'rgba(16,185,129,0.08)',
          border:         '1px solid rgba(16,185,129,0.28)',
          color:          isDark ? '#34d399' : '#059669',
          backdropFilter: 'blur(14px)',
        }}
      >
        <Shield className="w-3.5 h-3.5" />
        Enterprise Trust
      </motion.div>

      <h2 className="text-4xl lg:text-[52px] font-extrabold tracking-tight leading-[1.1] mb-6">
        {inView && (
          <>
            <span style={{ display: 'block' }}>
              <CharReveal
                text="Enterprise Security"
                style={{
                  background: 'linear-gradient(135deg,#3b82f6,#22d3ee)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
                delay={0.1}
              />
            </span>
            <span style={{ display: 'block', color: isDark ? '#f1f5f9' : '#0f172a' }}>
              <CharReveal text="Meets Real-Time " delay={line2Delay} />
              <CharReveal
                text="Intelligence"
                style={{
                  background: 'linear-gradient(135deg,#8b5cf6,#a78bfa)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
                delay={line2bDelay}
              />
            </span>
          </>
        )}
      </h2>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.9, ease: EASE }}
        className="text-base lg:text-lg leading-relaxed max-w-2xl mx-auto"
        style={{ color: muted }}
      >
        Protect every examination with enterprise-grade security while monitoring candidates,
        organizations, certificates, and platform performance through real-time analytics.
      </motion.p>
    </div>
  )
}
