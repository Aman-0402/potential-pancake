import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Loader2, CheckCircle, XCircle, ArrowRight } from 'lucide-react'

const EASE = [0.25, 0.4, 0.25, 1]

const EXAMPLES = [
  { id: 'CBT-2026-8F92D4A1', label: 'Valid'   },
  { id: 'CBT-2025-3B71E2C9', label: 'Expired' },
  { id: 'CBT-2024-7A43F891', label: 'Revoked' },
]

const STATE_STYLES = {
  idle:      { border: 'rgba(59,130,246,0)',    glow: 'transparent',            icon: null },
  loading:   { border: 'rgba(59,130,246,0.4)',  glow: 'rgba(59,130,246,0.08)',  icon: null },
  valid:     { border: 'rgba(16,185,129,0.5)',  glow: 'rgba(16,185,129,0.07)', icon: 'valid' },
  not_found: { border: 'rgba(239,68,68,0.45)',  glow: 'rgba(239,68,68,0.06)',  icon: 'error' },
  revoked:   { border: 'rgba(245,158,11,0.45)', glow: 'rgba(245,158,11,0.06)', icon: 'warn'  },
  expired:   { border: 'rgba(245,158,11,0.45)', glow: 'rgba(245,158,11,0.06)', icon: 'warn'  },
  error:     { border: 'rgba(239,68,68,0.45)',  glow: 'rgba(239,68,68,0.06)',  icon: 'error' },
}

export default function CertificateSearch({ isDark, status, onVerify }) {
  const [inputVal, setInputVal] = useState('')
  const [focused, setFocused] = useState(false)
  const inputRef = useRef(null)

  const st = STATE_STYLES[status] || STATE_STYLES.idle

  const borderColor = focused
    ? 'rgba(59,130,246,0.55)'
    : (status !== 'idle' ? st.border : (isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.09)'))

  const handleSubmit = (e) => {
    e?.preventDefault()
    const val = inputVal.trim()
    if (!val || status === 'loading') return
    onVerify(val)
  }

  const t1  = isDark ? '#f1f5f9' : '#0f172a'
  const t2  = isDark ? 'rgba(148,163,184,0.7)' : 'rgba(100,116,139,0.75)'
  const t3  = isDark ? 'rgba(148,163,184,0.45)' : 'rgba(148,163,184,0.6)'
  const inputBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'
  const cardBg  = isDark
    ? 'linear-gradient(150deg,rgba(10,14,30,0.95),rgba(5,8,20,0.97))'
    : 'linear-gradient(150deg,rgba(255,255,255,0.96),rgba(248,250,252,0.98))'

  return (
    <div className="max-w-2xl mx-auto px-4 mb-16">
      <motion.div
        initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.6, delay: 1.1, ease: EASE }}
        className="relative rounded-[32px]"
        style={{
          background:     cardBg,
          border:         `1px solid ${borderColor}`,
          boxShadow:      isDark
            ? `0 24px 64px rgba(0,0,0,0.5), 0 0 48px ${st.glow}`
            : `0 24px 64px rgba(0,0,0,0.08), 0 0 32px ${st.glow}`,
          backdropFilter: 'blur(24px)',
          padding:        '32px',
          transition:     'border-color 0.35s ease, box-shadow 0.35s ease',
        }}
      >
        {/* Top accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4"
          style={{ background:'linear-gradient(to right,transparent,rgba(59,130,246,0.35),transparent)' }} />

        <form onSubmit={handleSubmit}>
          {/* Label */}
          <div className="text-sm font-semibold mb-3" style={{ color: t2 }}>
            Enter Certificate ID
          </div>

          {/* Input row */}
          <div className="flex gap-3">
            {/* Input */}
            <div className="relative flex-1">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <Search className="w-4.5 h-4.5" style={{ color: focused ? '#3b82f6' : t3 }} />
              </div>
              <motion.input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="e.g. CBT-2026-8F92D4A1"
                disabled={status === 'loading'}
                animate={status === 'not_found' || status === 'error'
                  ? { x: [0, -8, 8, -6, 6, -3, 3, 0] }
                  : { x: 0 }
                }
                transition={{ duration: 0.45, ease: 'easeInOut' }}
                className="w-full rounded-2xl text-sm font-mono outline-none"
                style={{
                  background:   inputBg,
                  border:       `1px solid ${focused ? 'rgba(59,130,246,0.45)' : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)')}`,
                  padding:      '14px 16px 14px 44px',
                  color:        t1,
                  transition:   'border-color 0.25s ease',
                  boxShadow:    focused ? '0 0 0 3px rgba(59,130,246,0.1)' : 'none',
                }}
              />
            </div>

            {/* Verify button */}
            <motion.button
              type="submit"
              disabled={status === 'loading' || !inputVal.trim()}
              whileHover={status !== 'loading' && inputVal.trim() ? { scale: 1.04, y: -2 } : {}}
              whileTap={status !== 'loading' && inputVal.trim() ? { scale: 0.97 } : {}}
              className="flex items-center gap-2 px-6 rounded-2xl text-sm font-bold text-white flex-shrink-0"
              style={{
                background:  status === 'valid'
                  ? 'linear-gradient(135deg,#10b981,#22d3ee)'
                  : status === 'not_found' || status === 'error'
                  ? 'linear-gradient(135deg,#ef4444,#f97316)'
                  : status === 'revoked' || status === 'expired'
                  ? 'linear-gradient(135deg,#f59e0b,#f97316)'
                  : 'linear-gradient(135deg,#3b82f6,#8b5cf6)',
                boxShadow:   '0 8px 24px rgba(59,130,246,0.3)',
                minWidth:    110,
                height:      48,
                justifyContent: 'center',
                opacity:     (!inputVal.trim() && status === 'idle') ? 0.55 : 1,
                transition:  'background 0.3s ease, opacity 0.2s ease',
              }}
            >
              <AnimatePresence mode="wait">
                {status === 'loading' ? (
                  <motion.span key="loading" className="flex items-center gap-2"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Checking
                  </motion.span>
                ) : status === 'valid' ? (
                  <motion.span key="valid" className="flex items-center gap-2"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <CheckCircle className="w-4 h-4" />
                    Verified
                  </motion.span>
                ) : (status === 'not_found' || status === 'error') ? (
                  <motion.span key="error" className="flex items-center gap-2"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <XCircle className="w-4 h-4" />
                    Try Again
                  </motion.span>
                ) : (
                  <motion.span key="idle" className="flex items-center gap-2"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    Verify
                    <ArrowRight className="w-4 h-4" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </form>

        {/* Example IDs */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="text-xs" style={{ color: t3 }}>Try an example:</span>
          {EXAMPLES.map(ex => (
            <motion.button
              key={ex.id}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => { setInputVal(ex.id); inputRef.current?.focus() }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold"
              style={{
                background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)',
                color: t2,
              }}
            >
              <span className="font-mono text-[10px]">{ex.id}</span>
              <span style={{ color:
                ex.label === 'Valid' ? '#10b981' :
                ex.label === 'Expired' ? '#f59e0b' : '#f43f5e',
                fontSize: 9,
              }}>({ex.label})</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
