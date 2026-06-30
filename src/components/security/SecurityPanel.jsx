import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  Shield, Key, Mail, Users, Building2, Globe, Github,
  Gauge, Upload, Lock, Radio, AlertTriangle, LogOut,
} from 'lucide-react'

const EASE = [0.25, 0.4, 0.25, 1]

const SHIELD_PATH = 'M50 4 L88 18 L88 52 Q88 76 50 96 Q12 76 12 52 L12 18 Z'

const BADGES_LEFT = [
  { label: 'JWT Auth',       Icon: Key,           color: '#3b82f6' },
  { label: 'Email OTP',      Icon: Mail,          color: '#22d3ee' },
  { label: 'Role-Based',     Icon: Users,         color: '#10b981' },
  { label: 'Multi-Tenant',   Icon: Building2,     color: '#8b5cf6' },
  { label: 'Google SSO',     Icon: Globe,         color: '#f97316' },
  { label: 'GitHub Login',   Icon: Github,        color: '#94a3b8' },
]
const BADGES_RIGHT = [
  { label: 'Rate Limiting',  Icon: Gauge,         color: '#f43f5e' },
  { label: 'Secure Uploads', Icon: Upload,        color: '#22d3ee' },
  { label: 'HTTPS Enforced', Icon: Lock,          color: '#10b981' },
  { label: 'IP Protection',  Icon: Radio,         color: '#3b82f6' },
  { label: 'Brute Force',    Icon: AlertTriangle, color: '#f59e0b' },
  { label: 'Auto Logout',    Icon: LogOut,        color: '#8b5cf6' },
]

const STATS = [
  { label: 'Protected Sessions',    value: 100,  suffix: '%',  color: '#3b82f6' },
  { label: 'Encrypted Traffic',     value: 100,  suffix: '%',  color: '#10b981' },
  { label: 'Platform Availability', value: 99.9, suffix: '%',  color: '#8b5cf6' },
]

function Badge({ label, Icon, color, delay, isDark, floatDelay }) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.38, ease: EASE }}
      whileHover={{
        scale: 1.07,
        y: -3,
        boxShadow: `0 8px 24px rgba(0,0,0,0.3), 0 0 18px ${color}40`,
        borderColor: `${color}70`,
      }}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl cursor-default select-none"
      style={{
        background:     isDark ? 'rgba(8,12,28,0.88)' : 'rgba(255,255,255,0.92)',
        border:         `1px solid ${color}25`,
        backdropFilter: 'blur(14px)',
        boxShadow:      `0 4px 14px rgba(0,0,0,0.18), 0 0 8px ${color}12`,
        whiteSpace:     'nowrap',
      }}
    >
      <motion.div
        animate={reduced ? {} : { y: [-2, 2, -2] }}
        transition={{ duration: 3.5 + floatDelay * 0.4, repeat: Infinity, ease: 'easeInOut', delay: floatDelay }}
      >
        <Icon style={{ width: 11, height: 11, color, flexShrink: 0 }} />
      </motion.div>
      <span className="text-[10px] font-semibold"
        style={{ color: isDark ? 'rgba(241,245,249,0.82)' : 'rgba(15,23,42,0.78)' }}>
        {label}
      </span>
    </motion.div>
  )
}

function StatBar({ stat, idx, inView, isDark }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    const target = stat.value
    const steps = 80
    const dur = 1600
    const interval = dur / steps
    let step = 0
    const t = setInterval(() => {
      step++
      const progress = step / steps
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.min(eased * target, target)
      setCount(Number(current.toFixed(1)))
      if (step >= steps) clearInterval(t)
    }, interval)
    return () => clearInterval(t)
  }, [inView, stat.value])

  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs font-medium"
          style={{ color: isDark ? 'rgba(148,163,184,0.8)' : 'rgba(71,85,105,0.8)' }}>
          {stat.label}
        </span>
        <span className="text-sm font-bold tabular-nums" style={{ color: stat.color }}>
          {count}{stat.suffix}
        </span>
      </div>
      <div className="h-1.5 rounded-full"
        style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(to right, ${stat.color}, ${stat.color}88)` }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${stat.value}%` } : {}}
          transition={{ duration: 1.6, delay: 0.2 + idx * 0.15, ease: [0.25, 0.4, 0.25, 1] }}
        />
      </div>
    </div>
  )
}

function AnimatedShield({ isDark, inView }) {
  const reduced = useReducedMotion()

  return (
    <div className="flex items-center justify-center" style={{ height: 220, position: 'relative' }}>
      {/* Pulse rings */}
      {!reduced && [1, 1.35, 1.7].map((s, i) => (
        <motion.div key={i} className="absolute rounded-full"
          style={{ width: 120, height: 120, border: '1px solid rgba(59,130,246,0.18)' }}
          animate={{ scale: [s, s+0.12, s], opacity: [0.5, 0.08, 0.5] }}
          transition={{ duration: 3 + i * 0.8, repeat: Infinity, ease: 'easeInOut', delay: i * 0.9 }}
        />
      ))}

      {/* Glow */}
      <motion.div className="absolute"
        style={{ width: 160, height: 180, zIndex: 0 }}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 1.3, duration: 0.8 }}
      >
        <div style={{
          position: 'absolute', inset: -30,
          background: 'radial-gradient(ellipse, rgba(59,130,246,0.22) 0%, transparent 70%)',
          filter: 'blur(18px)',
        }} />
      </motion.div>

      {/* Shield SVG */}
      <motion.svg viewBox="0 0 100 100"
        style={{ width: 120, height: 136, position: 'relative', zIndex: 1 }}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.35, duration: 0.3 }}
      >
        <defs>
          <linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
          <linearGradient id="sfill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(59,130,246,0.12)" />
            <stop offset="100%" stopColor="rgba(34,211,238,0.06)" />
          </linearGradient>
        </defs>
        {/* Fill */}
        <motion.path d={SHIELD_PATH} fill="url(#sfill)"
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7, duration: 0.5 }}
        />
        {/* Inner subtle border */}
        <motion.path d={SHIELD_PATH} fill="none" stroke="rgba(59,130,246,0.12)" strokeWidth="1"
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.4 }}
        />
        {/* Draw stroke */}
        <motion.path d={SHIELD_PATH} fill="none" stroke="url(#sg)" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : {}}
          transition={{ duration: 1.4, delay: 0.4, ease: 'easeInOut' }}
        />
        {/* Checkmark inside shield */}
        <motion.path d="M34 50 L44 60 L66 38" fill="none" stroke="url(#sg)"
          strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 1.8, ease: EASE }}
        />
      </motion.svg>

      {/* Lock badge center */}
      <motion.div className="absolute flex items-center justify-center"
        style={{ zIndex: 2, top: '50%', left: '50%', transform: 'translate(-50%,-42%)' }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={inView ? { opacity: 0, scale: 1 } : {}}
      />
    </div>
  )
}

export default function SecurityPanel({ isDark, inView }) {
  const card = {
    background: isDark
      ? 'linear-gradient(150deg,rgba(10,14,30,0.94),rgba(5,8,22,0.97))'
      : 'linear-gradient(150deg,rgba(255,255,255,0.9),rgba(248,250,252,0.95))',
    border: isDark ? '1px solid rgba(59,130,246,0.14)' : '1px solid rgba(59,130,246,0.12)',
    boxShadow: isDark
      ? '0 32px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)'
      : '0 32px 80px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.95)',
  }
  const t1 = isDark ? '#f1f5f9' : '#0f172a'
  const divider = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)'

  return (
    <motion.div
      initial={{ opacity: 0, x: -40, filter: 'blur(14px)' }}
      animate={inView ? { opacity: 1, x: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
      className="relative rounded-[32px] overflow-hidden"
      style={{ ...card, backdropFilter: 'blur(24px)', padding: '36px 28px' }}
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px" style={{
        width: '70%',
        background: 'linear-gradient(to right,transparent,rgba(59,130,246,0.4),transparent)',
      }} />

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-2xl flex-shrink-0"
          style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.22)' }}>
          <Shield className="w-5 h-5" style={{ color: '#3b82f6' }} />
        </div>
        <div>
          <div className="text-sm font-bold" style={{ color: t1 }}>Security Center</div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <motion.div className="w-1.5 h-1.5 rounded-full" style={{ background: '#10b981' }}
              animate={{ opacity: [1, 0.25, 1] }} transition={{ duration: 1.4, repeat: Infinity }} />
            <span className="text-[11px]" style={{ color: '#10b981' }}>All systems protected</span>
          </div>
        </div>
      </div>

      {/* Shield + badge columns */}
      <div className="flex items-center gap-3 mb-6">
        {/* Left badges */}
        <div className="flex flex-col gap-2 flex-shrink-0">
          {BADGES_LEFT.map((b, i) => (
            <Badge key={i} {...b} delay={1.8 + i * 0.1} floatDelay={i * 0.5} isDark={isDark} />
          ))}
        </div>

        {/* Shield */}
        <div className="flex-1 min-w-0">
          <AnimatedShield isDark={isDark} inView={inView} />
        </div>

        {/* Right badges */}
        <div className="flex flex-col gap-2 flex-shrink-0">
          {BADGES_RIGHT.map((b, i) => (
            <Badge key={i} {...b} delay={1.8 + (i + 6) * 0.1} floatDelay={(i + 6) * 0.5} isDark={isDark} />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="mb-5 h-px" style={{ background: divider }} />

      {/* Progress stats */}
      <div className="space-y-4">
        {STATS.map((stat, i) => (
          <StatBar key={i} stat={stat} idx={i} inView={inView} isDark={isDark} />
        ))}
      </div>
    </motion.div>
  )
}
