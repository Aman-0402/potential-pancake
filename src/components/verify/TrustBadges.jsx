import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Lock, ShieldCheck, QrCode, Globe, Building2 } from 'lucide-react'

const EASE = [0.25, 0.4, 0.25, 1]

const BADGES = [
  { Icon: Lock,       label: '256-bit Encryption',  color: '#3b82f6', glow: 'rgba(59,130,246,0.18)'  },
  { Icon: ShieldCheck,label: 'Tamper Proof',        color: '#10b981', glow: 'rgba(16,185,129,0.18)'  },
  { Icon: QrCode,     label: 'QR Verified',         color: '#8b5cf6', glow: 'rgba(139,92,246,0.18)'  },
  { Icon: Globe,      label: 'Public Verification', color: '#22d3ee', glow: 'rgba(34,211,238,0.18)'  },
  { Icon: Building2,  label: 'Enterprise Secure',   color: '#f59e0b', glow: 'rgba(245,158,11,0.18)'  },
]

export default function TrustBadges({ isDark }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -40px 0px' })

  const t1 = isDark ? '#f1f5f9' : '#0f172a'

  return (
    <div ref={ref} className="max-w-4xl mx-auto px-4 mb-20">
      <div className="flex flex-wrap justify-center gap-3">
        {BADGES.map((b, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16, scale: 0.92 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: i * 0.1, ease: EASE }}
            whileHover={{ scale: 1.06, y: -3 }}
            className="flex items-center gap-2.5 px-5 py-3 rounded-2xl cursor-default"
            style={{
              background:     isDark ? 'rgba(10,14,30,0.92)' : 'rgba(255,255,255,0.92)',
              border:         `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
              backdropFilter: 'blur(16px)',
              boxShadow:      isDark
                ? `0 8px 24px rgba(0,0,0,0.3), 0 0 20px ${b.glow}`
                : `0 8px 24px rgba(0,0,0,0.05), 0 0 12px ${b.glow}`,
              transition:     'box-shadow 0.3s ease',
            }}
          >
            <div className="flex items-center justify-center w-7 h-7 rounded-lg"
              style={{ background: `${b.color}18`, border: `1px solid ${b.color}30` }}>
              <b.Icon className="w-3.5 h-3.5" style={{ color: b.color }} />
            </div>
            <span className="text-sm font-semibold" style={{ color: t1 }}>{b.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
