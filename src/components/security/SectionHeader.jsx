import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'

const EASE = [0.25, 0.4, 0.25, 1]

const GOLD_GRAD = {
  background: 'linear-gradient(135deg,#C9A84C,#E4C36E)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
}

function CharReveal({ text, delay = 0, charStyle }) {
  return (
    <span style={{ display: 'inline' }}>
      {text.split('').map((ch, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 22, filter: 'blur(5px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.42, delay: delay + i * 0.022, ease: EASE }}
          style={{
            display: 'inline-block',
            whiteSpace: ch === ' ' ? 'pre' : undefined,
            ...charStyle,
          }}
        >{ch}</motion.span>
      ))}
    </span>
  )
}

export default function SectionHeader({ isDark, inView }) {
  const muted    = isDark ? 'rgba(210,204,188,0.85)' : 'rgba(90,85,70,0.9)'
  const plain    = isDark ? '#E8E4D7' : '#1C1C1E'
  const line2Delay  = 0.1 + 19 * 0.022
  const line2bDelay = line2Delay + 16 * 0.022

  return (
    <div className="text-center max-w-3xl mx-auto mb-20">
      <h2 className="text-4xl lg:text-[52px] font-extrabold tracking-tight leading-[1.1] mb-6">
        {inView && (
          <>
            <span style={{ display: 'block' }}>
              <CharReveal text="Enterprise Security" delay={0.1} charStyle={GOLD_GRAD} />
            </span>
            <span style={{ display: 'block', color: plain }}>
              <CharReveal text="Meets Real-Time " delay={line2Delay} charStyle={{ color: plain }} />
              <CharReveal text="Intelligence" delay={line2bDelay} charStyle={GOLD_GRAD} />
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
