import { motion, useReducedMotion } from 'framer-motion'
import { ShieldCheck, Award, Globe, Lock } from 'lucide-react'

const EASE = [0.25, 0.4, 0.25, 1]

function CharReveal({ text, style, delay = 0 }) {
  return (
    <span style={{ display: 'inline', ...style }}>
      {text.split('').map((ch, i) => (
        <motion.span key={i}
          initial={{ opacity: 0, y: 22, filter: 'blur(5px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.42, delay: delay + i * 0.022, ease: EASE }}
          style={{ display: 'inline-block', whiteSpace: ch === ' ' ? 'pre' : undefined }}
        >{ch}</motion.span>
      ))}
    </span>
  )
}

function FloatingIllustration({ isDark }) {
  const reduced = useReducedMotion()
  const card = isDark ? 'rgba(10,14,30,0.92)' : 'rgba(255,255,255,0.92)'
  const bdr  = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: 'blur(12px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.7, delay: 0.8, ease: EASE }}
      className="relative mx-auto"
      style={{ width: 300, height: 220 }}
    >
      {/* Main certificate card */}
      <motion.div
        animate={reduced ? {} : { y: [-4, 4, -4] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute rounded-2xl"
        style={{
          top: 20, left: '50%', transform: 'translateX(-50%)',
          width: 220, height: 145,
          background: isDark
            ? 'linear-gradient(135deg,rgba(12,16,34,0.98),rgba(6,10,24,0.99))'
            : 'linear-gradient(135deg,rgba(255,255,255,0.98),rgba(248,250,252,0.99))',
          border: '1px solid rgba(201,168,76,0.25)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.35), 0 0 40px rgba(201,168,76,0.1)',
          backdropFilter: 'blur(16px)',
          padding: 16,
        }}
      >
        {/* Logo row */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-400 to-violet-500" />
          <span className="text-[11px] font-bold" style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>CertiByt</span>
        </div>
        <div className="text-[9px] font-medium mb-1" style={{ color: 'rgba(148,163,184,0.6)' }}>Certificate of Completion</div>
        <div className="text-[13px] font-extrabold mb-0.5" style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>Ahmed Al-Rashid</div>
        <div className="text-[10px]" style={{ color: '#C9A84C' }}>AWS Cloud Practitioner</div>
        <div className="flex items-end justify-between mt-2">
          <div className="text-[8px]" style={{ color: 'rgba(148,163,184,0.5)' }}>Jan 15, 2026 · CBT-2026-8F92D4A1</div>
          {/* Mini QR */}
          <div className="grid grid-cols-5 gap-px" style={{ width: 24, height: 24 }}>
            {Array.from({ length: 25 }, (_, i) => (
              <div key={i} className="rounded-[1px]"
                style={{ background: ((i * 7 + Math.floor(i / 5) * 3) % 3 === 0) ? '#3b82f6' : 'transparent', width: 4, height: 4 }} />
            ))}
          </div>
        </div>
        {/* Verified stamp */}
        <div className="absolute -bottom-3 -right-3 flex items-center justify-center w-10 h-10 rounded-full"
          style={{ background: 'linear-gradient(135deg,#10b981,#22d3ee)', boxShadow: '0 4px 14px rgba(16,185,129,0.4)' }}>
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
      </motion.div>

      {/* Shield badge — floating top right */}
      <motion.div
        animate={reduced ? {} : { y: [-5, 3, -5], x: [0, 3, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl"
        style={{
          top: 0, right: 0,
          background: card, border: '1px solid rgba(16,185,129,0.25)',
          boxShadow: '0 6px 20px rgba(0,0,0,0.2), 0 0 10px rgba(16,185,129,0.15)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <Lock className="w-3 h-3" style={{ color: '#10b981' }} />
        <span className="text-[10px] font-semibold" style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>Tamper-Proof</span>
      </motion.div>

      {/* Verified badge — bottom left */}
      <motion.div
        animate={reduced ? {} : { y: [3, -4, 3], x: [0, -2, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl"
        style={{
          bottom: 0, left: 0,
          background: card, border: '1px solid rgba(59,130,246,0.25)',
          boxShadow: '0 6px 20px rgba(0,0,0,0.2), 0 0 10px rgba(59,130,246,0.15)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <Award className="w-3 h-3" style={{ color: '#3b82f6' }} />
        <span className="text-[10px] font-semibold" style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>Verified ✓</span>
      </motion.div>
    </motion.div>
  )
}

const STATS = [
  { value: '500K+',  label: 'Certs Verified', color: '#C9A84C'  },
  { value: '500+',   label: 'Organizations',   color: '#E4C36E'  },
  { value: '99.9%',  label: 'Uptime SLA',      color: '#AF8E38'  },
]

export default function VerifyHero({ isDark }) {
  const t1 = isDark ? '#f1f5f9' : '#0f172a'
  const t2 = isDark ? 'rgba(148,163,184,0.85)' : 'rgba(71,85,105,0.88)'

  return (
    <div className="text-center pt-32 pb-16 max-w-4xl mx-auto px-4">
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: -16, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.5, ease: EASE }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-7"
        style={{
          background:     isDark ? 'rgba(201,168,76,0.1)' : 'rgba(201,168,76,0.08)',
          border:         '1px solid rgba(201,168,76,0.3)',
          color:          isDark ? '#E4C36E' : '#9E7E28',
          backdropFilter: 'blur(14px)',
        }}
      >
        <ShieldCheck className="w-3.5 h-3.5" />
        Public Certificate Verification
      </motion.div>

      {/* Heading */}
      <h1 className="text-5xl lg:text-[64px] font-extrabold tracking-tight leading-[1.06] mb-5">
        <CharReveal
          text="Verify Any"
          style={{ display: 'block', color: t1 }}
          delay={0.08}
        />
        <span style={{ display: 'block' }}>
          <CharReveal
            text="CertiByt "
            style={{
              background: 'linear-gradient(135deg,#C9A84C,#E4C36E)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
            delay={0.08 + 10 * 0.022}
          />
          <CharReveal
            text="Certificate"
            style={{
              background: 'linear-gradient(135deg,#AF8E38,#C9A84C)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
            delay={0.08 + 18 * 0.022}
          />
        </span>
      </h1>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.75, ease: EASE }}
        className="text-base lg:text-lg leading-relaxed mb-10 max-w-xl mx-auto"
        style={{ color: t2 }}
      >
        Instantly verify the authenticity of certificates issued through the CertiByt
        Enterprise Examination Platform. No login required.
      </motion.p>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.88, ease: EASE }}
        className="flex items-center justify-center gap-8 mb-12"
      >
        {STATS.map((s, i) => (
          <div key={i} className="text-center">
            <div className="text-xl font-extrabold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs mt-0.5" style={{ color: t2 }}>{s.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Illustration */}
      <FloatingIllustration isDark={isDark} />
    </div>
  )
}
