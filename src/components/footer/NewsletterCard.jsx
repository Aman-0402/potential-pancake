import { useState, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Mail, ArrowRight, CheckCircle, AlertCircle, Loader } from 'lucide-react'

const EASE = [0.25, 0.4, 0.25, 1]
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function NewsletterCard({ isDark }) {
  const [email,   setEmail]   = useState('')
  const [focused, setFocused] = useState(false)
  const [status,  setStatus]  = useState('idle') // idle | loading | success | error
  const reduced = useReducedMotion()
  const inputRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (status === 'success') return
    if (!EMAIL_RE.test(email)) { setStatus('error'); return }

    setStatus('loading')
    // Simulate API call
    setTimeout(() => setStatus('success'), 1400)
  }

  const borderColor = focused
    ? '#3b82f6'
    : isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
  const borderShadow = focused
    ? `0 0 0 3px rgba(59,130,246,0.18), 0 0 20px rgba(59,130,246,0.12)`
    : 'none'

  return (
    <motion.div
      initial={reduced ? {} : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, ease: EASE }}
      className="relative rounded-[24px] overflow-hidden"
      style={{
        background: isDark
          ? 'linear-gradient(135deg, rgba(59,130,246,0.07) 0%, rgba(139,92,246,0.05) 50%, rgba(6,10,24,0.6) 100%)'
          : 'linear-gradient(135deg, rgba(59,130,246,0.05) 0%, rgba(139,92,246,0.04) 50%, rgba(248,250,252,0.9) 100%)',
        border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.07)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: isDark
          ? 'inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 32px rgba(0,0,0,0.2)'
          : 'inset 0 1px 0 rgba(255,255,255,0.9), 0 4px 24px rgba(0,0,0,0.05)',
      }}
    >
      {/* Top glow accent */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.5), rgba(139,92,246,0.5), transparent)' }}
      />

      {/* Ambient glow */}
      <div
        aria-hidden
        className="absolute -top-20 -right-20 pointer-events-none"
        style={{
          width: 240, height: 240,
          background: 'radial-gradient(circle, rgba(59,130,246,0.08), transparent 60%)',
        }}
      />

      <div className="relative px-8 py-8 flex flex-col md:flex-row items-start md:items-center gap-8">
        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <div
              className="flex items-center justify-center rounded-lg"
              style={{
                width: 28, height: 28,
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                boxShadow: '0 2px 8px rgba(59,130,246,0.3)',
              }}
            >
              <Mail className="w-3.5 h-3.5 text-white" strokeWidth={2} />
            </div>
            <h3
              className="text-[15px] font-bold"
              style={{ color: isDark ? 'rgba(255,255,255,0.95)' : 'rgb(15,23,42)' }}
            >
              Stay Updated
            </h3>
          </div>
          <p className="text-[13px]" style={{ color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(15,23,42,0.5)' }}>
            Receive product updates, new features, and security announcements.
          </p>
        </div>

        {/* Form */}
        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="flex items-center gap-3 px-5 py-3.5 rounded-full"
              style={{
                background: 'rgba(16,185,129,0.1)',
                border: '1px solid rgba(16,185,129,0.3)',
              }}
            >
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="text-[13px] font-medium text-emerald-400 whitespace-nowrap">
                You&apos;re subscribed!
              </span>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 w-full md:w-auto"
            >
              {/* Email input wrapper */}
              <div
                className="relative flex items-center flex-1 md:w-64 rounded-full transition-all duration-300"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                  border: `1px solid ${borderColor}`,
                  boxShadow: borderShadow,
                  transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
                }}
              >
                <input
                  ref={inputRef}
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (status === 'error') setStatus('idle') }}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  placeholder="you@company.com"
                  aria-label="Email address for newsletter"
                  aria-describedby="newsletter-status"
                  className="w-full bg-transparent outline-none text-[13px] font-medium px-4 py-2.5"
                  style={{
                    color: isDark ? 'rgba(255,255,255,0.88)' : 'rgb(15,23,42)',
                    caretColor: '#3b82f6',
                  }}
                />
                {/* Error indicator */}
                {status === 'error' && (
                  <AlertCircle className="w-4 h-4 text-rose-400 mr-3 flex-shrink-0" />
                )}
              </div>

              {/* Subscribe button */}
              <motion.button
                type="submit"
                disabled={status === 'loading'}
                aria-label="Subscribe to newsletter"
                className="relative flex items-center gap-1.5 px-5 py-2.5 rounded-full text-[13px] font-semibold text-white flex-shrink-0 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #7c3aed)',
                  boxShadow: '0 2px 16px rgba(59,130,246,0.3)',
                  opacity: status === 'loading' ? 0.85 : 1,
                }}
                whileHover={{ scale: 1.04, y: -1, boxShadow: '0 6px 28px rgba(59,130,246,0.45)' }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 380, damping: 18 }}
              >
                {status === 'loading' ? (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                  >
                    <Loader className="w-3.5 h-3.5" />
                  </motion.span>
                ) : (
                  <>
                    Subscribe
                    <motion.span whileHover={{ x: 2 }} transition={{ duration: 0.15 }}>
                      <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
                    </motion.span>
                  </>
                )}
                {/* Sheen */}
                <motion.span
                  aria-hidden
                  className="absolute inset-0 rounded-full pointer-events-none"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.14) 0%, transparent 60%)' }}
                />
              </motion.button>

              {/* Screen-reader status */}
              <span id="newsletter-status" className="sr-only" aria-live="polite">
                {status === 'error'   && 'Please enter a valid email address.'}
                {status === 'success' && 'Successfully subscribed!'}
              </span>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* Error message */}
      <AnimatePresence>
        {status === 'error' && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="px-8 pb-5 text-[12px] text-rose-400"
          >
            Please enter a valid email address.
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
