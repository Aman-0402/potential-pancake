import { useRef, useState, useEffect } from 'react'
import { motion, useReducedMotion, useInView } from 'framer-motion'
import { useTheme } from '../../contexts/ThemeContext'
import {
  Building2, FileText, Tag, BarChart2, Award, Shield,
  ArrowRight, Sparkles, CheckCircle, TrendingUp, Users,
  Activity, Bell, BookOpen, Zap, Lock,
  LayoutDashboard,
} from 'lucide-react'

// ─── helpers ──────────────────────────────────────────────────────────────────
const cv = (n, op = 1) =>
  op < 1 ? `rgb(var(--c-dark-${n}) / ${op})` : `rgb(var(--c-dark-${n}))`

const EASE = [0.25, 0.4, 0.25, 1]

const solGradStyle = {
  background: 'linear-gradient(135deg,#C9A84C 0%,#E4C36E 50%,#AF8E38 100%)',
  backgroundSize: '250% 100%',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
}

// ─── data ─────────────────────────────────────────────────────────────────────
const HEADING = [
  ['Everything', ' ', 'You', ' ', 'Need'],
  ['To', ' ', 'Run', ' ', 'Enterprise', ' ', 'Exams'],
]
const GRAD_WORDS = new Set(['Enterprise', 'Exams'])

const charVar = {
  hidden:  { opacity: 0, y: 18, filter: 'blur(6px)' },
  visible: { opacity: 1, y: 0,  filter: 'blur(0px)', transition: { duration: 0.32, ease: EASE } },
}
const lineStagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.016, delayChildren: 0.15 } },
}

const FEATURES = [
  {
    Icon: Building2, num: '01',
    title: 'Multi-Tenant Organizations',
    desc:  'Manage unlimited universities, institutions, and companies from one intelligent platform.',
    accent: '#22d3ee',
    glow:   'rgba(34,211,238,0.16)',
    border: ['rgba(34,211,238,0.45)','rgba(56,189,248,0.18)'],
    bg:     'rgba(34,211,238,0.07)',
  },
  {
    Icon: FileText, num: '02',
    title: 'Smart Exam Management',
    desc:  'Create, schedule, and manage examinations with intelligent workflows and automation.',
    accent: '#3b82f6',
    glow:   'rgba(59,130,246,0.16)',
    border: ['rgba(59,130,246,0.45)','rgba(99,102,241,0.18)'],
    bg:     'rgba(59,130,246,0.07)',
  },
  {
    Icon: Tag, num: '03',
    title: 'Voucher System',
    desc:  'Generate secure vouchers, assign exams instantly, and track redemption in real time.',
    accent: '#8b5cf6',
    glow:   'rgba(139,92,246,0.16)',
    border: ['rgba(139,92,246,0.45)','rgba(167,139,250,0.18)'],
    bg:     'rgba(139,92,246,0.07)',
  },
  {
    Icon: BarChart2, num: '04',
    title: 'Live Analytics',
    desc:  'Track candidates, exams, pass rates, and performance with real-time dashboards.',
    accent: '#10b981',
    glow:   'rgba(16,185,129,0.16)',
    border: ['rgba(16,185,129,0.45)','rgba(52,211,153,0.18)'],
    bg:     'rgba(16,185,129,0.07)',
  },
  {
    Icon: Award, num: '05',
    title: 'Digital Certificates',
    desc:  'Automatically issue verifiable, tamper-proof digital certificates at scale.',
    accent: '#f59e0b',
    glow:   'rgba(245,158,11,0.16)',
    border: ['rgba(245,158,11,0.45)','rgba(251,191,36,0.18)'],
    bg:     'rgba(245,158,11,0.07)',
  },
  {
    Icon: Shield, num: '06',
    title: 'Enterprise Security',
    desc:  'JWT, RBAC, OTP, tenant isolation, rate limiting, and secure uploads — built in.',
    accent: '#ef4444',
    glow:   'rgba(239,68,68,0.16)',
    border: ['rgba(239,68,68,0.45)','rgba(248,113,113,0.18)'],
    bg:     'rgba(239,68,68,0.07)',
  },
]

// Deterministic particles — no Math.random in render
const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  w:    ((i * 1.7 + 1.3) % 2.5) + 1,
  left: (i * 19 + 7)  % 100,
  top:  (i * 31 + 13) % 100,
  color: ['#C9A84C','#E4C36E','#AF8E38','#D4AA5A'][i % 4],
  dur:  3.5 + (i % 5) * 0.9,
  dly:  (i * 0.35) % 3.5,
  amp:  6 + (i % 3) * 5,
}))

const FLOAT_BADGES = [
  { text: 'Certificate Issued',    sub: 'Ahmed Al-Rashid',  Icon: Award,       color: '#f59e0b', pos: { top: '7%',    left: '-7%'  }, delay: 0.3 },
  { text: '500+ Organizations',    sub: 'Worldwide',        Icon: Building2,   color: '#22d3ee', pos: { top: '5%',    right: '-6%' }, delay: 0.6 },
  { text: '99.9% Uptime',          sub: 'SLA Guaranteed',   Icon: Zap,         color: '#10b981', pos: { bottom: '20%',left: '-9%'  }, delay: 1.0 },
  { text: 'AI Proctoring Active',  sub: 'Live • Secure',    Icon: Shield,      color: '#8b5cf6', pos: { bottom: '12%',right: '-7%' }, delay: 0.8 },
  { text: 'Exam Completed',        sub: '94% Pass Rate',    Icon: CheckCircle, color: '#3b82f6', pos: { top: '41%',   left: '-11%' }, delay: 0.2 },
  { text: 'Live Analytics',        sub: '2,847 candidates', Icon: Activity,    color: '#22d3ee', pos: { top: '37%',   right: '-9%' }, delay: 1.2 },
]

const DASH_STATS = [
  { label: 'Candidates', value: 2847, suffix: '',  color: '#22d3ee', Icon: Users,      delta: '+12%' },
  { label: 'Exams',      value: 143,  suffix: '',  color: '#3b82f6', Icon: FileText,   delta: '+8%'  },
  { label: 'Pass Rate',  value: 94,   suffix: '%', color: '#10b981', Icon: TrendingUp, delta: '+3%'  },
  { label: 'Certs',      value: 1203, suffix: '+', color: '#f59e0b', Icon: Award,      delta: '+21%' },
]
const BAR_DATA   = [62, 80, 55, 90, 72, 84, 95]
const DAY_LABELS = ['M','T','W','T','F','S','S']
const RECENT = [
  { name: 'AWS Cloud Practitioner', org: 'TechCorp Inc.',   cands: 48, pass: 92, color: '#22d3ee' },
  { name: 'ISO 27001 Audit',        org: 'SecureFinance',   cands: 23, pass: 87, color: '#3b82f6' },
  { name: 'React Developer Cert',   org: 'DevAcademy',      cands: 91, pass: 96, color: '#8b5cf6' },
]
const DASH_NAV = [
  { label: 'Dashboard',     Icon: LayoutDashboard, active: true  },
  { label: 'Exams',         Icon: FileText,        active: false },
  { label: 'Organizations', Icon: Building2,       active: false },
  { label: 'Certificates',  Icon: Award,           active: false },
  { label: 'Analytics',     Icon: BarChart2,       active: false },
  { label: 'Security',      Icon: Lock,            active: false },
]

// ─── AnimCounter ──────────────────────────────────────────────────────────────
function AnimCounter({ to, duration = 1.6, suffix = '' }) {
  const [val, setVal] = useState(0)
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let frame
    const t0 = performance.now()
    const ms = duration * 1000
    const tick = (now) => {
      const p     = Math.min((now - t0) / ms, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(eased * to))
      if (p < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, to, duration])

  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>
}

// ─── AnimBackground ───────────────────────────────────────────────────────────
function AnimBackground({ isDark, reduced }) {
  const gc = isDark ? 'rgba(201,168,76,0.018)' : 'rgba(201,168,76,0.03)'
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Grid */}
      <div className="absolute inset-0" style={{
        backgroundImage: `linear-gradient(${gc} 1px,transparent 1px),linear-gradient(90deg,${gc} 1px,transparent 1px)`,
        backgroundSize: '64px 64px',
      }} />

      {/* Spotlight behind heading */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-96 blur-3xl"
        style={{ background: isDark ? 'rgba(201,168,76,0.04)' : 'rgba(201,168,76,0.025)' }} />

      {!reduced && (
        <>
          {/* Orb 1 — gold, top-left */}
          <motion.div className="absolute rounded-full blur-3xl"
            animate={{ x:[0,60,-30,0], y:[0,-40,20,0], scale:[1,1.12,0.94,1] }}
            transition={{ duration:20, repeat:Infinity, ease:'easeInOut' }}
            style={{ width:700, height:700, top:'-15%', left:'-5%',
              background: isDark?'rgba(201,168,76,0.05)':'rgba(201,168,76,0.028)' }} />

          {/* Orb 2 — dark gold, bottom-right */}
          <motion.div className="absolute rounded-full blur-3xl"
            animate={{ x:[0,-50,25,0], y:[0,40,-20,0], scale:[1,0.9,1.08,1] }}
            transition={{ duration:25, repeat:Infinity, ease:'easeInOut', delay:3 }}
            style={{ width:600, height:600, bottom:'-10%', right:'-5%',
              background: isDark?'rgba(175,144,55,0.05)':'rgba(175,144,55,0.025)' }} />

          {/* Orb 3 — light gold, center pulse */}
          <motion.div className="absolute rounded-full blur-3xl"
            animate={{ scale:[1,1.2,1], opacity:[0.35,0.6,0.35] }}
            transition={{ duration:10, repeat:Infinity, ease:'easeInOut' }}
            style={{ width:500, height:500, top:'25%', left:'50%', transform:'translateX(-50%)',
              background: isDark?'rgba(228,195,110,0.035)':'rgba(228,195,110,0.02)' }} />

          {/* Particles */}
          {PARTICLES.map((p, i) => (
            <motion.div key={i} className="absolute rounded-full"
              style={{ width:p.w, height:p.w, left:`${p.left}%`, top:`${p.top}%`,
                background:p.color, opacity:0.35 }}
              animate={{ y:[0,-p.amp,0], opacity:[0.15,0.45,0.15] }}
              transition={{ duration:p.dur, repeat:Infinity, delay:p.dly, ease:'easeInOut' }}
            />
          ))}
        </>
      )}
    </div>
  )
}

// ─── SolutionHeader ───────────────────────────────────────────────────────────
function SolutionHeader({ isDark }) {
  const badgeStyle = isDark
    ? { background:'rgba(201,168,76,0.1)',  border:'1px solid rgba(201,168,76,0.3)', color:'#E4C36E' }
    : { background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.28)', color:'#9E7E28' }

  return (
    <div className="text-center mb-16">
      {/* Heading — char-by-char stagger */}
      <motion.h2 id="solution-heading"
        variants={lineStagger} initial="hidden" whileInView="visible" viewport={{ once:true }}
        className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold leading-[1.07] tracking-tight mb-5 text-white"
      >
        {HEADING.map((line, li) => (
          <span key={li} className="block">
            {line.map((word, wi) => {
              if (word === ' ')
                return <span key={wi} style={{ display:'inline-block', width:'0.28em' }} aria-hidden="true" />
              if (GRAD_WORDS.has(word))
                return (
                  <motion.span key={wi} variants={charVar} style={{ display:'inline-block' }}>
                    <motion.span style={solGradStyle}
                      animate={{ backgroundPosition:['0% 50%','100% 50%','0% 50%'] }}
                      transition={{ duration:5, repeat:Infinity, ease:'linear', delay:li*0.4 }}>
                      {word}
                    </motion.span>
                  </motion.span>
                )
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
      </motion.h2>

      {/* Description */}
      <motion.p
        initial={{ opacity:0, y:22, filter:'blur(6px)' }}
        whileInView={{ opacity:1, y:0, filter:'blur(0px)' }}
        viewport={{ once:true }}
        transition={{ duration:0.55, delay:0.45, ease:EASE }}
        className="text-base leading-relaxed max-w-2xl mx-auto"
        style={{ color: cv(400) }}
      >
        CertiByt brings examinations, organizations, vouchers, analytics, security,
        certificates, and reporting into one intelligent enterprise platform.
      </motion.p>
    </div>
  )
}

// ─── FeatureCard ──────────────────────────────────────────────────────────────
function FeatureCard({ feature, index, isDark, reduced }) {
  const { Icon, num, title, desc, accent, glow, border, bg } = feature
  const cardBg = isDark ? 'rgba(10,15,36,0.82)' : 'rgba(255,255,255,0.88)'
  const muted  = isDark ? 'rgba(148,163,184,1)'  : 'rgba(71,85,105,1)'

  return (
    <motion.div
      initial={reduced ? {} : { opacity:0, y:44, scale:0.93, filter:'blur(16px)' }}
      whileInView={{ opacity:1, y:0, scale:1, filter:'blur(0px)' }}
      viewport={{ once:true, margin:'-50px' }}
      transition={{ duration:0.55, delay:(index % 3) * 0.1, ease:EASE }}
      className="h-full"
    >
      {/* Variant cascade — hover state propagates to children */}
      <motion.div
        className="h-full"
        initial="rest" whileHover="hover" animate="rest"
      >
        {/* Gradient border — bg + 1px padding trick */}
        <motion.div
          variants={{
            rest:  { background:`linear-gradient(135deg,${border[0]},${border[1]})` },
            hover: { background:`linear-gradient(200deg,${accent},${border[0]},${border[1]})` },
          }}
          transition={{ duration:0.45 }}
          style={{ borderRadius:28, padding:1 }}
          className="h-full"
        >
          <motion.div
            variants={{
              rest:  { y:0,  boxShadow:`0 4px 24px rgba(0,0,0,${isDark?0.2:0.06})` },
              hover: { y:-8, boxShadow:`0 28px 64px rgba(0,0,0,${isDark?0.4:0.12}),0 0 56px ${glow}` },
            }}
            transition={{ duration:0.35, ease:EASE }}
            className="h-full flex flex-col p-7 relative overflow-hidden"
            style={{ borderRadius:27, background:cardBg, backdropFilter:'blur(20px)' }}
          >
            {/* Top-right glow */}
            <motion.div variants={{ rest:{opacity:0.4}, hover:{opacity:1} }}
              className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl pointer-events-none"
              style={{ background:glow }} />

            {/* Decorative large number */}
            <div className="absolute top-3 right-4 select-none pointer-events-none font-black"
              style={{ fontSize:90, lineHeight:1, color:accent, opacity:0.04 }}>{num}</div>

            {/* Icon */}
            <motion.div
              variants={{ rest:{rotate:0,scale:1}, hover:{rotate:12,scale:1.08} }}
              transition={{ duration:0.35 }}
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 relative z-10"
              style={{ background:bg, border:`1px solid ${border[0]}` }}
            >
              <Icon style={{ width:24, height:24, color:accent }} />
            </motion.div>

            <h3 className="text-[17px] font-bold text-white mb-3 leading-snug relative z-10">{title}</h3>
            <p className="text-[13.5px] leading-relaxed flex-1 relative z-10" style={{ color:muted }}>{desc}</p>

            {/* Learn more arrow */}
            <div className="flex items-center gap-1.5 mt-5 text-sm font-semibold relative z-10"
              style={{ color:accent }}>
              <span>Learn more</span>
              <motion.span variants={{ rest:{x:0}, hover:{x:5} }} transition={{ duration:0.2 }}>
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

// ─── FloatingBadge ────────────────────────────────────────────────────────────
function FloatingBadge({ text, sub, Icon, color, pos, delay, isDark, reduced }) {
  const bg  = isDark ? 'rgba(8,12,28,0.94)'    : 'rgba(255,255,255,0.97)'
  const txt = isDark ? '#f1f5f9'               : '#0f172a'
  const sub_c = isDark ? 'rgba(148,163,184,0.7)' : 'rgba(100,116,139,0.8)'

  return (
    <motion.div className="absolute z-20 hidden xl:block" style={pos}
      initial={{ opacity:0, scale:0.75, y:12 }}
      whileInView={{ opacity:1, scale:1, y:0 }}
      viewport={{ once:true }}
      transition={{ duration:0.5, delay, ease:EASE }}
    >
      <motion.div
        animate={reduced ? {} : { y:[0,-7,0] }}
        transition={{ duration:3+delay, repeat:Infinity, ease:'easeInOut', delay:delay*0.4 }}
        className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl"
        style={{
          background:bg,
          border:`1px solid ${color}28`,
          backdropFilter:'blur(24px)',
          boxShadow:`0 8px 32px rgba(0,0,0,${isDark?0.45:0.1}),0 0 20px ${color}18,inset 0 1px 0 rgba(255,255,255,${isDark?0.07:0.5})`,
          whiteSpace:'nowrap',
        }}
      >
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background:`${color}15`, border:`1px solid ${color}28` }}>
          <Icon style={{ width:14, height:14, color }} />
        </div>
        <div>
          <div className="text-[12px] font-semibold leading-tight" style={{ color:txt }}>{text}</div>
          <div className="text-[10px] leading-tight mt-0.5" style={{ color:sub_c }}>{sub}</div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── DashboardStats ───────────────────────────────────────────────────────────
function DashboardStats() {
  return (
    <div className="grid grid-cols-4 gap-2 mb-3">
      {DASH_STATS.map((s, i) => (
        <div key={i} className="rounded-xl p-2.5"
          style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center justify-between mb-1.5">
            <s.Icon style={{ width:11, height:11, color:s.color }} />
            <span className="text-[8px] font-semibold px-1.5 py-0.5 rounded-full"
              style={{ color:'#22c55e', background:'rgba(34,197,94,0.12)' }}>{s.delta}</span>
          </div>
          <div className="text-[14px] font-bold text-white leading-none mb-0.5">
            <AnimCounter to={s.value} duration={1.6} suffix={s.suffix} />
          </div>
          <div className="text-[9px]" style={{ color:'rgba(255,255,255,0.32)' }}>{s.label}</div>
        </div>
      ))}
    </div>
  )
}

// ─── DashboardBarChart ────────────────────────────────────────────────────────
function DashboardBarChart({ reduced }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once:true })

  return (
    <div ref={ref} className="rounded-xl p-4 mb-3"
      style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-semibold text-white">Performance (7 days)</span>
        <span className="text-[10px]" style={{ color:'rgba(255,255,255,0.28)' }}>Pass Rate %</span>
      </div>
      <div className="flex items-end gap-1.5" style={{ height:52 }}>
        {BAR_DATA.map((h, i) => (
          <div key={i} className="flex-1">
            <motion.div
              className="w-full rounded-t-sm"
              style={{ background:'linear-gradient(to top,#22d3ee,#a78bfa)', opacity:0.9 }}
              initial={{ height:0 }}
              animate={inView ? { height:`${(h/100)*52}px` } : { height:0 }}
              transition={reduced ? { duration:0 } : { duration:0.7, delay:0.6+i*0.07, ease:[0.25,0.46,0.45,0.94] }}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-1.5">
        {DAY_LABELS.map((d, i) => (
          <span key={i} className="text-[9px] flex-1 text-center"
            style={{ color:'rgba(255,255,255,0.22)' }}>{d}</span>
        ))}
      </div>
    </div>
  )
}

// ─── DashboardRecent ──────────────────────────────────────────────────────────
function DashboardRecent() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once:true })

  return (
    <div ref={ref} className="rounded-xl p-3.5"
      style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.06)' }}>
      <div className="text-[11px] font-semibold text-white mb-2.5">Recent Exams</div>
      {RECENT.map((exam, i) => (
        <motion.div key={i}
          className="flex items-center gap-2.5 py-1.5"
          initial={{ opacity:0, x:-10 }}
          animate={inView ? { opacity:1, x:0 } : {}}
          transition={{ duration:0.4, delay:1.2+i*0.12 }}
          style={{ borderBottom:i<RECENT.length-1?'1px solid rgba(255,255,255,0.04)':'none' }}
        >
          <div className="w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center"
            style={{ background:`${exam.color}15` }}>
            <BookOpen style={{ width:9, height:9, color:exam.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-medium text-white truncate">{exam.name}</div>
            <div className="text-[9px]" style={{ color:'rgba(255,255,255,0.28)' }}>{exam.org}</div>
          </div>
          <div className="text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
            style={{ color:'#22c55e', background:'rgba(34,197,94,0.1)' }}>
            {exam.pass}%
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// ─── PlatformShowcase ─────────────────────────────────────────────────────────
function PlatformShowcase({ isDark, reduced }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once:true, margin:'-80px' })

  return (
    <div ref={ref} className="relative my-20">
      {/* Floating badges */}
      {FLOAT_BADGES.map((b, i) => (
        <FloatingBadge key={i} {...b} isDark={isDark} reduced={reduced} />
      ))}

      {/* Ambient aura */}
      <div className="absolute -inset-10 rounded-[60px] blur-3xl pointer-events-none"
        style={{ background:'linear-gradient(135deg,rgba(34,211,238,0.055),rgba(139,92,246,0.055),rgba(59,130,246,0.055))',
          opacity: isDark ? 1 : 0.5 }} />

      {/* Entry animation wrapper */}
      <motion.div
        initial={{ opacity:0, scale:0.9, y:40, filter:'blur(16px)' }}
        animate={inView ? { opacity:1, scale:1, y:0, filter:'blur(0px)' } : {}}
        transition={{ duration:0.9, ease:EASE }}
      >
        {/* Continuous float */}
        <motion.div
          animate={reduced ? {} : { y:[0,-10,0] }}
          transition={{ duration:7, repeat:Infinity, ease:'easeInOut' }}
        >
          {/* Dashboard shell — always dark-themed regardless of page theme */}
          <div className="rounded-3xl overflow-hidden"
            style={{
              background:'rgba(5,9,20,0.97)',
              border:'1px solid rgba(255,255,255,0.09)',
              boxShadow:'0 60px 140px rgba(0,0,0,0.65),0 0 80px rgba(34,211,238,0.07),0 0 120px rgba(139,92,246,0.05)',
            }}
          >
            {/* Browser chrome */}
            <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.06]"
              style={{ background:'rgba(10,14,30,0.92)' }}>
              <div className="flex gap-1.5">
                {['#ef4444','#f59e0b','#22c55e'].map((c, i) => (
                  <div key={i} className="w-3 h-3 rounded-full" style={{ background:c, opacity:0.85 }} />
                ))}
              </div>
              <div className="flex-1 mx-6 flex items-center gap-2 px-4 py-1.5 rounded-lg text-[11px]"
                style={{ background:'rgba(255,255,255,0.04)', color:'rgba(255,255,255,0.28)' }}>
                <div className="w-2.5 h-2.5 rounded-full border border-white/20" />
                <span>app.certibyt.com/dashboard</span>
              </div>
              <div className="flex items-center gap-3" style={{ color:'rgba(255,255,255,0.25)' }}>
                <Bell className="w-4 h-4" />
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500" />
              </div>
            </div>

            {/* App body */}
            <div className="flex" style={{ minHeight:420 }}>
              {/* Sidebar */}
              <div className="w-44 flex-shrink-0 flex flex-col p-3 border-r border-white/[0.05]"
                style={{ background:'rgba(5,9,20,0.95)' }}>
                {/* Logo */}
                <div className="flex items-center gap-2 px-3 py-3 mb-3">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-400 to-violet-500 flex-shrink-0" />
                  <span className="text-sm font-bold text-white">CertiByt</span>
                </div>
                {DASH_NAV.map((item, i) => (
                  <div key={i}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl mb-0.5"
                    style={{
                      background:  item.active ? 'rgba(34,211,238,0.09)'       : 'transparent',
                      borderLeft:  item.active ? '2px solid #22d3ee'           : '2px solid transparent',
                    }}
                  >
                    <item.Icon style={{ width:13, height:13,
                      color: item.active?'#22d3ee':'rgba(255,255,255,0.3)' }} />
                    <span className="text-[12px]"
                      style={{ color:item.active?'#22d3ee':'rgba(255,255,255,0.35)',
                        fontWeight:item.active?600:400 }}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Main panel */}
              <div className="flex-1 p-5 min-w-0">
                {/* Panel header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm font-semibold text-white">Dashboard Overview</div>
                    <div className="text-[10px] mt-0.5" style={{ color:'rgba(255,255,255,0.28)' }}>
                      Live data · Updated just now
                    </div>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg text-[11px] font-medium cursor-pointer"
                    style={{ background:'rgba(34,211,238,0.1)', color:'#22d3ee',
                      border:'1px solid rgba(34,211,238,0.18)' }}>
                    Export ↓
                  </div>
                </div>

                <DashboardStats />
                <DashboardBarChart reduced={reduced} />
                <DashboardRecent />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

// ─── SVG connection lines (decorative, between top cards → showcase → bottom cards) ──
function ConnectionLines({ isDark }) {
  return (
    <div aria-hidden="true" className="hidden lg:flex justify-center pointer-events-none">
      <svg width="860" height="48" viewBox="0 0 860 48" fill="none"
        style={{ opacity: isDark ? 0.28 : 0.18 }}>
        <defs>
          <linearGradient id="lg1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#22d3ee" stopOpacity="0" />
            <stop offset="50%"  stopColor="#22d3ee" stopOpacity="1" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="lg2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#a78bfa" stopOpacity="0.5" />
            <stop offset="50%"  stopColor="#3b82f6" stopOpacity="1" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* left card → center */}
        <motion.path d="M 143 0 Q 143 24 430 48" stroke="url(#lg1)" strokeWidth="1.5" fill="none"
          initial={{ pathLength:0 }} whileInView={{ pathLength:1 }} viewport={{ once:true }}
          transition={{ duration:1.2, delay:0.3 }} />
        {/* center card → center */}
        <motion.path d="M 430 0 L 430 48" stroke="url(#lg1)" strokeWidth="1.5" fill="none"
          initial={{ pathLength:0 }} whileInView={{ pathLength:1 }} viewport={{ once:true }}
          transition={{ duration:0.8, delay:0.5 }} />
        {/* right card → center */}
        <motion.path d="M 717 0 Q 717 24 430 48" stroke="url(#lg2)" strokeWidth="1.5" fill="none"
          initial={{ pathLength:0 }} whileInView={{ pathLength:1 }} viewport={{ once:true }}
          transition={{ duration:1.2, delay:0.3 }} />
      </svg>
    </div>
  )
}

function ConnectionLinesReverse({ isDark }) {
  return (
    <div aria-hidden="true" className="hidden lg:flex justify-center pointer-events-none">
      <svg width="860" height="48" viewBox="0 0 860 48" fill="none"
        style={{ opacity: isDark ? 0.28 : 0.18 }}>
        <defs>
          <linearGradient id="lg3" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#22d3ee" stopOpacity="0.5" />
            <stop offset="50%"  stopColor="#a78bfa" stopOpacity="1" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path d="M 430 0 Q 430 24 143 48" stroke="url(#lg3)" strokeWidth="1.5" fill="none"
          initial={{ pathLength:0 }} whileInView={{ pathLength:1 }} viewport={{ once:true }}
          transition={{ duration:1.2, delay:0.4 }} />
        <motion.path d="M 430 0 L 430 48" stroke="url(#lg3)" strokeWidth="1.5" fill="none"
          initial={{ pathLength:0 }} whileInView={{ pathLength:1 }} viewport={{ once:true }}
          transition={{ duration:0.8, delay:0.6 }} />
        <motion.path d="M 430 0 Q 430 24 717 48" stroke="url(#lg3)" strokeWidth="1.5" fill="none"
          initial={{ pathLength:0 }} whileInView={{ pathLength:1 }} viewport={{ once:true }}
          transition={{ duration:1.2, delay:0.4 }} />
      </svg>
    </div>
  )
}

// ─── SolutionSection ──────────────────────────────────────────────────────────
export default function SolutionSection() {
  const { theme } = useTheme()
  const isDark    = theme === 'dark'
  const reduced   = useReducedMotion()

  return (
    <section
      aria-labelledby="solution-heading"
      className="relative overflow-hidden"
      style={{ background: isDark ? cv(950) : 'rgb(248,250,252)' }}
    >
      {/* Transition tint from Problem section (red) → Solution (blue) */}
      <div aria-hidden="true" className="absolute top-0 inset-x-0 h-48 pointer-events-none"
        style={{ background:'linear-gradient(to bottom,rgba(239,68,68,0.03),transparent)' }} />

      <AnimBackground isDark={isDark} reduced={reduced} />

      {/* Top divider */}
      <div aria-hidden="true" className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px"
        style={{ background:`linear-gradient(to right,transparent,${isDark?'rgba(201,168,76,0.22)':'rgba(201,168,76,0.15)'},transparent)` }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-40">
        <SolutionHeader isDark={isDark} />

        {/* Top feature row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.slice(0, 3).map((f, i) => (
            <FeatureCard key={f.title} feature={f} index={i} isDark={isDark} reduced={reduced} />
          ))}
        </div>

        {/* SVG lines from top cards to showcase */}
        <ConnectionLines isDark={isDark} />

        {/* Platform showcase — center piece */}
        <PlatformShowcase isDark={isDark} reduced={reduced} />

        {/* SVG lines from showcase to bottom cards */}
        <ConnectionLinesReverse isDark={isDark} />

        {/* Bottom feature row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.slice(3).map((f, i) => (
            <FeatureCard key={f.title} feature={f} index={i} isDark={isDark} reduced={reduced} />
          ))}
        </div>
      </div>

      {/* Bottom divider */}
      <div aria-hidden="true" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px"
        style={{ background:`linear-gradient(to right,transparent,${isDark?'rgba(201,168,76,0.18)':'rgba(201,168,76,0.12)'},transparent)` }} />
    </section>
  )
}
