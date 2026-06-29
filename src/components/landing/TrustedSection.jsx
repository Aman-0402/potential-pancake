import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useInView,
  useReducedMotion,
} from 'framer-motion'
import { useTheme } from '../../contexts/ThemeContext'
import {
  Globe, Cloud, Database, Cpu, Code2, Building2,
  TrendingUp, Zap, GraduationCap, BookOpen, Star,
  BarChart2, GitBranch, Layers, Award, Users, Shield,
  CheckCircle2,
} from 'lucide-react'

// ─── CSS-variable helper ──────────────────────────────────────────────────────
const cv = (n, op = 1) =>
  op < 1 ? `rgb(var(--c-dark-${n}) / ${op})` : `rgb(var(--c-dark-${n}))`

// ─── Constants ────────────────────────────────────────────────────────────────
const LOGOS = [
  { name: 'Google',      Icon: Globe,         color: 'text-blue-400'    },
  { name: 'Microsoft',   Icon: Layers,        color: 'text-cyan-400'    },
  { name: 'AWS',         Icon: Cloud,         color: 'text-orange-400'  },
  { name: 'Cisco',       Icon: GitBranch,     color: 'text-blue-500'    },
  { name: 'Oracle',      Icon: Database,      color: 'text-red-400'     },
  { name: 'IBM',         Icon: Cpu,           color: 'text-blue-600'    },
  { name: 'Infosys',     Icon: Code2,         color: 'text-cyan-500'    },
  { name: 'TCS',         Icon: Building2,     color: 'text-violet-400'  },
  { name: 'Accenture',   Icon: TrendingUp,    color: 'text-purple-400'  },
  { name: 'Wipro',       Icon: Zap,           color: 'text-yellow-400'  },
  { name: 'IIT Delhi',   Icon: GraduationCap, color: 'text-emerald-400' },
  { name: 'MIT',         Icon: BookOpen,      color: 'text-emerald-500' },
  { name: 'Capgemini',   Icon: Star,          color: 'text-blue-300'    },
  { name: 'Deloitte',    Icon: BarChart2,     color: 'text-green-400'   },
]

const STATS = [
  {
    num: 500, suffix: '+', label: 'Organizations',
    sub: 'Active worldwide',
    Icon: Building2,  colorClass: 'text-cyan-500',
    glowDark: 'rgba(6,182,212,0.18)',   glowLight: 'rgba(6,182,212,0.09)',
    borderHoverDark: 'rgba(6,182,212,0.35)', borderHoverLight: 'rgba(6,182,212,0.25)',
  },
  {
    num: 250, suffix: 'K+', label: 'Certificates Issued',
    sub: 'Tamper-proof & verifiable',
    Icon: Award, colorClass: 'text-violet-500',
    glowDark: 'rgba(139,92,246,0.18)',  glowLight: 'rgba(139,92,246,0.09)',
    borderHoverDark: 'rgba(139,92,246,0.35)', borderHoverLight: 'rgba(139,92,246,0.25)',
  },
  {
    num: 1, suffix: 'M+', label: 'Candidates',
    sub: 'Exams taken globally',
    Icon: Users,  colorClass: 'text-emerald-500',
    glowDark: 'rgba(16,185,129,0.18)',  glowLight: 'rgba(16,185,129,0.09)',
    borderHoverDark: 'rgba(16,185,129,0.35)', borderHoverLight: 'rgba(16,185,129,0.25)',
  },
  {
    num: 99.9, suffix: '%', label: 'Platform Uptime',
    sub: 'SLA guaranteed',
    Icon: Shield, colorClass: 'text-amber-500',
    glowDark: 'rgba(245,158,11,0.18)',  glowLight: 'rgba(245,158,11,0.09)',
    borderHoverDark: 'rgba(245,158,11,0.35)', borderHoverLight: 'rgba(245,158,11,0.25)',
  },
]

const HEADING_LINES = [
  ['Trusted', ' ', 'by', ' ', 'Growing', ' ', 'Organizations', ','],
  ['Universities', ' ', '&', ' ', 'Enterprises'],
]
const GRADIENT_WORDS = new Set(['Organizations', 'Universities', 'Enterprises'])

const EASE = [0.25, 0.4, 0.25, 1]

// ─── Motion Variants ──────────────────────────────────────────────────────────
const charVar = {
  hidden:  { opacity: 0, y: 18, filter: 'blur(4px)' },
  visible: { opacity: 1, y: 0,  filter: 'blur(0px)',
    transition: { duration: 0.32, ease: EASE } },
}

const headingStagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.025, delayChildren: 0.15 } },
}

const fadeUpOnce = (delay = 0) => ({
  initial:    { opacity: 0, y: 24, filter: 'blur(6px)' },
  whileInView:{ opacity: 1, y: 0,  filter: 'blur(0px)' },
  viewport:   { once: true, margin: '-40px' },
  transition: { duration: 0.6, delay, ease: EASE },
})

const gradInnerStyle = {
  background:         'linear-gradient(135deg,#22d3ee 0%,#a78bfa 50%,#38bdf8 100%)',
  backgroundSize:     '250% 100%',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip:     'text',
}

// ─── FloatingBackground ───────────────────────────────────────────────────────
function FloatingBackground({ isDark, reduced }) {
  const gridColor = isDark ? 'rgba(34,211,238,0.035)' : 'rgba(14,165,233,0.05)'
  const orbs = [
    { w:700, h:700, top:'5%',   left:'55%',  color: isDark?'rgba(6,182,212,0.07)':'rgba(6,182,212,0.035)',   x:[0,50,0],  y:[0,30,0],  dur:22 },
    { w:500, h:500, top:'40%',  left:'-5%',  color: isDark?'rgba(139,92,246,0.07)':'rgba(139,92,246,0.035)', x:[0,-35,0], y:[0,40,0],  dur:28 },
    { w:400, h:400, top:'65%',  left:'70%',  color: isDark?'rgba(59,130,246,0.06)':'rgba(59,130,246,0.03)',  x:[0,25,0],  y:[0,-30,0], dur:19 },
  ]
  const particles = Array.from({ length: 16 }, (_, i) => ({
    id: i, left:`${(i*19+7)%95}%`, top:`${(i*13+11)%90}%`,
    size: 1+(i%2), dur: 9+(i%5)*2, delay:(i%4)*1.5, op: 0.08+(i%3)*0.06,
  }))

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Grid */}
      <div className="absolute inset-0" style={{
        backgroundImage: `linear-gradient(${gridColor} 1px,transparent 1px),linear-gradient(90deg,${gridColor} 1px,transparent 1px)`,
        backgroundSize: '64px 64px',
      }} />
      {/* Orbs */}
      {orbs.map((o, i) => (
        <motion.div key={i} className="absolute rounded-full"
          style={{ width:o.w, height:o.h, top:o.top, left:o.left,
            background:`radial-gradient(circle,${o.color} 0%,transparent 70%)` }}
          animate={reduced ? {} : { x:o.x, y:o.y }}
          transition={{ duration:o.dur, repeat:Infinity, ease:'easeInOut', delay:i*3 }}
        />
      ))}
      {/* Particles */}
      {!reduced && particles.map(p => (
        <motion.div key={p.id} className="absolute rounded-full bg-cyan-400"
          style={{ width:p.size, height:p.size, left:p.left, top:p.top, opacity:p.op }}
          animate={{ y:[-10,10,-10], opacity:[p.op, p.op*0.2, p.op] }}
          transition={{ duration:p.dur, repeat:Infinity, ease:'easeInOut', delay:p.delay }}
        />
      ))}
      {/* Noise */}
      <div className="absolute inset-0 opacity-[0.022]" style={{
        backgroundImage:'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
        backgroundRepeat:'repeat', backgroundSize:'180px 180px',
      }} />
    </div>
  )
}

// ─── SectionHeader ────────────────────────────────────────────────────────────
function SectionHeader({ isDark }) {
  const badgeStyle = isDark
    ? { background:'rgba(34,211,238,0.07)', border:'1px solid rgba(34,211,238,0.2)', color:'#67e8f9' }
    : { background:'rgba(14,165,233,0.07)', border:'1px solid rgba(14,165,233,0.2)', color:'#0369a1' }

  return (
    <div className="text-center mb-14">
      {/* Badge */}
      <motion.div
        initial={{ opacity:0, y:-14, filter:'blur(6px)' }}
        whileInView={{ opacity:1, y:0,   filter:'blur(0px)' }}
        viewport={{ once:true, margin:'-40px' }}
        transition={{ duration:0.5, ease:EASE }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-7"
        style={{ backdropFilter:'blur(12px)', ...badgeStyle }}
      >
        <Globe className="w-3.5 h-3.5" />
        <span>Trusted Worldwide</span>
        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" aria-hidden="true" />
      </motion.div>

      {/* Heading */}
      <motion.h2
        variants={headingStagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once:true, margin:'-60px' }}
        className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold leading-[1.1] tracking-tight mb-5 text-white"
      >
        {HEADING_LINES.map((words, li) => (
          <span key={li} className="block">
            {words.map((word, wi) => {
              if (word === ' ')
                return <span key={wi} style={{ display:'inline-block', width:'0.28em' }} aria-hidden="true" />
              if (word === ',')
                return <motion.span key={wi} variants={charVar} style={{ display:'inline-block' }}>,</motion.span>
              if (word === '&')
                return <motion.span key={wi} variants={charVar} style={{ display:'inline-block', marginInline:'0.1em' }}>&amp;</motion.span>

              if (GRADIENT_WORDS.has(word)) {
                return (
                  <motion.span key={wi} variants={charVar} style={{ display:'inline-block' }}>
                    <motion.span
                      style={gradInnerStyle}
                      animate={{ backgroundPosition:['0% 50%','100% 50%','0% 50%'] }}
                      transition={{ duration:5, repeat:Infinity, ease:'linear', delay:li*0.8 }}
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
      </motion.h2>

      {/* Description */}
      <motion.p
        {...fadeUpOnce(0.5)}
        className="text-base text-dark-400 leading-relaxed max-w-2xl mx-auto"
      >
        Thousands of candidates, educational institutions, training organizations,
        and enterprises rely on CertiByt to conduct secure examinations and issue
        verifiable digital certificates.
      </motion.p>
    </div>
  )
}

// ─── LogoCard ─────────────────────────────────────────────────────────────────
function LogoCard({ name, Icon, color, isDark }) {
  return (
    <motion.div
      whileHover={{ y:-4, scale:1.03 }}
      transition={{ type:'spring', stiffness:320, damping:22 }}
      className="shrink-0 flex items-center gap-3 px-5 py-3.5 rounded-2xl cursor-default select-none mx-2"
      style={{
        background:     cv(900, 0.7),
        border:         `1px solid ${cv(700, 0.22)}`,
        backdropFilter: 'blur(14px)',
        boxShadow:      isDark
          ? '0 4px 24px rgba(0,0,0,0.35),inset 0 1px 0 rgba(255,255,255,0.05)'
          : '0 2px 14px rgba(0,0,0,0.07),inset 0 1px 0 rgba(255,255,255,0.8)',
      }}
    >
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: cv(800, 0.6), border:`1px solid ${cv(700, 0.15)}` }}
      >
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
      <span className="text-sm font-semibold text-dark-300 whitespace-nowrap">
        {name}
      </span>
    </motion.div>
  )
}

// ─── InfiniteMarquee ──────────────────────────────────────────────────────────
function InfiniteMarquee({ isDark, reduced }) {
  const [paused, setPaused] = useState(false)
  const speed = reduced ? 999 : 40

  return (
    <motion.div
      {...fadeUpOnce(0.7)}
      className="relative py-3 mb-20"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* CSS keyframe injected inline — avoids a separate CSS file */}
      <style>{`@keyframes marquee-x { to { transform: translateX(-50%); } }`}</style>

      {/* Edge fades */}
      <div aria-hidden="true" className="absolute inset-y-0 left-0 w-28 z-10 pointer-events-none"
        style={{ background:`linear-gradient(to right,${cv(950)} 0%,transparent 100%)` }} />
      <div aria-hidden="true" className="absolute inset-y-0 right-0 w-28 z-10 pointer-events-none"
        style={{ background:`linear-gradient(to left,${cv(950)} 0%,transparent 100%)` }} />

      {/* Track — doubled for seamless loop */}
      <div className="overflow-hidden">
        <div
          style={{
            display:'flex',
            width:'fit-content',
            animation:`marquee-x ${speed}s linear infinite`,
            animationPlayState: paused ? 'paused' : 'running',
          }}
        >
          {[...LOGOS, ...LOGOS].map((logo, i) => (
            <LogoCard key={i} {...logo} isDark={isDark} />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// ─── StatCard ─────────────────────────────────────────────────────────────────
function StatCard({
  num, suffix, label, sub, Icon,
  colorClass, glowDark, glowLight, borderHoverDark, borderHoverLight,
  isDark, delay,
}) {
  const ref        = useRef(null)
  const isInView   = useInView(ref, { once:true, margin:'-30px' })
  const reduced    = useReducedMotion()
  const [count, setCount] = useState(0)
  const [hovered, setHovered]  = useState(false)
  const isDecimal  = num === 99.9

  useEffect(() => {
    if (!isInView) return
    if (reduced) { setCount(num); return }

    let raf
    let start = null
    const duration = 1800
    raf = requestAnimationFrame(function step(ts) {
      if (!start) start = ts
      const p   = Math.min((ts - start) / duration, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      setCount(isDecimal
        ? parseFloat((ease * num).toFixed(1))
        : Math.round(ease * num)
      )
      if (p < 1) raf = requestAnimationFrame(step)
    })
    return () => cancelAnimationFrame(raf)
  }, [isInView, num, reduced, isDecimal])

  const glow   = isDark ? glowDark   : glowLight
  const bHover = isDark ? borderHoverDark : borderHoverLight

  return (
    <motion.div
      ref={ref}
      initial={{ opacity:0, y:30, filter:'blur(8px)' }}
      whileInView={{ opacity:1, y:0, filter:'blur(0px)' }}
      viewport={{ once:true, margin:'-30px' }}
      transition={{ duration:0.55, delay, ease:EASE }}
      whileHover={{ y:-5 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="rounded-3xl p-7 flex flex-col gap-4 cursor-default transition-shadow duration-300"
      style={{
        background:     cv(900, 0.75),
        border:         `1px solid ${hovered ? bHover : cv(700, 0.18)}`,
        backdropFilter: 'blur(18px)',
        boxShadow:      hovered
          ? `0 20px 60px rgba(0,0,0,${isDark?0.45:0.12}),0 0 0 1px ${bHover},0 0 40px ${glow}`
          : `0 4px 24px rgba(0,0,0,${isDark?0.3:0.06})`,
        transition: 'border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease',
      }}
    >
      {/* Icon */}
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center"
        style={{
          background: cv(800, 0.7),
          border:`1px solid ${cv(700, 0.15)}`,
          boxShadow: hovered ? `0 0 20px ${glow}` : 'none',
          transition: 'box-shadow 0.25s ease',
        }}
      >
        <motion.div
          animate={hovered && !reduced ? { rotate:10 } : { rotate:0 }}
          transition={{ type:'spring', stiffness:300, damping:15 }}
        >
          <Icon className={`w-5 h-5 ${colorClass}`} />
        </motion.div>
      </div>

      {/* Number */}
      <div>
        <p className={`text-4xl font-extrabold tracking-tight ${colorClass}`}>
          {isDecimal ? count.toFixed(1) : count.toLocaleString()}{suffix}
        </p>
        <p className="text-base font-semibold text-white mt-1">{label}</p>
        <p className="text-sm text-dark-500 mt-0.5">{sub}</p>
      </div>

      {/* Bottom accent line */}
      <div
        className="h-0.5 rounded-full mt-auto transition-all duration-300"
        style={{
          background: hovered
            ? `linear-gradient(to right,${glow.replace(/[\d.]+\)$/, '0.8)')},transparent)`
            : cv(700, 0.12),
          width: hovered ? '100%' : '40%',
        }}
      />
    </motion.div>
  )
}

// ─── StatisticsGrid ───────────────────────────────────────────────────────────
function StatisticsGrid({ isDark }) {
  return (
    <div className="relative">
      {/* Large glow behind grid */}
      <div aria-hidden="true" className="absolute -inset-12 pointer-events-none"
        style={{
          background:`radial-gradient(ellipse 70% 60% at 50% 50%,${
            isDark ? 'rgba(6,182,212,0.06)' : 'rgba(6,182,212,0.03)'
          } 0%,transparent 70%)`,
        }} />

      <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s, i) => (
          <StatCard key={s.label} {...s} isDark={isDark} delay={0.1 + i * 0.1} />
        ))}
      </div>
    </div>
  )
}

// ─── TrustedSection ───────────────────────────────────────────────────────────
export default function TrustedSection() {
  const { theme } = useTheme()
  const isDark    = theme === 'dark'
  const reduced   = useReducedMotion()

  return (
    <section
      className="relative overflow-hidden bg-dark-950"
      aria-labelledby="trusted-heading"
    >
      <FloatingBackground isDark={isDark} reduced={reduced} />

      {/* Top divider glow */}
      <div aria-hidden="true" className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px"
        style={{ background:`linear-gradient(to right,transparent,${
          isDark ? 'rgba(34,211,238,0.3)' : 'rgba(14,165,233,0.2)'
        },transparent)` }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 sm:py-20 lg:py-28" style={{ zIndex:10 }}>
        <SectionHeader isDark={isDark} />
        <InfiniteMarquee isDark={isDark} reduced={reduced} />
        <StatisticsGrid isDark={isDark} />
      </div>

      {/* Bottom divider glow */}
      <div aria-hidden="true" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px"
        style={{ background:`linear-gradient(to right,transparent,${
          isDark ? 'rgba(34,211,238,0.2)' : 'rgba(14,165,233,0.12)'
        },transparent)` }} />
    </section>
  )
}
