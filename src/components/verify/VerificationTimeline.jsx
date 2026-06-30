import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { FileCheck, Lock, ShieldCheck } from 'lucide-react'

const EASE = [0.25, 0.4, 0.25, 1]

const STEPS = [
  { Icon: FileCheck,  label: 'Issued',          desc: 'Certificate generated & cryptographically signed', color: '#3b82f6' },
  { Icon: Lock,       label: 'Stored Securely',  desc: 'Stored on immutable, tamper-evident ledger',       color: '#8b5cf6' },
  { Icon: ShieldCheck,label: 'Verified',         desc: 'Instantly authenticated by anyone, anywhere',      color: '#10b981' },
]

export default function VerificationTimeline({ isDark }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' })

  const t1 = isDark ? '#f1f5f9' : '#0f172a'
  const t2 = isDark ? 'rgba(148,163,184,0.75)' : 'rgba(71,85,105,0.8)'

  return (
    <div ref={ref} className="max-w-3xl mx-auto px-4 mb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: EASE }}
        className="text-center mb-10"
      >
        <div className="text-2xl font-extrabold mb-2" style={{ color: t1 }}>How Verification Works</div>
        <div className="text-sm" style={{ color: t2 }}>Every certificate follows a 3-step trust chain</div>
      </motion.div>

      {/* Steps row */}
      <div className="relative flex items-start justify-between gap-4">
        {/* Connecting SVG line */}
        <div className="absolute top-7 left-[calc(16.6%)] right-[calc(16.6%)] h-px pointer-events-none" style={{ zIndex: 0 }}>
          <svg width="100%" height="2" preserveAspectRatio="none" viewBox="0 0 100 2">
            <motion.line x1="0" y1="1" x2="100" y2="1"
              stroke="url(#timelineGrad)"
              strokeWidth="1.5"
              strokeDasharray="4 3"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={inView ? { pathLength: 1, opacity: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.4, ease: EASE }}
            />
            <defs>
              <linearGradient id="timelineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%"   stopColor="#3b82f6" stopOpacity="0.6" />
                <stop offset="50%"  stopColor="#8b5cf6" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.6" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {STEPS.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, delay: 0.2 + i * 0.18, ease: EASE }}
            className="flex-1 flex flex-col items-center text-center relative z-10"
          >
            {/* Icon circle */}
            <motion.div
              animate={inView ? {
                boxShadow: [`0 0 0 0 ${step.color}40`, `0 0 0 12px ${step.color}00`, `0 0 0 0 ${step.color}40`]
              } : {}}
              transition={{ duration: 2.5, delay: 0.6 + i * 0.25, repeat: Infinity, ease: 'easeInOut' }}
              className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
              style={{
                background: `${step.color}18`,
                border: `1.5px solid ${step.color}40`,
              }}
            >
              <step.Icon className="w-6 h-6" style={{ color: step.color }} />
            </motion.div>

            {/* Step number */}
            <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: step.color }}>
              Step {i + 1}
            </div>

            <div className="text-sm font-bold mb-1" style={{ color: t1 }}>{step.label}</div>
            <div className="text-xs leading-relaxed max-w-[140px]" style={{ color: t2 }}>{step.desc}</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
