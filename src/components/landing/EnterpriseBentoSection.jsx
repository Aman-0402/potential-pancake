import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion, useInView } from 'framer-motion'
import { useTheme } from '../../contexts/ThemeContext'
import {
  BarChart2, Award, Shield, Building2, FileText, Tag,
  Eye, Activity, CheckCircle, Lock, Users, TrendingUp,
  Zap, AlertTriangle, Globe, Copy, Bell, Database,
} from 'lucide-react'

// ─── helpers ──────────────────────────────────────────────────────────────────
const cv = (n, op = 1) =>
  op < 1 ? `rgb(var(--c-dark-${n}) / ${op})` : `rgb(var(--c-dark-${n}))`

const EASE = [0.25, 0.4, 0.25, 1]

const CARD_V = {
  hidden: { opacity: 0, y: 28, scale: 0.96, filter: 'blur(10px)' },
  show: (d) => ({
    opacity: 1, y: 0, scale: 1, filter: 'blur(0px)',
    transition: { duration: 0.6, delay: d, ease: EASE },
  }),
}

// ─── Animated counter hook ─────────────────────────────────────────────────────
function useCounter(target, active, reduced, delay = 0) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!active) return
    if (reduced) { setVal(target); return }
    const dur   = 1400
    const t0    = performance.now() + delay
    let raf
    const tick  = (now) => {
      if (now < t0) { raf = requestAnimationFrame(tick); return }
      const p   = Math.min((now - t0) / dur, 1)
      const e   = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(target * e))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, reduced, target, delay])
  return val
}

// ─── FeatureCard wrapper (cursor spotlight + hover) ───────────────────────────
function FeatureCard({ children, accent = '#22d3ee', gridStyle = {}, delay = 0, isDark, label }) {
  const ref     = useRef(null)
  const [pos,   setPos]  = useState({ x: 0, y: 0 })
  const [hot,   setHot]  = useState(false)
  const reduced = useReducedMotion()

  const onMove = useCallback((e) => {
    if (reduced) return
    const r = ref.current?.getBoundingClientRect()
    if (r) setPos({ x: e.clientX - r.left, y: e.clientY - r.top })
  }, [reduced])

  const bg     = isDark ? 'rgba(6,10,24,0.88)' : 'rgba(255,255,255,0.92)'
  const border = hot
    ? `1px solid ${accent}50`
    : isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.06)'
  const shadow = hot
    ? `0 24px 64px rgba(0,0,0,0.45),0 0 0 1px ${accent}25,0 0 40px ${accent}0d`
    : isDark ? '0 4px 28px rgba(0,0,0,0.28)' : '0 4px 28px rgba(0,0,0,0.07)'

  return (
    <motion.article
      ref={ref}
      aria-label={label}
      tabIndex={0}
      className="relative rounded-[30px] overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
      style={{ background: bg, backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
        border, boxShadow: shadow, transition: 'border 0.3s ease, box-shadow 0.3s ease', ...gridStyle }}
      variants={CARD_V} custom={delay}
      initial="hidden" whileInView="show"
      viewport={{ once: true, margin: '-40px' }}
      onMouseMove={onMove}
      onMouseEnter={() => setHot(true)}
      onMouseLeave={() => setHot(false)}
      whileHover={reduced ? {} : { scale: 1.02, y: -4 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
    >
      {/* Top glow line */}
      <div aria-hidden className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: `linear-gradient(to right,transparent,${accent}55,transparent)` }} />

      {/* Cursor spotlight */}
      {hot && !reduced && (
        <div aria-hidden className="pointer-events-none absolute inset-0 z-10 transition-none"
          style={{ background: `radial-gradient(280px circle at ${pos.x}px ${pos.y}px,${accent}12,transparent 65%)` }} />
      )}

      <div className="relative z-20 h-full">
        {children}
      </div>
    </motion.article>
  )
}

// ─── Card 1: Analytics ────────────────────────────────────────────────────────
const BARS = [45, 68, 52, 88, 62, 91, 74, 95, 80, 97]

function AnalyticsDemo({ isDark }) {
  const ref       = useRef(null)
  const inView    = useInView(ref, { once: true })
  const reduced   = useReducedMotion()
  const passRate  = useCounter(94,  inView, reduced, 200)
  const examToday = useCounter(847, inView, reduced, 400)
  const activeNow = useCounter(23,  inView, reduced, 600)

  const STATS = [
    { label: 'Pass Rate',    val: passRate,  unit: '%',  color: '#10b981' },
    { label: 'Exams Today',  val: examToday, unit: '',   color: '#22d3ee' },
    { label: 'Active Now',   val: activeNow, unit: '',   color: '#f59e0b' },
  ]

  return (
    <div className="p-6 h-full flex flex-col gap-5" ref={ref}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(34,211,238,0.12)', border: '1px solid rgba(34,211,238,0.2)' }}>
              <BarChart2 style={{ width: 16, height: 16, color: '#22d3ee' }} />
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-widest"
              style={{ color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)' }}>Analytics</span>
          </div>
          <h3 className="text-xl font-extrabold text-white">Platform Insights</h3>
          <p className="text-[12px] mt-0.5" style={{ color: cv(400) }}>Real-time performance metrics</p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold"
          style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)' }}>
          <motion.div className="w-1.5 h-1.5 rounded-full bg-green-400"
            animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
          Live
        </div>
      </div>

      {/* Stat counters */}
      <div className="grid grid-cols-3 gap-3">
        {STATS.map((s, i) => (
          <div key={i} className="rounded-2xl p-3"
            style={{ background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
              border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.05)' }}>
            <div className="text-2xl font-black mb-0.5" style={{ color: s.color }}>
              {s.val.toLocaleString()}{s.unit}
            </div>
            <div className="text-[10px]" style={{ color: cv(400) }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="flex-1 flex flex-col">
        <div className="text-[10px] font-semibold mb-2" style={{ color: cv(500) }}>
          Pass rate — last 10 sessions
        </div>
        <div className="flex-1 flex items-end gap-1">
          {BARS.map((h, i) => (
            <div key={i} className="flex-1">
              <motion.div
                className="w-full rounded-t-md"
                style={{ background: i === BARS.length - 1
                  ? 'linear-gradient(to top,#22d3ee,#8b5cf6)'
                  : 'linear-gradient(to top,rgba(34,211,238,0.5),rgba(139,92,246,0.35))' }}
                initial={{ height: 0 }}
                animate={inView ? { height: `${(h / 100) * 90}%` } : { height: 0 }}
                transition={{ duration: 0.7, delay: 0.3 + i * 0.055, ease: EASE }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Trend line */}
      <div className="flex items-center gap-2 text-[11px]" style={{ color: cv(400) }}>
        <TrendingUp className="w-3.5 h-3.5" style={{ color: '#10b981' }} />
        <span style={{ color: '#10b981', fontWeight: 600 }}>↑ 12%</span>
        vs last month
      </div>
    </div>
  )
}

// ─── Card 2: Digital Certificates ────────────────────────────────────────────
const QR_PAT = [1,0,1,1,0, 0,1,0,1,0, 1,1,1,0,1, 0,0,1,0,1, 1,0,1,1,0]

function CertificateDemo({ isDark }) {
  return (
    <div className="p-5 h-full flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.2)' }}>
          <Award style={{ width: 14, height: 14, color: '#f59e0b' }} />
        </div>
        <div>
          <div className="text-sm font-extrabold text-white leading-tight">Digital Certificates</div>
          <div className="text-[10px]" style={{ color: cv(400) }}>Auto-issued on completion</div>
        </div>
      </div>

      {/* Mini certificate */}
      <div className="flex-1 relative overflow-hidden rounded-2xl"
        style={{ background: 'linear-gradient(135deg,rgba(15,23,42,0.98),rgba(30,27,75,0.95))',
          border: '1px solid rgba(245,158,11,0.3)' }}>
        {/* Shimmer */}
        <motion.div className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.07) 50%,transparent 100%)' }}
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.8, ease: 'linear' }} />

        <div className="p-4 h-full flex flex-col justify-between relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-md bg-gradient-to-br from-amber-400 to-yellow-500" />
              <span className="text-[10px] font-bold text-white">CertiByt</span>
            </div>
            <div className="flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
              style={{ background: 'rgba(34,197,94,0.12)', color: '#22c55e' }}>
              <CheckCircle className="w-2.5 h-2.5" /> Verified
            </div>
          </div>

          <div className="text-center">
            <div className="text-[9px] text-slate-400 mb-0.5">This certifies that</div>
            <div className="text-[13px] font-extrabold text-white">Ahmed Al-Rashid</div>
            <div className="text-[9px] text-amber-400 mt-0.5 font-semibold">AWS Cloud Practitioner</div>
          </div>

          <div className="flex items-end justify-between">
            <div className="text-[8px] text-slate-500 leading-relaxed">
              Score: 94%<br />Distinction
            </div>
            <div className="grid grid-cols-5 gap-[2px]">
              {QR_PAT.map((on, i) => (
                <div key={i} className="w-[6px] h-[6px] rounded-[1px]"
                  style={{ background: on ? 'rgba(245,158,11,0.85)' : 'transparent' }} />
              ))}
            </div>
          </div>
        </div>

        {/* Watermark */}
        <div aria-hidden className="absolute inset-0 flex items-center justify-center select-none pointer-events-none"
          style={{ opacity: 0.03, fontSize: 26, fontWeight: 900, letterSpacing: 5, transform: 'rotate(-20deg)', color: 'white' }}>
          CERTIFIED
        </div>
      </div>
    </div>
  )
}

// ─── Card 3: Enterprise Security ──────────────────────────────────────────────
const SEC_TAGS = [
  { label: 'JWT Auth',  color: '#22d3ee' },
  { label: 'OTP',       color: '#8b5cf6' },
  { label: 'RBAC',      color: '#10b981' },
  { label: 'TLS 1.3',   color: '#f59e0b' },
]

function SecurityDemo({ isDark }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <div className="p-5 h-full flex flex-col gap-4" ref={ref}>
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.2)' }}>
          <Shield style={{ width: 14, height: 14, color: '#22d3ee' }} />
        </div>
        <div>
          <div className="text-sm font-extrabold text-white">Enterprise Security</div>
          <div className="text-[10px]" style={{ color: cv(400) }}>Bank-grade protection</div>
        </div>
      </div>

      {/* Animated shield */}
      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        <div className="relative">
          {/* Outer ring */}
          <motion.div
            className="absolute rounded-full border"
            style={{ width: 72, height: 72, top: '50%', left: '50%',
              transform: 'translate(-50%,-50%)', borderColor: 'rgba(34,211,238,0.2)' }}
            animate={{ scale: [1, 1.18, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
          />
          {/* Shield icon */}
          <motion.div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,rgba(34,211,238,0.15),rgba(139,92,246,0.1))',
              border: '1px solid rgba(34,211,238,0.25)' }}
            animate={inView ? { scale: [0.85, 1], opacity: [0, 1] } : {}}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <Lock style={{ width: 24, height: 24, color: '#22d3ee' }} />
          </motion.div>
        </div>

        {/* Security tags */}
        <div className="flex flex-wrap gap-1.5 justify-center">
          {SEC_TAGS.map((t, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.35 }}
              className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
              style={{ background: `${t.color}12`, border: `1px solid ${t.color}30`, color: t.color }}>
              {t.label}
            </motion.div>
          ))}
        </div>

        <div className="text-[10px] text-center" style={{ color: cv(400) }}>
          Zero-trust architecture
        </div>
      </div>
    </div>
  )
}

// ─── Card 4: Organization Management ─────────────────────────────────────────
const ORG_NODES = [
  { id: 'root', label: 'CertiByt', x: 120, y: 20,  r: 18, color: '#22d3ee' },
  { id: 'n1',   label: 'TechCorp', x: 40,  y: 90,  r: 13, color: '#3b82f6' },
  { id: 'n2',   label: 'UniLearn', x: 120, y: 90,  r: 13, color: '#8b5cf6' },
  { id: 'n3',   label: 'FinGroup', x: 200, y: 90,  r: 13, color: '#10b981' },
  { id: 'c1',   label: 'Dev',      x: 20,  y: 155, r: 9,  color: '#3b82f6' },
  { id: 'c2',   label: 'HR',       x: 60,  y: 155, r: 9,  color: '#3b82f6' },
  { id: 'c3',   label: 'Eng',      x: 100, y: 155, r: 9,  color: '#8b5cf6' },
  { id: 'c4',   label: 'Fin',      x: 140, y: 155, r: 9,  color: '#8b5cf6' },
  { id: 'c5',   label: 'Risk',     x: 180, y: 155, r: 9,  color: '#10b981' },
  { id: 'c6',   label: 'Ops',      x: 220, y: 155, r: 9,  color: '#10b981' },
]
const ORG_EDGES = [
  ['root','n1'], ['root','n2'], ['root','n3'],
  ['n1','c1'], ['n1','c2'],
  ['n2','c3'], ['n2','c4'],
  ['n3','c5'], ['n3','c6'],
]

function OrgTreeDemo({ isDark }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true })
  const nodeMap = Object.fromEntries(ORG_NODES.map(n => [n.id, n]))

  return (
    <div className="p-5 h-full flex flex-col gap-3" ref={ref}>
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.2)' }}>
          <Building2 style={{ width: 14, height: 14, color: '#22d3ee' }} />
        </div>
        <div>
          <div className="text-sm font-extrabold text-white">Organization Hub</div>
          <div className="text-[10px]" style={{ color: cv(400) }}>Unlimited tenant hierarchy</div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <svg viewBox="0 0 240 178" width="100%" height="100%" style={{ maxHeight: 160 }}>
          {/* Edges */}
          {ORG_EDGES.map(([aId, bId], i) => {
            const a = nodeMap[aId], b = nodeMap[bId]
            const pathLen = Math.hypot(b.x - a.x, b.y - a.y)
            return (
              <motion.line key={i}
                x1={a.x} y1={a.y + a.r} x2={b.x} y2={b.y - b.r}
                stroke={b.color} strokeWidth={1.2} strokeOpacity={0.45}
                strokeDasharray={pathLen} strokeDashoffset={pathLen}
                animate={inView ? { strokeDashoffset: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.07, ease: EASE }}
              />
            )
          })}

          {/* Nodes */}
          {ORG_NODES.map((n, i) => (
            <g key={n.id}>
              <motion.circle
                cx={n.x} cy={n.y} r={n.r}
                fill={`${n.color}18`} stroke={n.color} strokeWidth={1.5}
                initial={{ scale: 0, opacity: 0 }}
                animate={inView ? { scale: 1, opacity: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.06 }}
                style={{ transformOrigin: `${n.x}px ${n.y}px` }}
              />
              {i === 0 && (
                <motion.circle
                  cx={n.x} cy={n.y} r={n.r + 5}
                  fill="none" stroke={n.color} strokeWidth={1}
                  animate={{ r: [n.r + 4, n.r + 10], opacity: [0.5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </g>
          ))}
        </svg>
      </div>

      <div className="flex items-center gap-3 text-[10px]" style={{ color: cv(400) }}>
        <span><strong className="text-white">3</strong> orgs</span>
        <span><strong className="text-white">6</strong> depts</span>
        <span><strong className="text-white">1,916</strong> users</span>
      </div>
    </div>
  )
}

// ─── Card 5: Exam Builder ─────────────────────────────────────────────────────
const EXAM_QS = [
  { text: 'Which service provides EC2?',  opts: ['AWS', 'GCP', 'Azure', 'IBM'],  ans: 0 },
  { text: 'OSI Layer of TCP?',            opts: ['3', '4', '5', '6'],             ans: 1 },
]

function ExamBuilderDemo({ isDark }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true })
  const count  = useCounter(40, inView, false, 200)

  return (
    <div className="p-5 h-full flex flex-col gap-3" ref={ref}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
            <FileText style={{ width: 14, height: 14, color: '#3b82f6' }} />
          </div>
          <div>
            <div className="text-sm font-extrabold text-white">Exam Builder</div>
            <div className="text-[10px]" style={{ color: cv(400) }}>Drag-and-drop questions</div>
          </div>
        </div>
        <div className="text-center px-2.5 py-1 rounded-xl"
          style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
          <div className="text-lg font-black" style={{ color: '#3b82f6' }}>{count}</div>
          <div className="text-[8px]" style={{ color: cv(400) }}>Questions</div>
        </div>
      </div>

      <div className="flex flex-col gap-2 flex-1">
        {EXAM_QS.map((q, qi) => (
          <motion.div key={qi}
            initial={{ opacity: 0, x: -10 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 + qi * 0.15, duration: 0.4 }}
            className="rounded-xl p-2.5"
            style={{ background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
              border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.05)' }}>
            <div className="text-[10px] font-semibold text-white mb-1.5">{q.text}</div>
            <div className="grid grid-cols-2 gap-1">
              {q.opts.map((opt, oi) => (
                <div key={oi}
                  className="text-[9px] px-2 py-1 rounded-lg text-center"
                  style={{
                    background: oi === q.ans ? 'rgba(59,130,246,0.15)' : isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                    border: `1px solid ${oi === q.ans ? 'rgba(59,130,246,0.4)' : 'rgba(255,255,255,0.06)'}`,
                    color: oi === q.ans ? '#93c5fd' : cv(400),
                    fontWeight: oi === q.ans ? 600 : 400,
                  }}>
                  {opt}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Progress */}
      <div>
        <div className="flex justify-between text-[10px] mb-1" style={{ color: cv(400) }}>
          <span>Completion</span><span style={{ color: '#3b82f6' }}>82%</span>
        </div>
        <div className="h-1 rounded-full" style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
          <motion.div className="h-full rounded-full"
            style={{ background: 'linear-gradient(to right,#3b82f6,#8b5cf6)' }}
            initial={{ width: 0 }} animate={inView ? { width: '82%' } : {}}
            transition={{ duration: 1, delay: 0.6, ease: EASE }} />
        </div>
      </div>
    </div>
  )
}

// ─── Card 6: Voucher System ───────────────────────────────────────────────────
const VOUCHER_CODES = [
  { code: 'CERT-4X9K-7MQ2', status: 'success', color: '#22c55e' },
  { code: 'CERT-3BN7-LPR8', status: 'active',  color: '#22d3ee' },
  { code: 'CERT-9WQ1-4TK5', status: 'active',  color: '#22d3ee' },
  { code: 'CERT-2ZP6-8FH3', status: 'pending', color: '#f59e0b' },
]

function VoucherDemo({ isDark }) {
  const ref      = useRef(null)
  const inView   = useInView(ref, { once: true })
  const [copied, setCopied] = useState(null)
  const total    = useCounter(50, inView, false, 100)

  const handleCopy = (i) => {
    setCopied(i)
    setTimeout(() => setCopied(null), 1400)
  }

  return (
    <div className="p-5 h-full flex flex-col gap-3" ref={ref}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
            <Tag style={{ width: 14, height: 14, color: '#8b5cf6' }} />
          </div>
          <div>
            <div className="text-sm font-extrabold text-white">Voucher System</div>
            <div className="text-[10px]" style={{ color: cv(400) }}>Batch generate &amp; assign</div>
          </div>
        </div>
        <div className="text-lg font-black" style={{ color: '#8b5cf6' }}>{total}</div>
      </div>

      <div className="flex flex-col gap-1.5 flex-1">
        {VOUCHER_CODES.map((v, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, x: -8 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 + i * 0.08, duration: 0.35 }}
            className="flex items-center justify-between px-3 py-2 rounded-xl"
            style={{
              background: v.status === 'success'
                ? 'rgba(34,197,94,0.07)' : isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
              border: `1px solid ${v.status === 'success' ? 'rgba(34,197,94,0.2)' : isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)'}`,
            }}>
            <div className="flex items-center gap-2">
              {v.status === 'success'
                ? <CheckCircle className="w-3 h-3" style={{ color: '#22c55e', flexShrink: 0 }} />
                : <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: v.color }} />
              }
              <span className="text-[10px] font-mono font-semibold text-white">{v.code}</span>
            </div>
            <button
              onClick={() => handleCopy(i)}
              className="flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-lg cursor-pointer transition-colors"
              style={{
                background: copied === i ? 'rgba(34,197,94,0.12)' : isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                color: copied === i ? '#22c55e' : cv(400),
                border: 'none',
              }}>
              <AnimatePresence mode="wait">
                {copied === i
                  ? <motion.span key="ok" initial={{ scale: 0.7 }} animate={{ scale: 1 }}
                      exit={{ scale: 0.7 }} className="flex items-center gap-1">
                      <CheckCircle className="w-2.5 h-2.5" /> Copied
                    </motion.span>
                  : <motion.span key="copy" initial={{ scale: 0.7 }} animate={{ scale: 1 }}
                      exit={{ scale: 0.7 }} className="flex items-center gap-1">
                      <Copy className="w-2.5 h-2.5" /> Copy
                    </motion.span>
                }
              </AnimatePresence>
            </button>
          </motion.div>
        ))}
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-[10px]" style={{ color: cv(400) }}>
        <span><strong style={{ color: '#22c55e' }}>47</strong> Active</span>
        <span><strong style={{ color: '#94a3b8' }}>2</strong> Used</span>
        <span><strong style={{ color: '#f59e0b' }}>1</strong> Pending</span>
      </div>
    </div>
  )
}

// ─── Card 7: AI Proctoring ────────────────────────────────────────────────────
const PROC_CANDS = [
  { name: 'Sara M.',  warn: false, prog: 78 },
  { name: 'James R.', warn: true,  prog: 45 },
  { name: 'Priya K.', warn: false, prog: 92 },
]

function AIProctoringDemo({ isDark }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <div className="p-6 h-full flex flex-col gap-5" ref={ref}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)' }}>
              <Eye style={{ width: 16, height: 16, color: '#f43f5e' }} />
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-widest"
              style={{ color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)' }}>AI Proctoring</span>
          </div>
          <h3 className="text-xl font-extrabold text-white">Live Session Monitor</h3>
          <p className="text-[12px] mt-0.5" style={{ color: cv(400) }}>Eye tracking · Tab detection · Session lock</p>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full"
          style={{ background: 'rgba(244,63,94,0.1)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.2)' }}>
          <motion.div className="w-1.5 h-1.5 rounded-full bg-red-400"
            animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }} />
          Recording
        </div>
      </div>

      {/* Webcam view with eye-tracking rings */}
      <div className="relative rounded-2xl overflow-hidden flex-shrink-0"
        style={{ height: 160, background: 'rgba(2,6,23,0.95)', border: '1px solid rgba(244,63,94,0.2)' }}>
        {/* Face silhouette */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width="80" height="90" viewBox="0 0 80 90">
            <ellipse cx="40" cy="35" rx="22" ry="26" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            <rect x="25" y="60" width="30" height="22" rx="4" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          </svg>
        </div>

        {/* Eye tracking rings */}
        {[36, 52, 68].map((r, i) => (
          <motion.div key={i}
            className="absolute rounded-full border"
            style={{
              width: r, height: r,
              top: '50%', left: '50%',
              marginLeft: -r/2, marginTop: -r/2 - 12,
              borderColor: `rgba(34,211,238,${0.35 - i * 0.1})`,
            }}
            animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0.9, 0.6] }}
            transition={{ duration: 1.8 + i * 0.3, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}

        {/* Scan line */}
        <motion.div className="absolute left-0 right-0 h-[1px] pointer-events-none"
          style={{ background: 'linear-gradient(to right,transparent,rgba(34,211,238,0.6),transparent)' }}
          animate={{ y: [0, 160, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} />

        {/* Corner brackets */}
        {[
          { top: 8,  left: 8,  bdr: '2px 0 0 0', bdl: '2px', bdt: '2px', bdb: '0' },
          { top: 8,  right: 8, bdr: '0', bdl: '0 2px 0 0', bdt: '2px', bdb: '0' },
          { bottom: 8, left: 8,  bdr: '0', bdl: '2px 0 0 0', bdt: '0', bdb: '2px' },
          { bottom: 8, right: 8, bdr: '0 2px 0 0', bdl: '0', bdt: '0', bdb: '2px' },
        ].map((c, i) => (
          <div key={i} className="absolute w-5 h-5" style={{
            ...c,
            borderTop:    `${c.bdt} solid rgba(34,211,238,0.6)`,
            borderLeft:   i === 0 || i === 2 ? '2px solid rgba(34,211,238,0.6)' : 'none',
            borderRight:  i === 1 || i === 3 ? '2px solid rgba(34,211,238,0.6)' : 'none',
            borderBottom: `${c.bdb} solid rgba(34,211,238,0.6)`,
          }} />
        ))}

        {/* Warning badge */}
        <motion.div
          className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-semibold"
          style={{ background: 'rgba(244,63,94,0.15)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.3)' }}
          animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1.2, repeat: Infinity }}>
          <AlertTriangle className="w-2.5 h-2.5" /> Tab switch
        </motion.div>

        {/* Status */}
        <div className="absolute bottom-2.5 left-3 text-[9px] font-mono" style={{ color: 'rgba(34,211,238,0.7)' }}>
          TRACKING ACTIVE
        </div>
      </div>

      {/* Candidate grid */}
      <div className="grid grid-cols-3 gap-3">
        {PROC_CANDS.map((c, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 8 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
            className="rounded-xl p-2.5"
            style={{
              background: c.warn ? 'rgba(244,63,94,0.07)' : isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
              border: `1px solid ${c.warn ? 'rgba(244,63,94,0.25)' : isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)'}`,
            }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold text-white">{c.name}</span>
              {c.warn
                ? <AlertTriangle className="w-3 h-3" style={{ color: '#f43f5e' }} />
                : <motion.div className="w-1.5 h-1.5 rounded-full"
                    style={{ background: '#22c55e' }}
                    animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />
              }
            </div>
            <div className="h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <motion.div className="h-full rounded-full"
                style={{ background: c.warn ? '#f43f5e' : '#22c55e' }}
                initial={{ width: 0 }} animate={inView ? { width: `${c.prog}%` } : {}}
                transition={{ duration: 0.7, delay: 0.5 + i * 0.1 }} />
            </div>
            <div className="text-[9px] mt-0.5 text-right" style={{ color: cv(400) }}>{c.prog}%</div>
          </motion.div>
        ))}
      </div>

      {/* Footer stats */}
      <div className="flex items-center gap-4 text-[11px] pt-1 border-t" style={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
        <div className="flex items-center gap-1.5">
          <motion.div className="w-1.5 h-1.5 rounded-full" style={{ background: '#22c55e' }}
            animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
          <span style={{ color: cv(300) }}>3 Active sessions</span>
        </div>
        <div className="flex items-center gap-1" style={{ color: '#f43f5e' }}>
          <AlertTriangle className="w-3 h-3" />
          <span>1 Warning</span>
        </div>
      </div>
    </div>
  )
}

// ─── Card 8: Live Activity ────────────────────────────────────────────────────
const BASE_FEED = [
  { type: 'exam',   text: 'Priya K. passed AWS CPP',         time: '2s ago',  color: '#10b981', Icon: CheckCircle },
  { type: 'cert',   text: 'Certificate issued — Ahmed A.',    time: '18s ago', color: '#f59e0b', Icon: Award       },
  { type: 'join',   text: 'James R. joined ISO 27001',        time: '41s ago', color: '#3b82f6', Icon: Users       },
  { type: 'voucher',text: 'Voucher batch generated (50)',      time: '1m ago',  color: '#8b5cf6', Icon: Tag         },
  { type: 'cert',   text: 'Certificate issued — Sara M.',     time: '2m ago',  color: '#f59e0b', Icon: Award       },
  { type: 'exam',   text: 'Chen W. passed React Dev',         time: '3m ago',  color: '#10b981', Icon: CheckCircle },
  { type: 'org',    text: 'New organization: TechStart Ltd',  time: '5m ago',  color: '#22d3ee', Icon: Building2   },
]

const NEW_ITEMS = [
  { type: 'exam', text: 'Maria L. passed ISO 27001', time: 'just now', color: '#10b981', Icon: CheckCircle },
  { type: 'join', text: 'Ali H. joined AWS CPP',     time: 'just now', color: '#3b82f6', Icon: Users       },
]

function LiveActivityDemo({ isDark }) {
  const ref      = useRef(null)
  const inView   = useInView(ref, { once: true })
  const [feed,   setFeed]   = useState(BASE_FEED.slice(0, 5))
  const [newIdx, setNewIdx] = useState(0)

  useEffect(() => {
    if (!inView) return
    const t = setInterval(() => {
      const item = NEW_ITEMS[newIdx % NEW_ITEMS.length]
      setFeed(prev => [{ ...item, time: 'just now' }, ...prev.slice(0, 4)])
      setNewIdx(i => i + 1)
    }, 2800)
    return () => clearInterval(t)
  }, [inView, newIdx])

  return (
    <div className="p-5 h-full flex flex-col gap-3" ref={ref}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.2)' }}>
            <Activity style={{ width: 14, height: 14, color: '#22d3ee' }} />
          </div>
          <div>
            <div className="text-sm font-extrabold text-white">Live Activity</div>
            <div className="text-[10px]" style={{ color: cv(400) }}>Platform-wide events</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-semibold"
          style={{ color: '#22c55e' }}>
          <motion.div className="w-1.5 h-1.5 rounded-full bg-green-400"
            animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
          Live
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-1.5 overflow-hidden">
        <AnimatePresence>
          {feed.map((item, i) => (
            <motion.div key={item.text + item.time}
              layout
              initial={{ opacity: 0, y: -20, scale: 0.96 }}
              animate={{ opacity: 1,  y: 0,   scale: 1    }}
              exit={{    opacity: 0,  y: 20,   scale: 0.95 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl"
              style={{
                background: i === 0 && item.time === 'just now'
                  ? `${item.color}0a` : isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.025)',
                border: `1px solid ${i === 0 && item.time === 'just now' ? `${item.color}20` : 'transparent'}`,
              }}>
              <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${item.color}15` }}>
                <item.Icon style={{ width: 11, height: 11, color: item.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-medium text-white truncate">{item.text}</div>
              </div>
              <div className="text-[9px] flex-shrink-0" style={{ color: cv(500) }}>{item.time}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ─── Animated background ──────────────────────────────────────────────────────
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  x:    (i * 73 + 17) % 100,
  y:    (i * 47 + 33) % 100,
  size: ((i * 31) % 3) + 2,
  dur:  8 + ((i * 19) % 12),
  dy:   -12 - ((i * 7) % 16),
  dx:   (((i * 13) % 20) - 10),
  color: ['#22d3ee', '#8b5cf6', '#3b82f6'][i % 3],
}))

function AnimBackground({ isDark }) {
  const gc = isDark ? 'rgba(34,211,238,0.015)' : 'rgba(34,211,238,0.025)'
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Grid */}
      <div className="absolute inset-0" style={{
        backgroundImage: `linear-gradient(${gc} 1px,transparent 1px),linear-gradient(90deg,${gc} 1px,transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />
      {/* Orbs */}
      <motion.div className="absolute rounded-full blur-3xl"
        animate={{ x: [0, 40, -20, 0], y: [0, -30, 15, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
        style={{ width: 600, height: 600, top: '-5%', left: '-5%',
          background: isDark ? 'rgba(34,211,238,0.04)' : 'rgba(34,211,238,0.025)' }} />
      <motion.div className="absolute rounded-full blur-3xl"
        animate={{ x: [0, -35, 18, 0], y: [0, 25, -12, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
        style={{ width: 500, height: 500, bottom: '-5%', right: '-5%',
          background: isDark ? 'rgba(139,92,246,0.04)' : 'rgba(139,92,246,0.025)' }} />
      {/* Particles */}
      {PARTICLES.map((p, i) => (
        <motion.div key={i}
          className="absolute rounded-full"
          style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%`,
            background: p.color, opacity: 0 }}
          animate={{ x: [0, p.dx, 0], y: [0, p.dy, 0], opacity: [0, 0.4, 0] }}
          transition={{ duration: p.dur, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

// ─── Section header ───────────────────────────────────────────────────────────
const HEADING_WORD = 'Everything'

function SectionHeader({ isDark }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <div ref={ref} className="text-center mb-16 px-4">
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: -14, filter: 'blur(8px)' }}
        animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
        transition={{ duration: 0.5, ease: EASE }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
        style={{
          background:     isDark ? 'rgba(34,211,238,0.08)' : 'rgba(34,211,238,0.07)',
          border:         '1px solid rgba(34,211,238,0.22)',
          color:          isDark ? '#67e8f9' : '#0891b2',
          backdropFilter: 'blur(14px)',
        }}
      >
        <Database className="w-3.5 h-3.5" aria-hidden />
        Enterprise Capabilities
      </motion.div>

      {/* Heading */}
      <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.06] tracking-tight text-white mb-6">
        {/* Character reveal on "Everything" */}
        <span aria-hidden className="inline-block mr-3">
          {HEADING_WORD.split('').map((ch, i) => (
            <motion.span key={i}
              style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg,#22d3ee 0%,#a78bfa 50%,#38bdf8 100%)',
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
              initial={{ opacity: 0, y: 22, filter: 'blur(6px)' }}
              animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
              transition={{ duration: 0.45, delay: 0.15 + i * 0.04, ease: EASE }}
            >
              {ch}
            </motion.span>
          ))}
        </span>
        <span className="sr-only">Everything </span>
        <motion.span
          initial={{ opacity: 0, y: 22, filter: 'blur(6px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.5, delay: 0.65, ease: EASE }}
          className="block sm:inline"
          style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}
        >
          You Need.
        </motion.span>
        <motion.span
          initial={{ opacity: 0, y: 22, filter: 'blur(6px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.5, delay: 0.75, ease: EASE }}
          className="block"
          style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)' }}
        >
          Nothing You Don't.
        </motion.span>
      </h2>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
        animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
        transition={{ duration: 0.5, delay: 0.9, ease: EASE }}
        className="text-lg max-w-2xl mx-auto"
        style={{ color: cv(400) }}
      >
        Instead of using dozens of disconnected tools, CertiByt brings every stage of enterprise examinations into one unified platform.
      </motion.p>
    </div>
  )
}

// ─── Responsive grid hook ─────────────────────────────────────────────────────
function useIsLg() {
  const [lg, setLg] = useState(false)
  useEffect(() => {
    const check = () => setLg(window.innerWidth >= 1024)
    check()
    const mq = window.matchMedia('(min-width: 1024px)')
    mq.addEventListener('change', check)
    return () => mq.removeEventListener('change', check)
  }, [])
  return lg
}

// ─── Bento grid ───────────────────────────────────────────────────────────────
/*
  12-column layout:
  Row 1-2: Analytics (col 1-7, rowspan 2)  | Certificate (col 7-10) | Security (col 10-13)
  Row 2:   Analytics cont.                  | OrgMgmt (col 7-10)     | ExamBuilder (col 10-13)
  Row 3:   Voucher (col 1-5)               | AI Proctoring (col 5-13, rowspan 2)
  Row 4:   LiveActivity (col 1-5)          | AI cont.
*/
const GRID_PLACEMENTS = [
  { column: '1 / 7',  row: '1 / 3' }, // Analytics
  { column: '7 / 10', row: '1'     }, // Certificate
  { column: '10 / 13',row: '1'     }, // Security
  { column: '7 / 10', row: '2'     }, // OrgMgmt
  { column: '10 / 13',row: '2'     }, // ExamBuilder
  { column: '1 / 5',  row: '3'     }, // Voucher
  { column: '5 / 13', row: '3 / 5' }, // AI Proctoring
  { column: '1 / 5',  row: '4'     }, // LiveActivity
]

const ACCENTS = ['#22d3ee','#f59e0b','#22d3ee','#22d3ee','#3b82f6','#8b5cf6','#f43f5e','#22d3ee']
const LABELS  = ['Analytics dashboard','Digital Certificates','Enterprise Security','Organization Management',
                 'Exam Builder','Voucher System','AI Proctoring','Live Activity Feed']

function BentoGrid({ isDark }) {
  const isLg = useIsLg()

  const CARDS = [
    (gs) => (
      <FeatureCard key={0} accent={ACCENTS[0]} gridStyle={gs} delay={0}    isDark={isDark} label={LABELS[0]}>
        <AnalyticsDemo isDark={isDark} />
      </FeatureCard>
    ),
    (gs) => (
      <FeatureCard key={1} accent={ACCENTS[1]} gridStyle={gs} delay={0.08} isDark={isDark} label={LABELS[1]}>
        <CertificateDemo isDark={isDark} />
      </FeatureCard>
    ),
    (gs) => (
      <FeatureCard key={2} accent={ACCENTS[2]} gridStyle={gs} delay={0.16} isDark={isDark} label={LABELS[2]}>
        <SecurityDemo isDark={isDark} />
      </FeatureCard>
    ),
    (gs) => (
      <FeatureCard key={3} accent={ACCENTS[3]} gridStyle={gs} delay={0.24} isDark={isDark} label={LABELS[3]}>
        <OrgTreeDemo isDark={isDark} />
      </FeatureCard>
    ),
    (gs) => (
      <FeatureCard key={4} accent={ACCENTS[4]} gridStyle={gs} delay={0.32} isDark={isDark} label={LABELS[4]}>
        <ExamBuilderDemo isDark={isDark} />
      </FeatureCard>
    ),
    (gs) => (
      <FeatureCard key={5} accent={ACCENTS[5]} gridStyle={gs} delay={0.40} isDark={isDark} label={LABELS[5]}>
        <VoucherDemo isDark={isDark} />
      </FeatureCard>
    ),
    (gs) => (
      <FeatureCard key={6} accent={ACCENTS[6]} gridStyle={gs} delay={0.48} isDark={isDark} label={LABELS[6]}>
        <AIProctoringDemo isDark={isDark} />
      </FeatureCard>
    ),
    (gs) => (
      <FeatureCard key={7} accent={ACCENTS[7]} gridStyle={gs} delay={0.56} isDark={isDark} label={LABELS[7]}>
        <LiveActivityDemo isDark={isDark} />
      </FeatureCard>
    ),
  ]

  if (isLg) {
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12,1fr)',
        gridAutoRows: 'minmax(215px,auto)',
        gap: 16,
      }}>
        {CARDS.map((render, i) =>
          render({ gridColumn: GRID_PLACEMENTS[i].column, gridRow: GRID_PLACEMENTS[i].row })
        )}
      </div>
    )
  }

  // Tablet / mobile — auto flow
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {CARDS.map((render) => render({ minHeight: 260 }))}
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function EnterpriseBentoSection() {
  const { theme } = useTheme()
  const isDark    = theme === 'dark'

  return (
    <section
      aria-labelledby="bento-heading"
      className="relative overflow-hidden"
      style={{ background: isDark ? cv(950) : 'rgb(248,250,252)', paddingTop: 140, paddingBottom: 140 }}
    >
      <AnimBackground isDark={isDark} />

      {/* Top divider */}
      <div aria-hidden className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px"
        style={{ background: `linear-gradient(to right,transparent,${isDark ? 'rgba(34,211,238,0.2)' : 'rgba(34,211,238,0.14)'},transparent)` }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ zIndex: 1 }}>
        <SectionHeader isDark={isDark} />
        <BentoGrid isDark={isDark} />
      </div>

      {/* Bottom divider */}
      <div aria-hidden className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-px"
        style={{ background: `light-dark(rgba(34,211,238,0.1),rgba(34,211,238,0.18))`,
          background: `linear-gradient(to right,transparent,${isDark ? 'rgba(34,211,238,0.18)' : 'rgba(34,211,238,0.1)'},transparent)` }} />
    </section>
  )
}
