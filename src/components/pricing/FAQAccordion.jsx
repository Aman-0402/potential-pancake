import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, MessageCircle } from 'lucide-react'

const EASE = [0.25, 0.4, 0.25, 1]

const FAQS = [
  {
    q: 'How does pricing work?',
    a: 'CertiByt uses a per-organization model. You pay based on the number of organizations and active candidates per month. All plans include the full exam builder, certificate generation, and candidate portal. You can upgrade, downgrade, or cancel at any time.',
  },
  {
    q: 'Can I create unlimited exams?',
    a: 'Yes. All plans include unlimited exam creation. You can build as many exams as you need with MCQ, descriptive, and mixed question types, set durations and passing scores, and schedule them for any date and time.',
  },
  {
    q: 'Can universities customize certificates?',
    a: 'Absolutely. Professional and Enterprise plans include full certificate branding: your logo, institution name, custom colors, digital signatures, and a unique QR code per certificate. Certificates are auto-issued upon exam completion.',
  },
  {
    q: 'Is public certificate verification free?',
    a: 'Yes. Every certificate issued through CertiByt gets a permanent public verification URL. Employers, partners, and institutions can verify any certificate instantly — no login required, no cost, and no expiry.',
  },
  {
    q: 'Do you provide API access?',
    a: 'API access is available on the Enterprise plan. You can integrate CertiByt with your existing LMS, HR system, or custom applications to automate candidate enrollment, exam scheduling, certificate issuance, and result reporting.',
  },
  {
    q: 'Can organizations manage multiple departments?',
    a: 'Yes. CertiByt supports full multi-tenant hierarchy — organizations, departments, sub-departments, and individual candidates. Each level has its own role-based access, reporting, and certificate settings. Ideal for universities with multiple faculties or enterprises with regional offices.',
  },
]

function FAQItem({ faq, idx, isOpen, onToggle, isDark }) {
  const t1  = isDark ? '#f1f5f9' : '#0f172a'
  const t2  = isDark ? 'rgba(148,163,184,0.85)' : 'rgba(71,85,105,0.88)'
  const bg  = isDark ? 'rgba(10,14,30,0.88)' : 'rgba(255,255,255,0.92)'
  const bdr = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'
  const bdrOpen = isDark ? 'rgba(59,130,246,0.22)' : 'rgba(59,130,246,0.18)'

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.05 + idx * 0.07, ease: EASE }}
      className="rounded-3xl overflow-hidden"
      style={{
        background:     bg,
        border:         `1px solid ${isOpen ? bdrOpen : bdr}`,
        backdropFilter: 'blur(20px)',
        boxShadow:      isOpen
          ? (isDark ? '0 8px 32px rgba(0,0,0,0.35), 0 0 24px rgba(59,130,246,0.08)' : '0 8px 32px rgba(0,0,0,0.06)')
          : (isDark ? '0 4px 16px rgba(0,0,0,0.25)' : '0 4px 16px rgba(0,0,0,0.04)'),
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
      }}
    >
      {/* Question row */}
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="text-sm lg:text-base font-semibold" style={{ color: t1 }}>
          {faq.q}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full"
          style={{
            background: isOpen ? 'rgba(59,130,246,0.12)' : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'),
            border: `1px solid ${isOpen ? 'rgba(59,130,246,0.3)' : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)')}`,
            transition: 'background 0.25s ease, border-color 0.25s ease',
          }}
        >
          <ChevronDown style={{ width: 14, height: 14, color: isOpen ? '#3b82f6' : (isDark ? 'rgba(148,163,184,0.7)' : 'rgba(71,85,105,0.7)') }} />
        </motion.div>
      </button>

      {/* Answer */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: EASE }}
            style={{ overflow: 'hidden' }}
          >
            <div className="px-6 pb-5">
              <div className="h-px mb-4"
                style={{ background: isDark ? 'rgba(59,130,246,0.1)' : 'rgba(59,130,246,0.08)' }} />
              <p className="text-sm leading-relaxed" style={{ color: t2 }}>
                {faq.a}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQAccordion({ isDark, inView }) {
  const [openIdx, setOpenIdx] = useState(0)
  const t1 = isDark ? '#f1f5f9' : '#0f172a'
  const t2 = isDark ? 'rgba(148,163,184,0.8)' : 'rgba(71,85,105,0.85)'

  return (
    <div className="mb-28 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: -12, filter: 'blur(6px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.45, ease: EASE }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-5"
          style={{
            background:     isDark ? 'rgba(139,92,246,0.1)' : 'rgba(139,92,246,0.07)',
            border:         '1px solid rgba(139,92,246,0.25)',
            color:          isDark ? '#a78bfa' : '#7c3aed',
            backdropFilter: 'blur(14px)',
          }}
        >
          <MessageCircle className="w-3.5 h-3.5" />
          Common Questions
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
          className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-3"
          style={{ color: t1 }}
        >
          Everything You Need to Know
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.2, ease: EASE }}
          className="text-sm max-w-md mx-auto"
          style={{ color: t2 }}
        >
          Answers to the most common questions from universities, organizations, and enterprises.
        </motion.p>
      </div>

      {/* Accordion */}
      <div className="flex flex-col gap-3">
        {FAQS.map((faq, i) => (
          <FAQItem
            key={i}
            faq={faq}
            idx={i}
            isOpen={openIdx === i}
            onToggle={() => setOpenIdx(openIdx === i ? -1 : i)}
            isDark={isDark}
          />
        ))}
      </div>
    </div>
  )
}
