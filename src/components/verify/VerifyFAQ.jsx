import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { ChevronDown, HelpCircle } from 'lucide-react'

const EASE = [0.25, 0.4, 0.25, 1]

const FAQS = [
  {
    q: 'What is a Certificate ID and where do I find it?',
    a: 'A Certificate ID is a unique alphanumeric code printed on every CertiByt certificate. It follows the format CBT-YYYY-XXXXXXXX. You can find it at the bottom of your certificate PDF, in your CertiByt dashboard, or embedded in the QR code on the certificate.',
  },
  {
    q: 'Is this verification portal available to the public?',
    a: 'Yes. Anyone — employers, clients, academic institutions, or individuals — can verify a CertiByt certificate without creating an account. Simply enter the Certificate ID and get an instant result.',
  },
  {
    q: 'Can a certificate be revoked after it is issued?',
    a: 'Yes. The issuing organization can revoke a certificate if there was fraud, policy violation, or if the credential was issued in error. Revoked certificates are flagged clearly during verification and cannot be reinstated automatically.',
  },
  {
    q: 'How long are certificates valid?',
    a: 'Validity depends on the certificate type set by the issuing organization. Most CertiByt certificates have no expiry by default, but role-specific certifications (e.g., compliance, safety) may include an expiry date. Expired certificates still appear in verification but show their status clearly.',
  },
  {
    q: 'Is my verification query logged or tracked?',
    a: 'Verification lookups are logged only for audit and analytics purposes at an aggregate level. We do not track or store the identities of individuals who verify certificates. Your verification activity is private.',
  },
]

function FAQItem({ item, idx, isOpen, onToggle, isDark }) {
  const t1 = isDark ? '#f1f5f9' : '#0f172a'
  const t2 = isDark ? 'rgba(148,163,184,0.8)' : 'rgba(71,85,105,0.85)'

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, delay: idx * 0.08, ease: EASE }}
      className="rounded-2xl overflow-hidden"
      style={{
        background:     isDark ? 'rgba(10,14,30,0.88)' : 'rgba(255,255,255,0.88)',
        border:         isOpen
          ? '1px solid rgba(59,130,246,0.3)'
          : isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.07)',
        backdropFilter: 'blur(16px)',
        transition:     'border-color 0.25s ease',
      }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="text-sm font-semibold leading-snug" style={{ color: t1 }}>{item.q}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-4 h-4" style={{ color: isOpen ? '#3b82f6' : t2 }} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: EASE }}
            style={{ overflow: 'hidden' }}
          >
            <div className="px-6 pb-5 text-sm leading-relaxed" style={{ color: t2 }}>
              {item.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function VerifyFAQ({ isDark }) {
  const [openIdx, setOpenIdx] = useState(null)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -50px 0px' })

  const t1 = isDark ? '#f1f5f9' : '#0f172a'
  const t2 = isDark ? 'rgba(148,163,184,0.75)' : 'rgba(71,85,105,0.8)'

  return (
    <div ref={ref} className="max-w-2xl mx-auto px-4 mb-24">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.45, ease: EASE }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
          style={{ background: isDark ? 'rgba(59,130,246,0.1)' : 'rgba(59,130,246,0.08)',
            border: '1px solid rgba(59,130,246,0.2)', color: '#3b82f6' }}>
          <HelpCircle className="w-3 h-3" />
          FAQ
        </div>
        <div className="text-2xl font-extrabold mb-2" style={{ color: t1 }}>Common Questions</div>
        <div className="text-sm" style={{ color: t2 }}>Everything you need to know about certificate verification</div>
      </motion.div>

      <div className="space-y-3">
        {FAQS.map((item, i) => (
          <FAQItem
            key={i}
            item={item}
            idx={i}
            isOpen={openIdx === i}
            onToggle={() => setOpenIdx(openIdx === i ? null : i)}
            isDark={isDark}
          />
        ))}
      </div>
    </div>
  )
}
