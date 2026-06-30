import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Calendar, CheckCircle } from 'lucide-react'

const EASE = [0.25, 0.4, 0.25, 1]

const FLOAT_BADGES = [
  { label: '✓ Secure Exams',           color: '#22d3ee', pos: { top: -16, left: '8%'  } },
  { label: '✓ Verified Certificates',  color: '#f59e0b', pos: { top: -16, right: '8%' } },
  { label: '✓ Enterprise Ready',       color: '#3b82f6', pos: { top: '36%', left: -24 } },
  { label: '✓ 99.9% Uptime',           color: '#10b981', pos: { top: '36%', right: -24 } },
  { label: '✓ Multi-Tenant Platform',  color: '#8b5cf6', pos: { bottom: -16, left: '8%'  } },
  { label: '✓ AI Proctoring',          color: '#f43f5e', pos: { bottom: -16, right: '8%' } },
]

const PRE_GENERATED_PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  x:     (i * 71 + 13) % 100,
  y:     (i * 53 + 27) % 100,
  size:  ((i * 29) % 3) + 1.5,
  dur:   12 + ((i * 17) % 16),
  dx:    (((i * 11) % 18) - 9),
  dy:    -14 - ((i * 7) % 14),
  color: ['#3b82f6','#8b5cf6','#22d3ee'][i % 3],
  op:    0.1 + ((i * 13) % 10) / 100,
}))

function FloatBadge({ label, color, pos, delay, isDark }) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className="absolute hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full z-20 select-none"
      style={{
        ...pos,
        background:     isDark ? 'rgba(8,12,28,0.88)' : 'rgba(255,255,255,0.92)',
        border:         `1px solid ${color}30`,
        backdropFilter: 'blur(16px)',
        boxShadow:      `0 4px 16px rgba(0,0,0,0.2), 0 0 10px ${color}18`,
        whiteSpace:     'nowrap',
      }}
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4, ease: EASE }}
    >
      <motion.span
        animate={reduced ? {} : { y: [-2.5, 2.5, -2.5] }}
        transition={{ duration: 3.5 + delay * 0.3, repeat: Infinity, ease: 'easeInOut', delay: delay * 0.2 }}
        className="text-xs font-semibold"
        style={{ color: isDark ? 'rgba(241,245,249,0.85)' : 'rgba(15,23,42,0.8)' }}
      >
        {label}
      </motion.span>
    </motion.div>
  )
}

export default function FinalCTA({ isDark, inView }) {
  const reduced = useReducedMotion()
  const t2 = isDark ? 'rgba(148,163,184,0.85)' : 'rgba(71,85,105,0.88)'

  return (
    <div className="relative">
      {/* Float badges */}
      {FLOAT_BADGES.map((b, i) => (
        <FloatBadge key={i} {...b} delay={1.0 + i * 0.12} isDark={isDark} />
      ))}

      {/* CTA card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97, filter: 'blur(12px)' }}
        animate={inView ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' } : {}}
        transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
        className="relative rounded-[36px] overflow-hidden"
        style={{
          padding:        2,
          background:     'linear-gradient(135deg,rgba(59,130,246,0.4),rgba(139,92,246,0.3),rgba(34,211,238,0.25))',
          boxShadow:      isDark
            ? '0 40px 100px rgba(0,0,0,0.6), 0 0 80px rgba(59,130,246,0.12)'
            : '0 40px 100px rgba(0,0,0,0.1), 0 0 60px rgba(59,130,246,0.08)',
        }}
      >
        <div className="relative rounded-[34px] overflow-hidden"
          style={{
            background: isDark
              ? 'linear-gradient(150deg,rgba(8,12,26,0.97),rgba(4,6,18,0.99))'
              : 'linear-gradient(150deg,rgba(255,255,255,0.97),rgba(248,250,252,0.99))',
            backdropFilter: 'blur(32px)',
          }}
        >
          {/* Animated background inside card */}
          <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Dot grid */}
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle, ${isDark ? 'rgba(59,130,246,0.025)' : 'rgba(59,130,246,0.03)'} 1px, transparent 1px)`,
              backgroundSize: '36px 36px',
            }} />
            {/* Glow orbs */}
            <motion.div className="absolute rounded-full"
              style={{ width: 600, height: 600, top: '-40%', left: '-10%',
                background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 65%)',
                filter: 'blur(2px)',
              }}
              animate={reduced ? {} : { x:[0,30,-15,0], y:[0,-22,11,0] }}
              transition={{ duration: 26, repeat: Infinity, ease:'easeInOut' }}
            />
            <motion.div className="absolute rounded-full"
              style={{ width: 500, height: 500, bottom: '-30%', right: '-5%',
                background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 65%)',
                filter: 'blur(2px)',
              }}
              animate={reduced ? {} : { x:[0,-24,12,0], y:[0,18,-9,0] }}
              transition={{ duration: 32, repeat: Infinity, ease:'easeInOut', delay: 5 }}
            />
            <motion.div className="absolute rounded-full"
              style={{ width: 300, height: 300, top: '20%', right: '15%',
                background: 'radial-gradient(circle, rgba(34,211,238,0.07) 0%, transparent 65%)',
              }}
              animate={reduced ? {} : { x:[0,-16,8,0], y:[0,14,-7,0] }}
              transition={{ duration: 20, repeat: Infinity, ease:'easeInOut', delay: 3 }}
            />
            {/* Particles */}
            {!reduced && PRE_GENERATED_PARTICLES.map((p, i) => (
              <motion.div key={i} className="absolute rounded-full"
                style={{ width:p.size, height:p.size, left:`${p.x}%`, top:`${p.y}%`,
                  background:p.color, opacity:0 }}
                animate={{ x:[0,p.dx,0], y:[0,p.dy,0], opacity:[0,p.op,0] }}
                transition={{ duration:p.dur, repeat:Infinity, delay:i*0.4, ease:'easeInOut' }}
              />
            ))}
          </div>

          {/* Card content */}
          <div className="relative z-10 px-8 py-16 lg:px-16 lg:py-20 text-center">
            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.4, ease: EASE }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-8"
              style={{
                background:     isDark ? 'rgba(16,185,129,0.1)' : 'rgba(16,185,129,0.08)',
                border:         '1px solid rgba(16,185,129,0.25)',
                color:          isDark ? '#34d399' : '#059669',
                backdropFilter: 'blur(12px)',
              }}
            >
              <motion.div className="w-1.5 h-1.5 rounded-full" style={{ background: '#10b981' }}
                animate={{ opacity:[1,0.25,1] }} transition={{ duration:1.4, repeat:Infinity }} />
              Trusted by 500+ Organizations Worldwide
            </motion.div>

            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
              animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
              transition={{ delay: 0.4, duration: 0.6, ease: EASE }}
              className="text-4xl lg:text-[56px] font-extrabold tracking-tight leading-[1.08] mb-6"
              style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}
            >
              Ready to Modernize{' '}
              <br className="hidden lg:block" />
              <span style={{
                background: 'linear-gradient(135deg,#3b82f6,#8b5cf6,#22d3ee)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Your Examination Platform?
              </span>
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.52, duration: 0.5, ease: EASE }}
              className="text-base lg:text-lg leading-relaxed mb-10 max-w-2xl mx-auto"
              style={{ color: t2 }}
            >
              Join universities, organizations, and enterprises using CertiByt to conduct secure
              online examinations, issue verified certificates, and manage assessments from one
              enterprise platform.
            </motion.p>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.62, duration: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-4 mb-10"
            >
              {['No credit card required', 'Free 14-day trial', 'Cancel anytime'].map((item, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" style={{ color: '#10b981' }} />
                  <span className="text-xs font-medium" style={{ color: t2 }}>{item}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.68, duration: 0.5, ease: EASE }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              {/* Primary */}
              <Link to="/register" tabIndex={0}>
                <motion.div
                  whileHover={{ scale: 1.04, y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  className="group flex items-center gap-2.5 px-8 py-4 rounded-full text-base font-bold text-white"
                  style={{
                    background:  'linear-gradient(135deg,#3b82f6,#8b5cf6)',
                    boxShadow:   '0 12px 40px rgba(59,130,246,0.38), 0 4px 16px rgba(0,0,0,0.2)',
                    transition:  'box-shadow 0.3s ease',
                  }}
                >
                  Start Free
                  <motion.span
                    initial={{ x: 0 }}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.span>
                </motion.div>
              </Link>

              {/* Secondary */}
              <Link to="/demo" tabIndex={0}>
                <motion.div
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2.5 px-8 py-4 rounded-full text-base font-semibold"
                  style={{
                    background:     isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                    border:         isDark ? '1px solid rgba(255,255,255,0.14)' : '1px solid rgba(0,0,0,0.12)',
                    color:          isDark ? '#f1f5f9' : '#0f172a',
                    backdropFilter: 'blur(12px)',
                    boxShadow:      isDark ? '0 4px 16px rgba(0,0,0,0.3)' : '0 4px 16px rgba(0,0,0,0.06)',
                  }}
                >
                  <Calendar className="w-4.5 h-4.5" />
                  Book a Demo
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
