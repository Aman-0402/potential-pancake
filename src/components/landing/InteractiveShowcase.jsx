import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion, useInView } from 'framer-motion'
import { useTheme } from '../../contexts/ThemeContext'
import {
  Building2, FileText, Tag, Users, Eye, BarChart2,
  Award, Search, CheckCircle, Shield, Clock,
  AlertTriangle, TrendingUp, Download, Globe,
  ChevronLeft, ChevronRight, Bell, Copy, Zap,
} from 'lucide-react'

// ─── helpers ──────────────────────────────────────────────────────────────────
const cv = (n, op = 1) =>
  op < 1 ? `rgb(var(--c-dark-${n}) / ${op})` : `rgb(var(--c-dark-${n}))`

const EASE = [0.25, 0.4, 0.25, 1]

// Shared screen transition — spread into each dashboard screen's motion.div
const SC = {
  initial: { opacity: 0, scale: 0.97, filter: 'blur(6px)', y: 10 },
  animate: { opacity: 1, scale: 1,    filter: 'blur(0px)', y: 0,
    transition: { duration: 0.4, ease: EASE } },
  exit:    { opacity: 0, scale: 1.01, filter: 'blur(3px)', y: -8,
    transition: { duration: 0.22, ease: EASE } },
}

// Feature panel variants — one panel, content swaps in place
const PANEL_V = {
  initial: { opacity: 0, y: 32,  scale: 0.97, filter: 'blur(10px)' },
  animate: { opacity: 1, y: 0,   scale: 1,    filter: 'blur(0px)',
    transition: { duration: 0.55, ease: EASE } },
  exit:    { opacity: 0, y: -20, scale: 0.98, filter: 'blur(6px)',
    transition: { duration: 0.3,  ease: EASE } },
}

// ─── chapter data ─────────────────────────────────────────────────────────────
const CHAPTERS = [
  {
    badge: 'Organizations',        Icon: Building2,   color: '#22d3ee',
    title: 'Manage Unlimited\nOrganizations',
    desc:  'Create universities, institutes, corporate clients, and departments with complete tenant isolation and role-based access control.',
    bullets: [
      { Icon: Building2,   text: 'Unlimited tenants with full data isolation'  },
      { Icon: Users,       text: 'Department hierarchy and role management'     },
      { Icon: Shield,      text: 'Per-organization security and billing'        },
    ],
    cta: 'Explore Organizations →',
  },
  {
    badge: 'Exam Builder',         Icon: FileText,    color: '#3b82f6',
    title: 'Build Powerful\nOnline Exams',
    desc:  'Create rich question banks with MCQs and descriptive questions. Set durations, passing scores, and scheduling in minutes.',
    bullets: [
      { Icon: FileText,    text: 'Rich MCQ and descriptive question builder'   },
      { Icon: Clock,       text: 'Custom duration, scoring, and scheduling'    },
      { Icon: Shield,      text: 'Tab detection and session locks built in'    },
    ],
    cta: 'Explore Exam Builder →',
  },
  {
    badge: 'Vouchers',             Icon: Tag,         color: '#8b5cf6',
    title: 'Instant Voucher\nGeneration',
    desc:  'Generate batch vouchers, assign to candidates instantly, set expiry, and track redemption in real time across all organizations.',
    bullets: [
      { Icon: Tag,         text: 'Batch generate 1 to 10,000 vouchers'        },
      { Icon: CheckCircle, text: 'One-click assignment to candidates'          },
      { Icon: BarChart2,   text: 'Live redemption tracking and reporting'      },
    ],
    cta: 'Explore Vouchers →',
  },
  {
    badge: 'Candidate Experience', Icon: Users,       color: '#10b981',
    title: 'Premium Candidate\nExperience',
    desc:  'Candidates get a distraction-free, secure exam environment with real-time progress, countdown timer, and instant result notification.',
    bullets: [
      { Icon: Users,       text: 'Clean, distraction-free exam interface'      },
      { Icon: Clock,       text: 'Real-time countdown with auto-submission'    },
      { Icon: Award,       text: 'Instant results and certificate download'    },
    ],
    cta: 'Explore Candidate Portal →',
  },
  {
    badge: 'Live Monitoring',      Icon: Eye,         color: '#f43f5e',
    title: 'Real-Time Live\nProctoring',
    desc:  'Monitor all active candidates with live session status, fullscreen detection, tab-switch alerts, and automated warning systems.',
    bullets: [
      { Icon: Eye,           text: 'Live candidate session status grid'          },
      { Icon: AlertTriangle, text: 'Automated warnings for suspicious activity'  },
      { Icon: Shield,        text: 'Session replay and full audit logs'          },
    ],
    cta: 'Explore Live Monitoring →',
  },
  {
    badge: 'Analytics',            Icon: BarChart2,   color: '#f97316',
    title: 'Deep Analytics\nand Reporting',
    desc:  'Understand performance trends, department pass rates, and candidate analytics with rich visualizations updated in real time.',
    bullets: [
      { Icon: BarChart2,   text: 'Pass rates, scores, and attempt trends'      },
      { Icon: TrendingUp,  text: 'Department and organization benchmarks'      },
      { Icon: Download,    text: 'Export reports as PDF or CSV instantly'      },
    ],
    cta: 'Explore Analytics →',
  },
  {
    badge: 'Certificates',         Icon: Award,       color: '#f59e0b',
    title: 'Auto-Issue Digital\nCertificates',
    desc:  'Certificates generate automatically on exam completion. Each includes a unique QR code and tamper-proof public verification URL.',
    bullets: [
      { Icon: Award,       text: 'Auto-generated on exam completion'           },
      { Icon: CheckCircle, text: 'QR-code verified and tamper-proof'          },
      { Icon: Globe,       text: 'Public verification URL per certificate'     },
    ],
    cta: 'Explore Certificates →',
  },
  {
    badge: 'Public Verification',  Icon: Globe,       color: '#10b981',
    title: 'Public Certificate\nVerification',
    desc:  'Anyone can verify certificate authenticity instantly via a public URL. No login required. Proof of achievement, worldwide.',
    bullets: [
      { Icon: Globe,       text: 'Public URL — no login needed'               },
      { Icon: CheckCircle, text: 'Instant result in under 200ms'              },
      { Icon: Shield,      text: 'Tamper detection and audit trail'           },
    ],
    cta: 'Explore Verification →',
  },
]

const SIDEBAR_NAV = [
  { label: 'Organizations', Icon: Building2 },
  { label: 'Exam Builder',  Icon: FileText  },
  { label: 'Vouchers',      Icon: Tag       },
  { label: 'Candidates',    Icon: Users     },
  { label: 'Monitoring',    Icon: Eye       },
  { label: 'Analytics',     Icon: BarChart2 },
  { label: 'Certificates',  Icon: Award     },
  { label: 'Verification',  Icon: Globe     },
]

const NOTIFS = [
  { text: 'Exam Completed',     sub: '94% score achieved',  Icon: CheckCircle, color: '#10b981' },
  { text: 'Certificate Issued', sub: 'Ahmed Al-Rashid',     Icon: Award,       color: '#f59e0b' },
  { text: 'Voucher Generated',  sub: 'Batch of 50 codes',   Icon: Tag,         color: '#8b5cf6' },
  { text: 'New Organization',   sub: 'TechCorp Inc. added', Icon: Building2,   color: '#22d3ee' },
  { text: 'Candidate Joined',   sub: 'React Cert Exam',     Icon: Users,       color: '#3b82f6' },
]

// ─── Dashboard Screen 1: Organizations ────────────────────────────────────────
function OrgScreen() {
  const ORGS = [
    { name: 'TechCorp Inc.',     dept: '8 departments',  cands: 482,  color: '#22d3ee' },
    { name: 'UniLearn Academy',  dept: '12 departments', cands: 1203, color: '#3b82f6' },
    { name: 'SecureFinance Ltd', dept: '5 departments',  cands: 231,  color: '#8b5cf6' },
  ]
  return (
    <motion.div {...SC} className="h-full flex flex-col gap-3 p-4">
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <Search className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.3)' }} />
        <span className="text-xs flex-1" style={{ color: 'rgba(255,255,255,0.28)' }}>Search organizations…</span>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(34,211,238,0.14)', color: '#22d3ee' }}>+ New</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[['3', 'Orgs'], ['23', 'Depts'], ['1,916', 'Users']].map(([v, l], i) => (
          <div key={i} className="rounded-xl p-2.5 text-center"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="text-sm font-bold text-white">{v}</div>
            <div className="text-[9px] mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>{l}</div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2 flex-1">
        {ORGS.map((o, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, duration: 0.35 }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${o.color}20` }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0"
              style={{ background: `${o.color}18`, color: o.color }}>{o.name[0]}</div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-semibold text-white truncate">{o.name}</div>
              <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>{o.dept}</div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-[12px] font-bold text-white">{o.cands}</div>
              <div className="text-[9px]" style={{ color: 'rgba(255,255,255,0.25)' }}>users</div>
            </div>
            <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
              style={{ background: 'rgba(34,197,94,0.12)', color: '#22c55e' }}>Active</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// ─── Dashboard Screen 2: Exam Builder ─────────────────────────────────────────
function ExamScreen() {
  const OPTS = [
    'Amazon Elastic Compute Cloud',
    'Amazon Simple Storage Service',
    'AWS Lambda Functions',
    'Amazon CloudFront CDN',
  ]
  return (
    <motion.div {...SC} className="h-full flex flex-col gap-3 p-4">
      <div className="rounded-xl p-3"
        style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>
        <div className="text-[13px] font-bold text-white mb-2">AWS Cloud Practitioner</div>
        <div className="flex gap-5">
          {[['40', 'Questions'], ['90', 'Minutes'], ['70%', 'Pass Score']].map(([v, l], i) => (
            <div key={i} className="text-center">
              <div className="text-sm font-bold" style={{ color: '#3b82f6' }}>{v}</div>
              <div className="text-[9px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="text-[10px] font-semibold uppercase tracking-wide"
        style={{ color: 'rgba(255,255,255,0.35)' }}>Q1 of 40 — Multiple Choice</div>
      <div className="text-[12px] font-medium text-white leading-relaxed">
        Which AWS service provides resizable compute capacity in the cloud?
      </div>
      <div className="flex flex-col gap-2 flex-1">
        {OPTS.map((opt, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.08, duration: 0.3 }}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl"
            style={{
              background: i === 0 ? 'rgba(59,130,246,0.12)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${i === 0 ? 'rgba(59,130,246,0.4)' : 'rgba(255,255,255,0.06)'}`,
            }}>
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
              style={{
                background: i === 0 ? 'rgba(59,130,246,0.25)' : 'transparent',
                border: `1px solid ${i === 0 ? '#3b82f6' : 'rgba(255,255,255,0.18)'}`,
                color: i === 0 ? '#3b82f6' : 'rgba(255,255,255,0.4)',
              }}>
              {['A', 'B', 'C', 'D'][i]}
            </div>
            <span className="text-[11px]"
              style={{ color: i === 0 ? '#93c5fd' : 'rgba(255,255,255,0.5)' }}>{opt}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// ─── Dashboard Screen 3: Vouchers ─────────────────────────────────────────────
function VoucherScreen() {
  const CODES  = ['CERT-4X9K-7MQ2', 'CERT-3BN7-LPR8', 'CERT-9WQ1-4TK5',
                  'CERT-2ZP6-8FH3',  'CERT-7MK4-2QN9',  'CERT-5VL8-3XW1']
  const STATUS = ['Active', 'Active', 'Used', 'Active', 'Expired', 'Active']
  const ST = {
    Active:  { color: '#22c55e', bg: 'rgba(34,197,94,0.1)'   },
    Used:    { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)' },
    Expired: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)'   },
  }
  return (
    <motion.div {...SC} className="h-full flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-bold text-white">Voucher Batch</div>
          <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>React Dev Cert — 50 codes</div>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-medium cursor-pointer"
            style={{ background: 'rgba(139,92,246,0.12)', color: '#8b5cf6', border: '1px solid rgba(139,92,246,0.2)' }}>
            <Download className="w-3 h-3" /> Export
          </div>
          <div className="px-2.5 py-1.5 rounded-lg text-[10px] font-semibold cursor-pointer"
            style={{ background: 'rgba(139,92,246,0.9)', color: 'white' }}>+ Generate</div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {[['46', 'Active'], ['3', 'Used'], ['1', 'Expired']].map(([v, l], i) => (
          <div key={i} className="rounded-xl p-2 text-center"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="text-sm font-bold text-white">{v}</div>
            <div className="text-[9px]" style={{ color: 'rgba(255,255,255,0.3)' }}>{l}</div>
          </div>
        ))}
      </div>
      <div className="flex-1 grid grid-cols-2 gap-1.5 content-start">
        {CODES.map((code, i) => {
          const st = ST[STATUS[i]]
          return (
            <motion.div key={i}
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.07, duration: 0.3 }}
              className="flex items-center justify-between px-2.5 py-2 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div>
                <div className="text-[10px] font-mono font-bold text-white">{code}</div>
                <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
                  style={{ color: st.color, background: st.bg }}>{STATUS[i]}</span>
              </div>
              <Copy className="w-3 h-3 opacity-25 cursor-pointer" />
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

// ─── Dashboard Screen 4: Candidate Experience ─────────────────────────────────
function CandidateScreen() {
  const OPTS = [
    'Amazon Elastic Compute Cloud',
    'Amazon Simple Storage Service',
    'AWS Lambda Functions',
    'Amazon CloudFront CDN',
  ]
  return (
    <motion.div {...SC} className="h-full flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between px-3 py-2.5 rounded-xl"
        style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
        <div>
          <div className="text-[12px] font-bold text-white">AWS Cloud Practitioner</div>
          <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>Question 18 of 40</div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
          style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <Clock className="w-3.5 h-3.5" style={{ color: '#ef4444' }} />
          <span className="text-sm font-bold font-mono" style={{ color: '#ef4444' }}>41:22</span>
        </div>
      </div>
      <div>
        <div className="flex justify-between text-[10px] mb-1.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
          <span>Progress</span><span>45%</span>
        </div>
        <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <motion.div className="h-full rounded-full"
            style={{ background: 'linear-gradient(to right,#10b981,#22d3ee)' }}
            initial={{ width: 0 }} animate={{ width: '45%' }}
            transition={{ duration: 0.9, delay: 0.3 }} />
        </div>
      </div>
      <div className="text-[12px] font-medium text-white leading-relaxed">
        Which AWS service is best described as "Elastic Compute Cloud"?
      </div>
      <div className="flex flex-col gap-2 flex-1">
        {OPTS.map((opt, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl"
            style={{
              background: i === 0 ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${i === 0 ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.07)'}`,
            }}>
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
              style={{
                background: i === 0 ? 'rgba(16,185,129,0.25)' : 'transparent',
                border: `1px solid ${i === 0 ? '#10b981' : 'rgba(255,255,255,0.18)'}`,
                color: i === 0 ? '#10b981' : 'rgba(255,255,255,0.4)',
              }}>
              {['A', 'B', 'C', 'D'][i]}
            </div>
            <span className="text-[11px]"
              style={{ color: i === 0 ? '#6ee7b7' : 'rgba(255,255,255,0.5)' }}>{opt}</span>
          </motion.div>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px]"
          style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.45)' }}>
          <ChevronLeft className="w-3.5 h-3.5" /> Prev
        </div>
        <div className="flex gap-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="w-4 h-1 rounded-full"
              style={{ background: i < 4 ? 'rgba(16,185,129,0.7)' : 'rgba(255,255,255,0.12)' }} />
          ))}
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px]"
          style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981' }}>
          Next <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </motion.div>
  )
}

// ─── Dashboard Screen 5: Live Monitoring ──────────────────────────────────────
function MonitoringScreen() {
  const CANDS = [
    { name: 'Sara M.',  exam: 'AWS CPP',   prog: 72, warn: false },
    { name: 'James R.', exam: 'ISO 27001', prog: 45, warn: true  },
    { name: 'Priya K.', exam: 'React Dev', prog: 88, warn: false },
    { name: 'Ali H.',   exam: 'AWS CPP',   prog: 31, warn: false },
    { name: 'Chen W.',  exam: 'ISO 27001', prog: 60, warn: true  },
    { name: 'Maria L.', exam: 'React Dev', prog: 95, warn: false },
  ]
  return (
    <motion.div {...SC} className="h-full flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-bold text-white">Live Session</div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <motion.div className="w-1.5 h-1.5 rounded-full" style={{ background: '#ef4444' }}
              animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1, repeat: Infinity }} />
            <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.38)' }}>6 active candidates</span>
          </div>
        </div>
        <div className="px-2.5 py-1 rounded-lg text-[10px] font-medium"
          style={{ background: 'rgba(244,63,94,0.1)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.2)' }}>
          2 warnings
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 flex-1">
        {CANDS.map((c, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, scale: 0.93 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08, duration: 0.35 }}
            className="rounded-xl p-2.5"
            style={{
              background: c.warn ? 'rgba(244,63,94,0.07)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${c.warn ? 'rgba(244,63,94,0.25)' : 'rgba(255,255,255,0.07)'}`,
            }}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                  style={{
                    background: c.warn ? 'rgba(244,63,94,0.2)' : 'rgba(255,255,255,0.1)',
                    color: c.warn ? '#f43f5e' : 'rgba(255,255,255,0.7)',
                  }}>
                  {c.name.split(' ').map(w => w[0]).join('')}
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-white leading-none">{c.name}</div>
                  <div className="text-[9px]" style={{ color: 'rgba(255,255,255,0.28)' }}>{c.exam}</div>
                </div>
              </div>
              {c.warn
                ? <AlertTriangle className="w-3 h-3 flex-shrink-0" style={{ color: '#f43f5e' }} />
                : <motion.div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#22c55e' }}
                    animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />
              }
            </div>
            <div className="h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <motion.div className="h-full rounded-full"
                style={{ background: c.warn ? '#f43f5e' : '#22c55e' }}
                initial={{ width: 0 }} animate={{ width: `${c.prog}%` }}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.05 }} />
            </div>
            <div className="text-[9px] mt-1 text-right" style={{ color: 'rgba(255,255,255,0.28)' }}>{c.prog}%</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// ─── Dashboard Screen 6: Analytics ────────────────────────────────────────────
function AnalyticsScreen() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true })
  const BARS   = [62, 80, 55, 90, 72, 84, 95]
  const DEPTS  = [
    { name: 'Engineering', pass: 94, color: '#22d3ee' },
    { name: 'Finance',     pass: 78, color: '#3b82f6' },
    { name: 'HR',          pass: 88, color: '#8b5cf6' },
    { name: 'Operations',  pass: 71, color: '#f97316' },
  ]
  return (
    <motion.div ref={ref} {...SC} className="h-full flex flex-col gap-3 p-4">
      <div className="grid grid-cols-3 gap-2">
        {[['94%', 'Avg Pass', '#10b981'], ['2,847', 'Candidates', '#22d3ee'], ['1,203', 'Certs', '#f59e0b']].map(([v, l, c], i) => (
          <div key={i} className="rounded-xl p-2.5 text-center"
            style={{ background: `${c}08`, border: `1px solid ${c}20` }}>
            <div className="text-sm font-bold" style={{ color: c }}>{v}</div>
            <div className="text-[9px] mt-0.5" style={{ color: 'rgba(255,255,255,0.32)' }}>{l}</div>
          </div>
        ))}
      </div>
      <div className="rounded-xl p-3"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-end gap-1.5" style={{ height: 48 }}>
          {BARS.map((h, i) => (
            <div key={i} className="flex-1">
              <motion.div className="w-full rounded-t-sm"
                style={{ background: 'linear-gradient(to top,#f97316,#fb923c)', opacity: 0.9 }}
                initial={{ height: 0 }}
                animate={inView ? { height: `${(h / 100) * 48}px` } : { height: 0 }}
                transition={{ duration: 0.65, delay: 0.4 + i * 0.07 }} />
            </div>
          ))}
        </div>
        <div className="text-[9px] text-center mt-1.5" style={{ color: 'rgba(255,255,255,0.22)' }}>
          Pass rate — last 7 days
        </div>
      </div>
      <div className="flex flex-col gap-2 flex-1">
        <div className="text-[10px] font-semibold" style={{ color: 'rgba(255,255,255,0.38)' }}>By Department</div>
        {DEPTS.map((d, i) => (
          <div key={i}>
            <div className="flex justify-between text-[10px] mb-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
              <span>{d.name}</span>
              <span style={{ color: d.color }}>{d.pass}%</span>
            </div>
            <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }}>
              <motion.div className="h-full rounded-full" style={{ background: d.color }}
                initial={{ width: 0 }}
                animate={inView ? { width: `${d.pass}%` } : { width: 0 }}
                transition={{ duration: 0.7, delay: 0.5 + i * 0.1 }} />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

// ─── Dashboard Screen 7: Certificates ─────────────────────────────────────────
const QR_PATTERN = [1,0,1,1,0, 0,1,0,1,0, 1,1,1,0,1, 0,0,1,0,1, 1,0,1,1,0]

function CertificateScreen() {
  return (
    <motion.div {...SC} className="h-full flex flex-col gap-3 p-4">
      <div className="text-sm font-bold text-white">Certificate Generator</div>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="flex-1 rounded-2xl p-5 flex flex-col relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg,rgba(15,23,42,0.95),rgba(30,27,75,0.95))',
          border: '1px solid rgba(245,158,11,0.35)',
          boxShadow: '0 0 40px rgba(245,158,11,0.07)',
        }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-amber-400 to-yellow-500" />
            <span className="text-[11px] font-bold text-white">CertiByt</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(34,197,94,0.12)', color: '#22c55e' }}>
            <CheckCircle className="w-3 h-3" /> Verified
          </div>
        </div>
        <div className="text-center flex-1 flex flex-col justify-center">
          <div className="text-[10px] mb-1.5" style={{ color: 'rgba(255,255,255,0.38)' }}>This certifies that</div>
          <div className="text-[17px] font-extrabold text-white mb-1">Ahmed Al-Rashid</div>
          <div className="text-[10px] mb-2.5" style={{ color: 'rgba(255,255,255,0.4)' }}>has successfully completed</div>
          <div className="text-[13px] font-bold mb-3" style={{ color: '#f59e0b' }}>AWS Cloud Practitioner</div>
          <div className="flex justify-center gap-4 text-[10px]" style={{ color: 'rgba(255,255,255,0.45)' }}>
            <span>Score: <strong className="text-white">94%</strong></span>
            <span>Grade: <strong style={{ color: '#f59e0b' }}>Distinction</strong></span>
          </div>
        </div>
        <div className="flex items-end justify-between mt-3">
          <div className="text-[9px]" style={{ color: 'rgba(255,255,255,0.28)' }}>
            Issued: Jan 15, 2025<br />ID: CERT-4X9K-7MQ2
          </div>
          <div className="grid grid-cols-5 gap-0.5">
            {QR_PATTERN.map((on, i) => (
              <div key={i} className="w-2 h-2 rounded-[1px]"
                style={{ background: on ? 'rgba(245,158,11,0.85)' : 'transparent' }} />
            ))}
          </div>
        </div>
        <div aria-hidden="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none font-black tracking-widest rotate-[-30deg] whitespace-nowrap"
          style={{ fontSize: 36, color: 'white', opacity: 0.025 }}>CERTIFIED</div>
      </motion.div>
      <div className="flex gap-2">
        {[['Download PDF', Download, 'rgba(245,158,11,0.12)', '#f59e0b'],
          ['Share Link',   Globe,    'rgba(255,255,255,0.06)', 'rgba(255,255,255,0.45)']].map(([l, I, bg, c], i) => (
          <div key={i} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-medium cursor-pointer"
            style={{ background: bg, color: c }}>
            <I className="w-3.5 h-3.5" />{l}
          </div>
        ))}
      </div>
    </motion.div>
  )
}

// ─── Dashboard Screen 8: Verification ─────────────────────────────────────────
function VerificationScreen() {
  return (
    <motion.div {...SC} className="h-full flex flex-col gap-4 p-4">
      <div className="text-center">
        <div className="text-sm font-bold text-white mb-1">Certificate Verification</div>
        <div className="text-[11px]" style={{ color: 'rgba(255,255,255,0.32)' }}>
          Verify any CertiByt certificate instantly
        </div>
      </div>
      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}>
          <Search className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.3)' }} />
          <span className="text-[11px] font-mono" style={{ color: 'rgba(255,255,255,0.5)' }}>CERT-4X9K-7MQ2</span>
        </div>
        <div className="px-3 rounded-xl text-[11px] font-semibold flex items-center cursor-pointer"
          style={{ background: 'rgba(16,185,129,0.9)', color: 'white' }}>Verify</div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="flex-1 rounded-2xl p-4 relative overflow-hidden"
        style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.3)' }}>
        <div className="flex items-center gap-3 mb-4">
          <motion.div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(34,197,94,0.15)', border: '2px solid #22c55e' }}
            animate={{
              boxShadow: ['0 0 0 rgba(34,197,94,0)', '0 0 20px rgba(34,197,94,0.35)', '0 0 0 rgba(34,197,94,0)'],
            }}
            transition={{ duration: 2, repeat: Infinity }}>
            <CheckCircle className="w-5 h-5" style={{ color: '#22c55e' }} />
          </motion.div>
          <div>
            <div className="text-[13px] font-bold" style={{ color: '#22c55e' }}>Certificate Valid</div>
            <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.32)' }}>Verified in 84ms</div>
          </div>
        </div>
        {[['Candidate', 'Ahmed Al-Rashid'], ['Exam', 'AWS Cloud Practitioner'],
          ['Score', '94% — Distinction'], ['Issued', 'January 15, 2025'],
          ['Issuer', 'CertiByt Platform']].map(([k, v], i) => (
          <div key={i} className="flex items-center justify-between text-[11px] py-1"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ color: 'rgba(255,255,255,0.35)' }}>{k}</span>
            <span className="font-medium text-white">{v}</span>
          </div>
        ))}
        <div aria-hidden="true"
          className="absolute top-3 right-3 text-[9px] font-black px-2 py-0.5 rounded tracking-widest rotate-12 opacity-50"
          style={{ color: '#22c55e', border: '1px solid rgba(34,197,94,0.35)' }}>VERIFIED</div>
      </motion.div>
    </motion.div>
  )
}

const SCREENS = [
  OrgScreen, ExamScreen, VoucherScreen, CandidateScreen,
  MonitoringScreen, AnalyticsScreen, CertificateScreen, VerificationScreen,
]

// ─── Dashboard shell (never replaced, only internal screen swaps) ──────────────
function DashboardShell({ activeChapter }) {
  const ch     = CHAPTERS[activeChapter]
  const Screen = SCREENS[activeChapter]
  return (
    <div className="w-full h-full flex items-center justify-center px-4 py-4 relative">
      {/* Ambient color glow — transitions with chapter */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 70% 60% at 35% 50%,${ch.color}0d,transparent 70%)`,
          transition: 'background 0.6s ease',
        }} />

      <div className="w-full relative" style={{ maxWidth: 460 }}>
        {/* Aura under frame */}
        <div className="absolute -inset-5 rounded-[40px] blur-2xl pointer-events-none"
          style={{
            background: `linear-gradient(135deg,${ch.color}12,rgba(139,92,246,0.07))`,
            transition: 'background 0.6s ease',
          }} />

        {/* Dashboard frame */}
        <div className="relative rounded-3xl overflow-hidden"
          style={{
            background: 'rgba(5,9,20,0.97)',
            border: `1px solid ${ch.color}28`,
            boxShadow: `0 32px 80px rgba(0,0,0,0.55),0 0 50px ${ch.color}0d`,
            transition: 'border-color 0.5s ease, box-shadow 0.5s ease',
          }}>
          {/* Browser chrome */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]"
            style={{ background: 'rgba(10,14,30,0.95)' }}>
            <div className="flex gap-1.5">
              {['#ef4444', '#f59e0b', '#22c55e'].map((c, i) => (
                <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: c, opacity: 0.8 }} />
              ))}
            </div>
            <div className="flex-1 mx-3 flex items-center gap-2 px-3 py-1 rounded-lg text-[10px]"
              style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.25)' }}>
              <div className="w-2 h-2 rounded-full border border-white/20 flex-shrink-0" />
              <span className="truncate">
                app.certibyt.com/{ch.badge.toLowerCase().replace(/\s+/g, '-')}
              </span>
            </div>
            <div className="flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.22)' }}>
              <Bell className="w-3.5 h-3.5" />
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500" />
            </div>
          </div>

          {/* App body: sidebar + content */}
          <div className="flex" style={{ height: 380 }}>
            {/* Sidebar — highlights animate via CSS transition, NO re-mount */}
            <div className="w-36 flex-shrink-0 flex flex-col p-2.5 border-r border-white/[0.05]"
              style={{ background: 'rgba(5,9,20,0.96)' }}>
              <div className="flex items-center gap-1.5 px-2.5 py-2.5 mb-2">
                <div className="w-5 h-5 rounded-md bg-gradient-to-br from-cyan-400 to-violet-500 flex-shrink-0" />
                <span className="text-xs font-bold text-white">CertiByt</span>
              </div>
              {SIDEBAR_NAV.map((item, i) => (
                <div key={i}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg mb-0.5"
                  style={{
                    background:    i === activeChapter ? `${CHAPTERS[i].color}10` : 'transparent',
                    borderLeft:    `2px solid ${i === activeChapter ? CHAPTERS[i].color : 'transparent'}`,
                    transition:    'background 0.35s ease, border-color 0.35s ease',
                  }}>
                  <item.Icon style={{
                    width: 11, height: 11,
                    color: i === activeChapter ? CHAPTERS[i].color : 'rgba(255,255,255,0.28)',
                    transition: 'color 0.35s ease',
                    flexShrink: 0,
                  }} />
                  <span className="text-[11px]"
                    style={{
                      color:      i === activeChapter ? CHAPTERS[i].color : 'rgba(255,255,255,0.3)',
                      fontWeight: i === activeChapter ? 600 : 400,
                      transition: 'color 0.35s ease, font-weight 0.35s ease',
                    }}>
                    {item.label}
                  </span>
                  {i === activeChapter && (
                    <motion.div className="w-1 h-1 rounded-full ml-auto"
                      style={{ background: CHAPTERS[i].color }}
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      key={`dot-${i}`} transition={{ duration: 0.2 }} />
                  )}
                </div>
              ))}
            </div>

            {/* Main content: only the screen swaps via AnimatePresence */}
            <div className="flex-1 min-w-0 overflow-hidden">
              <AnimatePresence mode="wait">
                <Screen key={`screen-${activeChapter}`} />
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Floating Notification ─────────────────────────────────────────────────────
function FloatingNotification({ isDark, reduced }) {
  const [idx,     setIdx]     = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (reduced) return
    const timer = setInterval(() => {
      setVisible(false)
      const t = setTimeout(() => {
        setIdx(i => (i + 1) % NOTIFS.length)
        setVisible(true)
      }, 450)
      return () => clearTimeout(t)
    }, 3800)
    return () => clearInterval(timer)
  }, [reduced])

  const n   = NOTIFS[idx]
  const bg  = isDark ? 'rgba(8,12,28,0.95)' : 'rgba(255,255,255,0.97)'
  const txt = isDark ? '#f1f5f9'            : '#0f172a'

  return (
    <div className="absolute bottom-8 left-6 z-30">
      <AnimatePresence mode="wait">
        {visible && (
          <motion.div key={idx}
            initial={{ opacity: 0, x: -16, scale: 0.88 }}
            animate={{ opacity: 1,  x: 0,   scale: 1    }}
            exit={{    opacity: 0,  x: 14,  scale: 0.92  }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl"
            style={{
              background:     bg,
              border:         `1px solid ${n.color}25`,
              backdropFilter: 'blur(20px)',
              boxShadow:      `0 8px 24px rgba(0,0,0,0.35),0 0 16px ${n.color}14`,
              whiteSpace:     'nowrap',
            }}>
            <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${n.color}18`, border: `1px solid ${n.color}28` }}>
              <n.Icon style={{ width: 12, height: 12, color: n.color }} />
            </div>
            <div>
              <div className="text-[11px] font-semibold leading-tight" style={{ color: txt }}>{n.text}</div>
              <div className="text-[10px] leading-tight mt-0.5" style={{ color: 'rgba(148,163,184,0.7)' }}>{n.sub}</div>
            </div>
            <motion.div className="w-1.5 h-1.5 rounded-full ml-1 flex-shrink-0"
              style={{ background: n.color }}
              animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Progress Timeline (fixed inside pinned section) ──────────────────────────
function ProgressTimeline({ activeChapter }) {
  return (
    <div className="flex flex-col items-center justify-center gap-0 py-6 flex-shrink-0"
      style={{ width: 48 }}>
      {CHAPTERS.map((ch, i) => (
        <div key={i} className="flex flex-col items-center">
          {i > 0 && (
            <motion.div
              style={{ width: 1, height: 30, flexShrink: 0 }}
              animate={{
                background: i <= activeChapter
                  ? `linear-gradient(to bottom,${CHAPTERS[i - 1].color},${ch.color})`
                  : 'rgba(255,255,255,0.1)',
              }}
              transition={{ duration: 0.4 }}
            />
          )}
          <motion.div
            className="flex items-center justify-center text-[10px] font-bold"
            style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid', flexShrink: 0 }}
            animate={{
              background:  i === activeChapter ? `${ch.color}22` : i < activeChapter ? `${ch.color}12` : 'rgba(255,255,255,0.04)',
              borderColor: i <= activeChapter  ? ch.color          : 'rgba(255,255,255,0.1)',
              color:       i <= activeChapter  ? ch.color          : 'rgba(255,255,255,0.22)',
              boxShadow:   i === activeChapter ? `0 0 14px ${ch.color}45` : 'none',
              scale:       i === activeChapter ? 1.18 : 1,
            }}
            transition={{ duration: 0.35 }}
          >
            {i < activeChapter
              ? <CheckCircle style={{ width: 12, height: 12 }} />
              : i + 1
            }
          </motion.div>
        </div>
      ))}
    </div>
  )
}

// ─── Single animated feature panel (only one mounted at a time) ───────────────
function FeaturePanel({ chapter }) {
  const { badge, Icon, title, desc, bullets, cta, color } = chapter
  return (
    <motion.div
      variants={PANEL_V}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col max-w-md"
    >
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-5 self-start"
        style={{ background: `${color}12`, border: `1px solid ${color}28`, color }}>
        <Icon className="w-3 h-3" aria-hidden="true" />
        {badge}
      </div>

      {/* Heading */}
      <h3 className="text-3xl lg:text-[36px] font-extrabold text-white leading-[1.1] tracking-tight mb-4">
        {title.split('\n').map((line, i) => <span key={i} className="block">{line}</span>)}
      </h3>

      {/* Description */}
      <p className="text-[15px] leading-relaxed mb-7" style={{ color: cv(400) }}>{desc}</p>

      {/* Bullets */}
      <div className="flex flex-col gap-3.5 mb-8">
        {bullets.map((b, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 + i * 0.1, duration: 0.4, ease: EASE }}
            className="flex items-start gap-3"
          >
            <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: `${color}12`, border: `1px solid ${color}22` }}>
              <b.Icon style={{ width: 13, height: 13, color }} />
            </div>
            <span className="text-[14px] leading-relaxed" style={{ color: cv(300) }}>{b.text}</span>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55, duration: 0.4 }}
        whileHover={{ x: 6 }}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold cursor-pointer self-start"
        style={{ background: `${color}14`, border: `1px solid ${color}30`, color }}
      >
        {cta}
      </motion.div>
    </motion.div>
  )
}

// ─── Animated background ──────────────────────────────────────────────────────
function AnimBackground({ isDark }) {
  const gc = isDark ? 'rgba(201,168,76,0.016)' : 'rgba(201,168,76,0.028)'
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0" style={{
        backgroundImage: `linear-gradient(${gc} 1px,transparent 1px),linear-gradient(90deg,${gc} 1px,transparent 1px)`,
        backgroundSize: '64px 64px',
      }} />
      <motion.div className="absolute rounded-full blur-3xl"
        animate={{ x: [0, 50, -25, 0], y: [0, -35, 18, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        style={{ width: 700, height: 700, top: '-10%', left: '-8%',
          background: isDark ? 'rgba(201,168,76,0.05)' : 'rgba(201,168,76,0.03)' }} />
      <motion.div className="absolute rounded-full blur-3xl"
        animate={{ x: [0, -40, 20, 0], y: [0, 30, -15, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        style={{ width: 600, height: 600, bottom: '-12%', right: '-5%',
          background: isDark ? 'rgba(175,144,55,0.04)' : 'rgba(175,144,55,0.02)' }} />
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function InteractiveShowcase() {
  const { theme }   = useTheme()
  const isDark      = theme === 'dark'
  const reduced     = useReducedMotion()
  const wrapperRef  = useRef(null)
  const sectionRef  = useRef(null)
  const [currentIdx, setCurrentIdx] = useState(0)

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const mq = window.matchMedia('(min-width: 1024px)')

    const update = () => {
      if (!mq.matches) return
      const { top } = wrapper.getBoundingClientRect()
      const totalScroll = (CHAPTERS.length - 1) * window.innerHeight
      const scrolled = Math.max(0, -top)
      const progress = totalScroll > 0 ? Math.min(1, scrolled / totalScroll) : 0
      const idx = Math.min(Math.floor(progress * CHAPTERS.length), CHAPTERS.length - 1)
      setCurrentIdx(prev => (prev !== idx ? idx : prev))
    }

    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <div ref={wrapperRef} className="relative">
    <section
      ref={sectionRef}
      aria-labelledby="showcase-heading"
      className="relative lg:sticky lg:top-0 lg:h-screen overflow-hidden"
      style={{ background: isDark ? cv(950) : 'rgb(248,250,252)' }}
    >
      <AnimBackground isDark={isDark} />

      {/* Top divider */}
      <div aria-hidden="true" className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px"
        style={{ background: `linear-gradient(to right,transparent,${isDark ? 'rgba(201,168,76,0.2)' : 'rgba(201,168,76,0.14)'},transparent)` }} />

      {/* ── Desktop: GSAP-pinned 3-column layout ────────────────────────────── */}
      <div className="hidden lg:flex flex-col h-full" style={{ position: 'relative', zIndex: 1 }}>
        {/* Compact section header */}
        <div className="text-center px-4 pt-24 pb-4 flex-shrink-0">
          <motion.div
            initial={{ opacity: 0, y: -12, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease: EASE }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-3"
            style={{
              background:     isDark ? 'rgba(201,168,76,0.1)' : 'rgba(201,168,76,0.08)',
              border:         '1px solid rgba(201,168,76,0.3)',
              color:          isDark ? '#E4C36E' : '#9E7E28',
              backdropFilter: 'blur(14px)',
            }}
          >
            <Zap className="w-3.5 h-3.5" aria-hidden="true" />
            Platform Tour
          </motion.div>

          <motion.h2 id="showcase-heading"
            initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.12, ease: EASE }}
            className="text-3xl xl:text-4xl font-extrabold text-white tracking-tight mb-2"
          >
            See CertiByt{' '}
            <span style={{
              background:          'linear-gradient(135deg,#C9A84C,#E4C36E,#AF8E38)',
              WebkitBackgroundClip:'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip:      'text',
            }}>in Action</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.25, ease: EASE }}
            className="text-sm max-w-lg mx-auto"
            style={{ color: cv(400) }}
          >
            Scroll to explore every capability. The dashboard evolves as you read.
          </motion.p>
        </div>

        {/* Three-column body — fills remaining height */}
        <div className="flex flex-1 min-h-0">
          {/* Left: Dashboard + floating notification */}
          <div className="relative flex-shrink-0 h-full" style={{ width: '52%' }}>
            <DashboardShell activeChapter={currentIdx} />
            <FloatingNotification isDark={isDark} reduced={!!reduced} />
          </div>

          {/* Center: Progress timeline */}
          <ProgressTimeline activeChapter={currentIdx} />

          {/* Right: Single feature panel — only one mounted, transitions in place */}
          <div className="flex-1 flex items-center px-8 xl:px-12 min-w-0">
            <AnimatePresence mode="wait">
              <FeaturePanel key={currentIdx} chapter={CHAPTERS[currentIdx]} />
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Mobile: stacked chapters (no pinning) ──────────────────────────── */}
      <div className="lg:hidden relative" style={{ zIndex: 1 }}>
        {/* Mobile header */}
        <div className="text-center px-4 pt-20 pb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4"
            style={{
              background:     isDark ? 'rgba(201,168,76,0.1)' : 'rgba(201,168,76,0.08)',
              border:         '1px solid rgba(201,168,76,0.3)',
              color:          isDark ? '#E4C36E' : '#9E7E28',
              backdropFilter: 'blur(14px)',
            }}>
            <Zap className="w-3.5 h-3.5" /> Platform Tour
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight mb-3">
            See CertiByt{' '}
            <span style={{
              background:          'linear-gradient(135deg,#C9A84C,#E4C36E)',
              WebkitBackgroundClip:'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip:      'text',
            }}>in Action</span>
          </h2>
          <p className="text-sm" style={{ color: cv(400) }}>
            Explore every capability — organization to verification.
          </p>
        </div>

        {/* Stacked feature cards */}
        <div className="px-4 pb-20">
          {CHAPTERS.map((ch, i) => {
            const Screen = SCREENS[i]
            return (
              <div key={i} className="mb-16">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="rounded-2xl overflow-hidden mb-6"
                  style={{
                    background: 'rgba(5,9,20,0.97)',
                    border:     `1px solid ${ch.color}25`,
                    boxShadow:  '0 20px 60px rgba(0,0,0,0.5)',
                    height:     280,
                  }}>
                  <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.06]"
                    style={{ background: 'rgba(10,14,30,0.95)' }}>
                    {['#ef4444', '#f59e0b', '#22c55e'].map((c, j) => (
                      <div key={j} className="w-2 h-2 rounded-full" style={{ background: c, opacity: 0.8 }} />
                    ))}
                    <span className="text-[10px] ml-2" style={{ color: 'rgba(255,255,255,0.25)' }}>
                      CertiByt · {ch.badge}
                    </span>
                  </div>
                  <div style={{ height: 242, overflow: 'hidden' }}>
                    <Screen />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: 0.1, ease: EASE }}
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-4"
                    style={{ background: `${ch.color}12`, border: `1px solid ${ch.color}25`, color: ch.color }}>
                    <ch.Icon className="w-3 h-3" />
                    {ch.badge}
                  </div>
                  <h3 className="text-2xl font-extrabold text-white leading-tight mb-3">
                    {ch.title.split('\n').join(' ')}
                  </h3>
                  <p className="text-sm leading-relaxed mb-5" style={{ color: cv(400) }}>{ch.desc}</p>
                  <div className="flex flex-col gap-3">
                    {ch.bullets.map((b, j) => (
                      <div key={j} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ background: `${ch.color}12`, border: `1px solid ${ch.color}22` }}>
                          <b.Icon style={{ width: 11, height: 11, color: ch.color }} />
                        </div>
                        <span className="text-sm leading-relaxed" style={{ color: cv(300) }}>{b.text}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Bottom divider */}
      <div aria-hidden="true" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px"
        style={{ background: `linear-gradient(to right,transparent,${isDark ? 'rgba(34,211,238,0.18)' : 'rgba(34,211,238,0.1)'},transparent)` }} />
    </section>

    {/* Desktop scroll spacer — creates scroll distance for sticky pinning */}
    <div className="hidden lg:block" style={{ height: `${(CHAPTERS.length - 1) * 100}vh` }} />
    </div>
  )
}
