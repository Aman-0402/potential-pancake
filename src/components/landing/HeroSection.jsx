import { useCallback, useEffect, useState } from 'react'
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  useReducedMotion,
} from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'
import {
  Award, BarChart2, Zap, ArrowRight, FileCheck2,
  Shield, Building2, GraduationCap, Users,
  CheckCircle2, Activity, Lock, Globe,
} from 'lucide-react'

// ─── Constants ────────────────────────────────────────────────────────────────

const EASE = [0.25, 0.4, 0.25, 1]

// CSS-variable helper — dark-* vars are space-separated RGB triplets
// rgb(var(--c-dark-NNN) / opacity) auto-adapts: near-black dark / near-white light
const cv = (n, op = 1) =>
  op < 1 ? `rgb(var(--c-dark-${n}) / ${op})` : `rgb(var(--c-dark-${n}))`

const SIDEBAR_NAV = [
  { icon: Activity,   label: 'Dashboard',     active: true  },
  { icon: FileCheck2, label: 'Exams'                        },
  { icon: Users,      label: 'Candidates'                   },
  { icon: Award,      label: 'Certificates'                 },
  { icon: BarChart2,  label: 'Analytics'                    },
  { icon: Building2,  label: 'Organizations'                },
]

const STAT_CARDS = [
  { label: 'Candidates',   to: 1247, cls: 'text-cyan-500',    suffix: ''  },
  { label: 'Active Exams', to: 23,   cls: 'text-violet-500',  suffix: ''  },
  { label: 'Certs Issued', to: 3891, cls: 'text-emerald-500', suffix: ''  },
  { label: 'Pass Rate',    to: 78,   cls: 'text-amber-500',   suffix: '%' },
]

const BAR_HEIGHTS = [42, 68, 54, 82, 74, 90, 78]
const BAR_DAYS    = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

const CANDIDATES = [
  { name: 'Priya M.',   exam: 'AWS Practitioner', score: 84, pass: true  },
  { name: 'Aditya R.',  exam: 'React Advanced',   score: 92, pass: true  },
  { name: 'Sneha K.',   exam: 'Python Data Sci',  score: 61, pass: false },
  { name: 'Rahul S.',   exam: 'DevOps Essentials',score: 78, pass: true  },
]

const ACTIVITIES = [
  { dot: 'bg-emerald-400', text: 'Priya M. earned AWS cert',    time: '2m ago'  },
  { dot: 'bg-cyan-400',    text: 'New org: TechLab India',      time: '8m ago'  },
  { dot: 'bg-violet-400',  text: 'Exam "DevOps Pro" gone live', time: '15m ago' },
  { dot: 'bg-amber-400',   text: '127 vouchers distributed',    time: '1h ago'  },
]

const TRUST_ITEMS = [
  'Multi-Tenant',
  'Secure Exams',
  'AI Proctoring',
  'Cert Verification',
]

const FLOAT_CARDS = [
  { icon: Lock,          label: 'Bank-Grade Security', cls: '-top-5 right-6',       delay: 1.2, fy: [-5, 5, -5]  },
  { icon: Award,         label: 'Verified Certs',      cls: '-bottom-5 left-6',     delay: 1.4, fy: [5, -5, 5]   },
  { icon: GraduationCap, label: 'AI Proctoring',       cls: 'top-1/3 -right-28',    delay: 1.6, fy: [-4, 4, -4]  },
  { icon: Globe,         label: 'Multi-Tenant Orgs',   cls: 'bottom-1/3 -right-28', delay: 1.8, fy: [4, -4, 4]   },
]

const GRADIENT_WORDS = new Set(['Secure', 'Verified', 'Enterprise'])

const HEADING_LINES = [
  ['Conduct', ' ', 'Secure', ' ', 'Online', ' ', 'Exams'],
  ['Generate', ' ', 'Verified', ' ', 'Certificates'],
  ['at', ' ', 'Enterprise', ' ', 'Scale'],
]

// ─── Motion Variants ──────────────────────────────────────────────────────────

const charVar = {
  hidden:  { opacity: 0, y: 20, filter: 'blur(4px)' },
  visible: { opacity: 1, y: 0,  filter: 'blur(0px)',
    transition: { duration: 0.35, ease: EASE } },
}

const headingVar = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.022, delayChildren: 0.3 } },
}

const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 28, filter: 'blur(8px)' },
  animate:    { opacity: 1, y: 0,  filter: 'blur(0px)' },
  transition: { duration: 0.65, delay, ease: EASE },
})

const trustStagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 1.55 } },
}

const trustItemVar = {
  hidden:  { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
}

// ─── Animated Counter ─────────────────────────────────────────────────────────

function AnimatedCounter({ to, suffix = '', duration = 2000 }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let start = null
    let raf
    const step = (ts) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * to))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [to, duration])
  return <>{val.toLocaleString()}{suffix}</>
}

// ─── SVG Circle Progress ──────────────────────────────────────────────────────

function CircleProgress({ value, size = 28, strokeWidth = 2.5, color, delay = 1.5 }) {
  const r    = (size - strokeWidth) / 2
  const circ = 2 * Math.PI * r
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none"
        strokeWidth={strokeWidth} stroke={cv(700, 0.2)} />
      <motion.circle
        cx={size/2} cy={size/2} r={r}
        fill="none" strokeWidth={strokeWidth} stroke={color}
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - (value / 100) * circ }}
        transition={{ delay, duration: 1.2, ease: 'easeOut' }}
      />
    </svg>
  )
}

// ─── Background: Grid ─────────────────────────────────────────────────────────

function AnimatedGrid({ isDark }) {
  const c = isDark ? 'rgba(34,211,238,0.04)' : 'rgba(14,165,233,0.06)'
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `linear-gradient(${c} 1px,transparent 1px),linear-gradient(90deg,${c} 1px,transparent 1px)`,
        backgroundSize: '60px 60px',
      }}
    />
  )
}

// ─── Background: Orbs ────────────────────────────────────────────────────────

function GlowOrbs({ isDark, reduced }) {
  const op = isDark ? [0.13, 0.10, 0.08] : [0.06, 0.04, 0.03]
  const orbs = [
    { w:700, h:700, top:'-15%', left:'-10%',   color:`rgba(6,182,212,${op[0]})`,   x:[0,60,0],  y:[0,30,0],  dur:20, delay:0 },
    { w:600, h:600, top:'10%',  right:'-10%',   color:`rgba(139,92,246,${op[1]})`, x:[0,-40,0], y:[0,50,0],  dur:25, delay:4 },
    { w:450, h:450, bottom:'-10%', left:'25%',  color:`rgba(59,130,246,${op[2]})`, x:[0,30,0],  y:[0,-40,0], dur:18, delay:8 },
  ]
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
      {orbs.map((o, i) => (
        <motion.div key={i} className="absolute rounded-full"
          style={{
            width:o.w, height:o.h,
            top:o.top, left:o.left, right:o.right, bottom:o.bottom,
            background:`radial-gradient(circle,${o.color} 0%,transparent 70%)`,
          }}
          animate={reduced ? {} : { x:o.x, y:o.y }}
          transition={{ duration:o.dur, repeat:Infinity, ease:'easeInOut', delay:o.delay }}
        />
      ))}
    </div>
  )
}

// ─── Background: Particles ────────────────────────────────────────────────────

function Particles({ reduced }) {
  if (reduced) return null
  const pts = Array.from({ length: 22 }, (_, i) => ({
    id: i, x:`${(i*17+11)%97}%`, y:`${(i*13+7)%93}%`,
    size: 1+(i%3), dur: 8+(i%7)*2, delay:(i%5)*1.2, op:0.1+(i%4)*0.07,
  }))
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
      {pts.map(p => (
        <motion.div key={p.id}
          className="absolute rounded-full bg-cyan-400"
          style={{ width:p.size, height:p.size, left:p.x, top:p.y, opacity:p.op }}
          animate={{ y:[-12,12,-12], x:[-6,6,-6], opacity:[p.op,p.op*0.2,p.op] }}
          transition={{ duration:p.dur, repeat:Infinity, ease:'easeInOut', delay:p.delay }}
        />
      ))}
    </div>
  )
}

// ─── Badge ────────────────────────────────────────────────────────────────────

function HeroBadge({ isDark }) {
  const s = isDark
    ? { background:'rgba(34,211,238,0.07)', border:'1px solid rgba(34,211,238,0.22)', color:'#67e8f9' }
    : { background:'rgba(14,165,233,0.07)', border:'1px solid rgba(14,165,233,0.22)', color:'#0369a1' }
  return (
    <motion.div
      initial={{ opacity:0, y:-14, filter:'blur(6px)' }}
      animate={{ opacity:1, y:0,   filter:'blur(0px)' }}
      transition={{ duration:0.55, ease:EASE }}
      className="mb-5"
    >
      <div
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium"
        style={{ backdropFilter:'blur(12px)', ...s }}
      >
        <Zap className="w-3.5 h-3.5" />
        <span>Enterprise Exam &amp; Certification Platform</span>
        <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      </div>
    </motion.div>
  )
}

// ─── Animated Heading ─────────────────────────────────────────────────────────

// Gradient applied to a plain span so background-clip: text works correctly.
// The outer motion.span handles entry via stagger variants; inner <span> holds the gradient visual.
const gradInnerStyle = {
  background:'linear-gradient(135deg,#22d3ee 0%,#a78bfa 50%,#38bdf8 100%)',
  backgroundSize:'250% 100%',
  WebkitBackgroundClip:'text',
  WebkitTextFillColor:'transparent',
  backgroundClip:'text',
}

function AnimatedHeading() {
  return (
    <motion.h1
      variants={headingVar}
      initial="hidden"
      animate="visible"
      className="text-4xl sm:text-5xl lg:text-[50px] font-extrabold leading-[1.1] tracking-tight mb-4 text-white"
    >
      {HEADING_LINES.map((words, li) => (
        <span key={li} className="block">
          {words.map((word, wi) => {
            // Static space — animated inline-block spaces collapse to zero width
            if (word === ' ')
              return <span key={wi} className="inline-block" style={{ width:'0.28em' }} aria-hidden="true" />

            if (GRADIENT_WORDS.has(word)) {
              // Outer motion.span participates in stagger; inner span owns the gradient
              return (
                <motion.span key={wi} variants={charVar} style={{ display:'inline-block' }}>
                  <motion.span
                    style={gradInnerStyle}
                    animate={{ backgroundPosition:['0% 50%','100% 50%','0% 50%'] }}
                    transition={{ duration:5, repeat:Infinity, ease:'linear', delay:li*0.6 }}
                  >
                    {word}
                  </motion.span>
                </motion.span>
              )
            }

            return (
              <span key={wi} className="inline-block">
                {word.split('').map((ch, ci) => (
                  <motion.span key={ci} variants={charVar} style={{ display:'inline-block' }}>{ch}</motion.span>
                ))}
              </span>
            )
          })}
        </span>
      ))}
    </motion.h1>
  )
}

// ─── Description ─────────────────────────────────────────────────────────────

function HeroDescription() {
  return (
    <motion.p {...fadeUp(1.1)} className="text-base text-dark-400 leading-relaxed mb-5 max-w-lg">
      Create secure online examinations, manage organizations, distribute
      vouchers, monitor candidates in real time, and issue tamper-proof
      certificates — all from one enterprise platform.
    </motion.p>
  )
}

// ─── CTA Buttons ─────────────────────────────────────────────────────────────

function CTAButtons({ isDark }) {
  const navigate = useNavigate()
  const secStyle = isDark
    ? { background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.12)' }
    : { background:'rgba(0,0,0,0.04)',       border:'1px solid rgba(0,0,0,0.10)'       }

  return (
    <motion.div {...fadeUp(1.3)} className="flex flex-col sm:flex-row gap-3 mb-6">
      <motion.button
        whileHover={{ y:-2, scale:1.02 }} whileTap={{ scale:0.97 }}
        onClick={() => navigate('/register')}
        aria-label="Start free trial"
        className="group flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold text-white"
        style={{
          background:'linear-gradient(135deg,#0891b2 0%,#6d28d9 100%)',
          boxShadow: isDark
            ? '0 0 28px rgba(6,182,212,0.28),0 4px 20px rgba(0,0,0,0.45)'
            : '0 0 20px rgba(6,182,212,0.16),0 4px 14px rgba(0,0,0,0.15)',
        }}
      >
        Start Free
        <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
      </motion.button>

      <motion.button
        whileHover={{ y:-2 }} whileTap={{ scale:0.97 }}
        onClick={() => navigate('/contact')}
        aria-label="Book a product demo"
        className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold text-dark-300 hover:text-dark-100 transition-colors"
        style={{ backdropFilter:'blur(12px)', ...secStyle }}
      >
        Book Demo
      </motion.button>
    </motion.div>
  )
}

// ─── Trust Indicators ────────────────────────────────────────────────────────

function TrustIndicators() {
  return (
    <motion.div variants={trustStagger} initial="hidden" animate="visible"
      className="flex flex-wrap gap-x-6 gap-y-2">
      {TRUST_ITEMS.map(label => (
        <motion.div key={label} variants={trustItemVar}
          className="flex items-center gap-1.5 text-xs text-dark-500">
          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
          <span>{label}</span>
        </motion.div>
      ))}
    </motion.div>
  )
}

// ─── Dashboard Mockup ─────────────────────────────────────────────────────────

function DashboardMockup({ isDark, reduced, px, py }) {
  const frameStyle  = {
    background:     cv(900, 0.88),
    border:         `1px solid ${cv(700, 0.18)}`,
    boxShadow:      isDark
      ? '0 48px 120px rgba(0,0,0,0.65),0 0 0 1px rgba(255,255,255,0.05),inset 0 1px 0 rgba(255,255,255,0.07)'
      : '0 24px 80px rgba(0,0,0,0.10),0 0 0 1px rgba(0,0,0,0.05)',
    backdropFilter: 'blur(20px)',
  }
  const chromeStyle = { borderBottom:`1px solid ${cv(700,0.12)}`, background:cv(950,0.6) }
  const sidebarStyle= { borderRight:`1px solid ${cv(700,0.1)}`,   background:cv(950,0.4) }
  const cardStyle   = { background:cv(700,0.08), border:`1px solid ${cv(700,0.1)}` }
  const urlBarStyle = { background:cv(700,0.1),  border:`1px solid ${cv(700,0.1)}` }

  return (
    <motion.div style={{ x:px, y:py }}
      initial={{ opacity:0, scale:0.88, filter:'blur(20px)' }}
      animate={{ opacity:1, scale:1,    filter:'blur(0px)'  }}
      transition={{ duration:1.05, delay:0.6, ease:EASE }}>

      <motion.div
        animate={reduced ? {} : { y:[0,-12,0] }}
        transition={{ duration:5, repeat:Infinity, ease:'easeInOut' }}>

        <div className="rounded-[28px] overflow-hidden w-full max-w-[540px]" style={frameStyle}>

          {/* Browser chrome */}
          <div className="flex items-center gap-2 px-4 py-3" style={chromeStyle}>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
            </div>
            <div className="flex-1 mx-3 px-3 py-1 rounded-md text-[10px] text-dark-500 text-center"
              style={urlBarStyle}>
              app.certibyt.io/dashboard
            </div>
            <div className="flex gap-1">
              <div className="w-3.5 h-3.5 rounded-sm" style={{ background:cv(700,0.15) }} />
              <div className="w-3.5 h-3.5 rounded-sm" style={{ background:cv(700,0.15) }} />
            </div>
          </div>

          {/* Body */}
          <div className="flex" style={{ height:310 }}>

            {/* Sidebar */}
            <div className="flex flex-col py-3 px-2 gap-0.5 shrink-0"
              style={{ width:104, ...sidebarStyle }}>
              <div className="px-2 py-2 mb-2">
                <span className="text-[11px] font-bold tracking-tight">
                  <span className="text-cyan-500">Certi</span>
                  <span className="text-dark-400">Byt</span>
                </span>
              </div>
              {SIDEBAR_NAV.map(({ icon:Icon, label, active }) => (
                <div key={label}
                  className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg ${
                    active ? 'bg-cyan-500/10 text-cyan-500' : 'text-dark-600'
                  }`}>
                  <Icon className="w-3 h-3 shrink-0" />
                  <span className="text-[9px] font-medium">{label}</span>
                </div>
              ))}
              <div className="mt-auto px-2 py-2 flex flex-col gap-1.5">
                <p className="text-[8px] text-dark-600 mb-0.5">Progress</p>
                {[
                  { val:72, color:'#22d3ee', label:'72%', sub:'Exams done',  cls:'text-cyan-500',   delay:2.0 },
                  { val:89, color:'#a78bfa', label:'89%', sub:'Certs valid', cls:'text-violet-500', delay:2.2 },
                ].map(p => (
                  <div key={p.sub} className="flex items-center gap-1.5">
                    <CircleProgress value={p.val} color={p.color} delay={p.delay} />
                    <div>
                      <p className={`text-[9px] font-semibold ${p.cls}`}>{p.label}</p>
                      <p className="text-[7px] text-dark-600">{p.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Main */}
            <div className="flex-1 overflow-hidden p-3 flex flex-col gap-2">

              {/* Stats */}
              <div className="grid grid-cols-4 gap-1.5 shrink-0">
                {STAT_CARDS.map((s, i) => (
                  <motion.div key={s.label}
                    initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                    transition={{ delay:1.0+i*0.07, duration:0.4, ease:EASE }}
                    className="rounded-lg p-2" style={cardStyle}>
                    <p className={`text-[11px] font-bold ${s.cls}`}>
                      <AnimatedCounter to={s.to} suffix={s.suffix} />
                    </p>
                    <p className="text-[7.5px] text-dark-600 mt-0.5">{s.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Chart + Activity */}
              <div className="flex gap-2 flex-1 min-h-0">

                {/* Bar chart */}
                <div className="flex-1 rounded-lg p-2.5 flex flex-col min-w-0" style={cardStyle}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[9px] text-dark-500 font-medium">Weekly Exams</p>
                    <span className="text-[7.5px] text-emerald-500 font-medium">↑ 12%</span>
                  </div>
                  <div className="flex-1 flex items-end gap-1 pb-1">
                    {BAR_HEIGHTS.map((h, i) => (
                      <motion.div key={i} className="flex-1 rounded-sm min-w-0"
                        style={{
                          background: i === 5
                            ? 'linear-gradient(to top,#0891b2,#22d3ee)'
                            : isDark
                              ? 'linear-gradient(to top,rgba(8,145,178,0.35),rgba(34,211,238,0.15))'
                              : 'linear-gradient(to top,rgba(8,145,178,0.25),rgba(34,211,238,0.10))',
                          transformOrigin:'bottom', height:`${h}%`,
                        }}
                        initial={{ scaleY:0 }} animate={{ scaleY:1 }}
                        transition={{ delay:1.4+i*0.08, duration:0.5, ease:'easeOut' }}
                      />
                    ))}
                  </div>
                  <div className="flex">
                    {BAR_DAYS.map((d, i) => (
                      <span key={i} className="flex-1 text-center text-[7px] text-dark-600">{d}</span>
                    ))}
                  </div>
                </div>

                {/* Activity */}
                <div className="w-32 rounded-lg p-2.5 flex flex-col gap-2 shrink-0" style={cardStyle}>
                  <p className="text-[9px] text-dark-500 font-medium">Live Activity</p>
                  {ACTIVITIES.map((a, i) => (
                    <motion.div key={i}
                      initial={{ opacity:0, x:8 }} animate={{ opacity:1, x:0 }}
                      transition={{ delay:1.6+i*0.12, duration:0.35 }}
                      className="flex items-start gap-1.5">
                      <motion.span
                        className={`w-1.5 h-1.5 rounded-full mt-0.5 shrink-0 ${a.dot}`}
                        animate={{ opacity:[1,0.3,1] }}
                        transition={{ duration:2, repeat:Infinity, delay:i*0.6 }} />
                      <div className="min-w-0">
                        <p className="text-[8px] text-dark-400 leading-snug truncate">{a.text}</p>
                        <p className="text-[7px] text-dark-600">{a.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Candidate table */}
              <div className="rounded-lg p-2 shrink-0" style={cardStyle}>
                <div className="grid grid-cols-4 mb-1.5 px-1">
                  {['Candidate','Exam','Score','Status'].map(h => (
                    <span key={h} className="text-[8px] text-dark-600 font-medium">{h}</span>
                  ))}
                </div>
                {CANDIDATES.map((c, i) => (
                  <motion.div key={c.name}
                    initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }}
                    transition={{ delay:1.8+i*0.09, duration:0.3 }}
                    className="grid grid-cols-4 px-1 py-1 items-center"
                    style={{ borderBottom: i < CANDIDATES.length-1 ? `1px solid ${cv(700,0.08)}` : 'none' }}>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-bold shrink-0 bg-cyan-500/10 text-cyan-500">
                        {c.name[0]}
                      </div>
                      <span className="text-[8px] text-dark-300 truncate">{c.name}</span>
                    </div>
                    <span className="text-[8px] text-dark-500 truncate pr-1">{c.exam}</span>
                    <span className="text-[8.5px] font-semibold text-cyan-500">{c.score}%</span>
                    <span className={`text-[7px] font-semibold px-1.5 py-0.5 rounded-full w-fit ${
                      c.pass ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-500'
                    }`}>
                      {c.pass ? 'Pass' : 'Fail'}
                    </span>
                  </motion.div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Floating Feature Cards ───────────────────────────────────────────────────

function FloatingCards({ isDark, reduced }) {
  const cardStyle = {
    background:     cv(900, 0.88),
    border:         `1px solid ${cv(700, 0.18)}`,
    backdropFilter: 'blur(16px)',
    boxShadow:      isDark ? '0 8px 32px rgba(0,0,0,0.5)' : '0 4px 20px rgba(0,0,0,0.10)',
    whiteSpace:     'nowrap',
  }
  return (
    <>
      {FLOAT_CARDS.map(({ icon:Icon, label, cls, delay, fy }) => (
        <motion.div key={label} className={`absolute z-20 ${cls}`}
          initial={{ opacity:0, scale:0.8, filter:'blur(8px)' }}
          animate={{ opacity:1, scale:1,   filter:'blur(0px)' }}
          transition={{ delay, duration:0.55, ease:EASE }}>
          <motion.div
            animate={reduced ? {} : { y:fy }}
            transition={{ duration:4+delay, repeat:Infinity, ease:'easeInOut' }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-dark-300"
            style={cardStyle}>
            <Icon className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
            <span>{label}</span>
          </motion.div>
        </motion.div>
      ))}
    </>
  )
}

// ─── Scroll Indicator ─────────────────────────────────────────────────────────

function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity:0 }} animate={{ opacity:1 }}
      transition={{ delay:2.4, duration:0.6 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 select-none"
      aria-hidden="true">
      <span className="text-[9px] text-dark-600 uppercase tracking-[0.2em]">Scroll</span>
      <div className="w-5 h-8 rounded-full flex items-start justify-center pt-1.5"
        style={{ border:`1px solid ${cv(700,0.25)}` }}>
        <motion.div className="w-1 h-1.5 rounded-full bg-dark-500"
          animate={{ y:[0,12,0], opacity:[1,0,1] }}
          transition={{ duration:1.9, repeat:Infinity, ease:'easeInOut' }} />
      </div>
    </motion.div>
  )
}

// ─── Hero Section (main export) ───────────────────────────────────────────────

export default function HeroSection() {
  const { theme } = useTheme()
  const isDark    = theme === 'dark'
  const reduced   = useReducedMotion()

  const mouseX  = useMotionValue(0)
  const mouseY  = useMotionValue(0)
  const smoothX = useSpring(mouseX, { stiffness:40, damping:20 })
  const smoothY = useSpring(mouseY, { stiffness:40, damping:20 })
  const bgX     = useTransform(smoothX, v => v * -0.4)
  const bgY     = useTransform(smoothY, v => v * -0.4)
  const dashX   = useTransform(smoothX, v => v * 0.6)
  const dashY   = useTransform(smoothY, v => v * 0.35)

  const handleMouseMove = useCallback((e) => {
    if (reduced) return
    const r = e.currentTarget.getBoundingClientRect()
    mouseX.set(((e.clientX - r.left) / r.width  - 0.5) * 30)
    mouseY.set(((e.clientY - r.top)  / r.height - 0.5) * 30)
  }, [reduced, mouseX, mouseY])

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0); mouseY.set(0)
  }, [mouseX, mouseY])

  const vignette = `radial-gradient(ellipse 80% 80% at 50% 50%,transparent 45%,${cv(950,0.78)} 100%)`

  return (
    <section
      className="relative h-screen flex items-center overflow-hidden bg-dark-950"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Parallax background */}
      <motion.div className="absolute inset-0" style={{ x:bgX, y:bgY }} aria-hidden="true">
        <AnimatedGrid isDark={isDark} />
        <GlowOrbs isDark={isDark} reduced={reduced} />
      </motion.div>

      {/* Static overlays */}
      <Particles reduced={reduced} />

      {/* Noise texture */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
          backgroundRepeat:'repeat', backgroundSize:'200px 200px',
        }} />

      {/* Vignette — adapts via CSS var */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
        style={{ background:vignette, zIndex:1 }} />

      {/* Radial spotlight */}
      <div aria-hidden="true" className="absolute pointer-events-none" style={{
        width:800, height:800, top:'-10%', left:'5%', zIndex:1,
        background:`radial-gradient(circle,${isDark ? 'rgba(34,211,238,0.045)' : 'rgba(14,165,233,0.03)'} 0%,transparent 70%)`,
      }} />

      {/* Main content */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-4" style={{ zIndex:10 }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

          {/* Left */}
          <div>
            <HeroBadge isDark={isDark} />
            <AnimatedHeading />
            <HeroDescription />
            <CTAButtons isDark={isDark} />
            <TrustIndicators />
          </div>

          {/* Right */}
          <div className="relative hidden lg:flex justify-center items-center">
            <div className="relative w-full pr-32">
              <FloatingCards isDark={isDark} reduced={reduced} />
              <DashboardMockup isDark={isDark} reduced={reduced} px={dashX} py={dashY} />
            </div>
          </div>

        </div>
      </div>

      <ScrollIndicator />
    </section>
  )
}
