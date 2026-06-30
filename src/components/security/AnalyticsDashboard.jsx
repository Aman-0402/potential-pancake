import { useState, useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Building2, Award, Users, FileText, TrendingUp, CheckCircle, Tag, Bell } from 'lucide-react'

const EASE = [0.25, 0.4, 0.25, 1]

// ── Pre-computed chart data ──────────────────────────────────────────────────
const LINE_DATA = [38, 52, 44, 61, 49, 71, 58, 76, 67, 85, 78, 92]
const LW = 240, LH = 56
const LINE_PTS = LINE_DATA.map((v, i) => [
  (i / (LINE_DATA.length - 1)) * LW,
  LH - (v / 100) * LH,
])
const LINE_PATH = LINE_PTS.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
const LINE_FILL = `${LINE_PATH} L${LW},${LH} L0,${LH} Z`

const BAR_DATA = [52, 68, 45, 82, 60, 90, 74]
const BAR_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

const KPIS = [
  { label: 'Orgs',        countTo: 524,  suffix: '',   Icon: Building2, color: '#22d3ee' },
  { label: 'Certificates',countTo: 248,  suffix: 'K+', Icon: Award,     color: '#f59e0b' },
  { label: 'Candidates',  countTo: 1,    suffix: 'M+', Icon: Users,     color: '#3b82f6' },
  { label: 'Live Exams',  countTo: 47,   suffix: '',   Icon: FileText,  color: '#10b981' },
]

const FEED_ITEMS = [
  { text: 'Ahmed earned AWS cert',    time: '2s',  Icon: Award,        color: '#f59e0b' },
  { text: 'TechCorp Inc. joined',     time: '8s',  Icon: Building2,    color: '#22d3ee' },
  { text: 'Voucher batch generated',  time: '15s', Icon: Tag,          color: '#8b5cf6' },
  { text: 'Priya started React Exam', time: '23s', Icon: FileText,     color: '#f97316' },
  { text: 'Sara completed ISO 27001', time: '45s', Icon: CheckCircle,  color: '#10b981' },
  { text: 'UniLearn Academy joined',  time: '1m',  Icon: Building2,    color: '#3b82f6' },
  { text: '1,000th certificate 🎉',   time: '2m',  Icon: Award,        color: '#f59e0b' },
  { text: 'Security audit passed',    time: '5m',  Icon: Bell,         color: '#10b981' },
]
const FEED_DOUBLED = [...FEED_ITEMS, ...FEED_ITEMS]

const FLOAT_CARDS = [
  { label: '99.9%', sub: 'Uptime SLA',     color: '#10b981', pos: { top: -16, left: -16 } },
  { label: '250K+', sub: 'Certificates',   color: '#f59e0b', pos: { top: -16, right: -16 } },
  { label: '1M+',   sub: 'Candidates',     color: '#3b82f6', pos: { bottom: 80, right: -24 } },
  { label: '500+',  sub: 'Organizations',  color: '#8b5cf6', pos: { bottom: 80, left: -24 } },
]

// ── KPI counter ──────────────────────────────────────────────────────────────
function KPICard({ kpi, idx, inView, isDark }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    const target = kpi.countTo
    let step = 0
    const steps = 60
    const t = setInterval(() => {
      step++
      const p = step / steps
      const eased = 1 - Math.pow(1 - p, 3)
      setCount(Math.min(Math.round(eased * target), target))
      if (step >= steps) clearInterval(t)
    }, 1400 / steps)
    return () => clearInterval(t)
  }, [inView, kpi.countTo])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.5 + idx * 0.08, duration: 0.4, ease: EASE }}
      whileHover={{ y: -2, boxShadow: `0 8px 24px rgba(0,0,0,0.25), 0 0 14px ${kpi.color}22` }}
      className="flex-1 rounded-xl p-2.5"
      style={{
        background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
        border: `1px solid ${kpi.color}22`,
      }}
    >
      <div className="flex items-center gap-1.5 mb-1.5">
        <kpi.Icon style={{ width: 11, height: 11, color: kpi.color, flexShrink: 0 }} />
        <span className="text-[9px] font-semibold"
          style={{ color: isDark ? 'rgba(148,163,184,0.7)' : 'rgba(71,85,105,0.7)' }}>
          {kpi.label}
        </span>
      </div>
      <div className="text-base font-extrabold tabular-nums leading-none"
        style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>
        {count}{kpi.suffix}
      </div>
    </motion.div>
  )
}

// ── Activity feed (infinite scroll) ─────────────────────────────────────────
function ActivityFeed({ isDark }) {
  const reduced = useReducedMotion()
  const t1 = isDark ? 'rgba(241,245,249,0.85)' : 'rgba(15,23,42,0.82)'
  const t2 = isDark ? 'rgba(148,163,184,0.55)' : 'rgba(71,85,105,0.6)'

  return (
    <div className="overflow-hidden" style={{ height: 148 }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          animation: reduced ? 'none' : 'feedScroll 20s linear infinite',
        }}
      >
        {FEED_DOUBLED.map((item, i) => (
          <div key={i} className="flex items-center gap-2 py-1.5 flex-shrink-0">
            <div className="w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: `${item.color}15`, border: `1px solid ${item.color}25` }}>
              <item.Icon style={{ width: 9, height: 9, color: item.color }} />
            </div>
            <span className="text-[10px] flex-1 truncate" style={{ color: t1 }}>{item.text}</span>
            <span className="text-[9px] flex-shrink-0" style={{ color: t2 }}>{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Line chart ───────────────────────────────────────────────────────────────
function LineChart({ inView }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-[9px] font-semibold uppercase tracking-wide" style={{ color: 'rgba(148,163,184,0.6)' }}>
          Pass Rate — 12mo
        </span>
        <span className="text-[9px] font-bold" style={{ color: '#10b981' }}>
          <TrendingUp style={{ width: 8, height: 8, display:'inline', marginRight:2 }} />+31%
        </span>
      </div>
      <svg viewBox={`0 0 ${LW} ${LH}`} style={{ width: '100%', height: 56, overflow: 'visible' }}>
        <defs>
          <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Fill area */}
        <motion.path d={LINE_FILL} fill="url(#lineFill)"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
        />
        {/* Line */}
        <motion.path d={LINE_PATH} fill="none"
          stroke="url(#lg2)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : {}}
          transition={{ duration: 1.4, delay: 0.6, ease: 'easeInOut' }}
        />
        {/* End dot */}
        <motion.circle cx={LINE_PTS[LINE_PTS.length-1][0]} cy={LINE_PTS[LINE_PTS.length-1][1]}
          r="3" fill="#3b82f6"
          initial={{ opacity: 0, scale: 0 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 2, duration: 0.3 }}
        />
        <defs>
          <linearGradient id="lg2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

// ── Bar chart ────────────────────────────────────────────────────────────────
function BarChart({ inView }) {
  const BH = 48, BW = 10, GAP = 6
  const total = BAR_DATA.length * (BW + GAP) - GAP

  return (
    <div>
      <span className="text-[9px] font-semibold uppercase tracking-wide" style={{ color: 'rgba(148,163,184,0.6)' }}>
        Weekly Exams
      </span>
      <svg viewBox={`0 0 ${total} ${BH + 14}`} style={{ width: '100%', height: 62, marginTop: 6 }}>
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        {BAR_DATA.map((v, i) => {
          const barH = (v / 100) * BH
          const x = i * (BW + GAP)
          const y = BH - barH
          return (
            <g key={i}>
              <motion.rect x={x} y={y} width={BW} rx={2}
                fill="url(#barGrad)"
                initial={{ height: 0, y: BH }}
                animate={inView ? { height: barH, y } : {}}
                transition={{ duration: 0.7, delay: 0.5 + i * 0.07, ease: EASE }}
              />
              <text x={x + BW/2} y={BH + 10} textAnchor="middle"
                fontSize="6" fill="rgba(148,163,184,0.55)">{BAR_DAYS[i]}</text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

// ── Progress ring ────────────────────────────────────────────────────────────
function ProgressRing({ inView, isDark }) {
  const r = 28, circ = 2 * Math.PI * r
  const pct = 0.94
  return (
    <div className="flex flex-col items-center justify-center" style={{ minWidth: 80 }}>
      <svg width="68" height="68" viewBox="0 0 68 68">
        <circle cx="34" cy="34" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
        <motion.circle
          cx="34" cy="34" r={r} fill="none"
          stroke="url(#ringGrad)" strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={inView ? { strokeDashoffset: circ * (1 - pct) } : {}}
          transition={{ duration: 1.6, delay: 0.7, ease: EASE }}
          transform="rotate(-90 34 34)"
        />
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        <text x="34" y="31" textAnchor="middle" fontSize="11" fontWeight="800"
          fill={isDark ? '#f1f5f9' : '#0f172a'}>94%</text>
        <text x="34" y="41" textAnchor="middle" fontSize="6"
          fill="rgba(148,163,184,0.6)">Pass Rate</text>
      </svg>
    </div>
  )
}

// ── Floating metric pill ─────────────────────────────────────────────────────
function FloatPill({ label, sub, color, pos, delay, isDark }) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className="absolute flex items-center gap-2 px-3 py-2 rounded-2xl z-20"
      style={{
        ...pos,
        background:     isDark ? 'rgba(8,12,28,0.9)' : 'rgba(255,255,255,0.95)',
        border:         `1px solid ${color}30`,
        backdropFilter: 'blur(16px)',
        boxShadow:      `0 8px 24px rgba(0,0,0,0.25), 0 0 12px ${color}18`,
        whiteSpace:     'nowrap',
      }}
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4, ease: EASE }}
    >
      <motion.div
        animate={reduced ? {} : { y: [-3, 3, -3] }}
        transition={{ duration: 4 + delay, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="w-2 h-2 rounded-full" style={{ background: color }} />
      </motion.div>
      <div>
        <div className="text-sm font-extrabold leading-none" style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>
          {label}
        </div>
        <div className="text-[9px] mt-0.5" style={{ color: isDark ? 'rgba(148,163,184,0.65)' : 'rgba(71,85,105,0.7)' }}>
          {sub}
        </div>
      </div>
    </motion.div>
  )
}

// ── Main dashboard ───────────────────────────────────────────────────────────
export default function AnalyticsDashboard({ isDark, inView }) {
  const t2 = isDark ? 'rgba(148,163,184,0.6)' : 'rgba(71,85,105,0.65)'
  const divider = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'

  return (
    <motion.div
      initial={{ opacity: 0, x: 40, filter: 'blur(14px)' }}
      animate={inView ? { opacity: 1, x: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.7, ease: EASE, delay: 0.35 }}
      className="relative"
    >
      {/* Floating metric pills */}
      {FLOAT_CARDS.map((fc, i) => (
        <FloatPill key={i} {...fc} delay={2.2 + i * 0.15} isDark={isDark} />
      ))}

      {/* Dashboard card */}
      <div className="relative rounded-[32px] overflow-hidden"
        style={{
          background: isDark
            ? 'linear-gradient(150deg,rgba(8,12,28,0.96),rgba(4,6,18,0.98))'
            : 'linear-gradient(150deg,rgba(255,255,255,0.92),rgba(248,250,252,0.96))',
          border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
          boxShadow: isDark
            ? '0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)'
            : '0 32px 80px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.95)',
          backdropFilter: 'blur(24px)',
        }}
      >
        {/* Top accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4"
          style={{ background:'linear-gradient(to right,transparent,rgba(34,211,238,0.35),transparent)' }} />

        {/* Browser chrome */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b"
          style={{ background: isDark ? 'rgba(5,8,18,0.8)' : 'rgba(248,250,252,0.8)', borderColor: divider }}>
          <div className="flex gap-1.5">
            {['#ef4444','#f59e0b','#22c55e'].map((c,i) => (
              <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background:c, opacity:0.8 }} />
            ))}
          </div>
          <div className="flex-1 mx-3 flex items-center gap-2 px-3 py-1 rounded-lg text-[10px]"
            style={{ background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)', color: t2 }}>
            <div className="w-2 h-2 rounded-full border flex-shrink-0"
              style={{ borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)' }} />
            <span className="truncate">app.certibyt.com/dashboard</span>
          </div>
          <div className="flex items-center gap-1.5">
            <motion.div className="w-1.5 h-1.5 rounded-full" style={{ background: '#ef4444' }}
              animate={{ opacity:[1,0.2,1] }} transition={{ duration:1.2, repeat:Infinity }} />
            <span className="text-[9px] font-semibold" style={{ color:'#ef4444' }}>LIVE</span>
          </div>
        </div>

        {/* Dashboard body */}
        <div className="p-5">
          {/* KPI row */}
          <div className="flex gap-2.5 mb-4">
            {KPIS.map((kpi, i) => (
              <KPICard key={i} kpi={kpi} idx={i} inView={inView} isDark={isDark} />
            ))}
          </div>

          {/* Mid row: line chart + activity feed */}
          <div className="grid grid-cols-[1fr_auto] gap-3 mb-4">
            <div className="rounded-2xl p-3"
              style={{
                background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.025)',
                border: divider ? `1px solid ${divider}` : undefined,
              }}>
              <LineChart inView={inView} />
            </div>
            <div className="rounded-2xl p-3 overflow-hidden" style={{
              width: 180,
              background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.025)',
            }}>
              <div className="text-[9px] font-semibold uppercase tracking-wide mb-2" style={{ color: t2 }}>
                Live Activity
              </div>
              <ActivityFeed isDark={isDark} />
            </div>
          </div>

          {/* Bottom row: bar chart + progress ring */}
          <div className="grid grid-cols-[1fr_auto] gap-3 items-center">
            <div className="rounded-2xl p-3"
              style={{
                background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.025)',
              }}>
              <BarChart inView={inView} />
            </div>
            <ProgressRing inView={inView} isDark={isDark} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
