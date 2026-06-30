import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldCheck, ShieldX, ShieldAlert, CheckCircle,
  Calendar, Building2, User, FileText, Award,
  Download, Share2, Linkedin, Clock, RefreshCw,
} from 'lucide-react'

const EASE = [0.25, 0.4, 0.25, 1]

// ── QR Code visual ────────────────────────────────────────────────────────────
const QR_SIZE = 15
const QR_CELLS = Array.from({ length: QR_SIZE * QR_SIZE }, (_, i) => {
  const r = Math.floor(i / QR_SIZE)
  const c = i % QR_SIZE
  // Corner squares (3x3 at 3 corners)
  if ((r < 3 && c < 3) || (r < 3 && c > 11) || (r > 11 && c < 3)) return true
  if ((r === 3 && c < 3) || (r < 3 && c === 3)) return false
  if ((r === 3 && c > 11) || (r < 3 && c === 11)) return false
  if ((r === 3 && c < 3) || (r > 11 && c === 3)) return false
  return ((r * 7 + c * 11 + r * c) % 4) < 2
})

function QRCode({ color = '#3b82f6', size = 80 }) {
  const cell = size / QR_SIZE
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {QR_CELLS.map((on, i) => {
        const r = Math.floor(i / QR_SIZE)
        const c = i % QR_SIZE
        return on ? (
          <rect key={i} x={c * cell + 0.5} y={r * cell + 0.5}
            width={cell - 1} height={cell - 1}
            rx={1} fill={color} fillOpacity={0.88}
          />
        ) : null
      })}
    </svg>
  )
}

// ── Detail row ────────────────────────────────────────────────────────────────
function DetailRow({ Icon, label, value, color, delay, isDark }) {
  const t1 = isDark ? '#f1f5f9' : '#0f172a'
  const t2 = isDark ? 'rgba(148,163,184,0.7)' : 'rgba(100,116,139,0.75)'
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4, ease: EASE }}
      className="flex items-start gap-3 py-3 border-b"
      style={{ borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
    >
      <div className="flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0 mt-0.5"
        style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
        <Icon style={{ width: 13, height: 13, color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-medium mb-0.5 uppercase tracking-wide" style={{ color: t2 }}>
          {label}
        </div>
        <div className="text-sm font-semibold truncate" style={{ color: t1 }}>{value}</div>
      </div>
    </motion.div>
  )
}

// ── Valid result ──────────────────────────────────────────────────────────────
function ValidResult({ data, isDark }) {
  const t1 = isDark ? '#f1f5f9' : '#0f172a'
  const t2 = isDark ? 'rgba(148,163,184,0.75)' : 'rgba(100,116,139,0.78)'
  const cardBg = isDark
    ? 'linear-gradient(150deg,rgba(10,14,30,0.96),rgba(5,8,20,0.98))'
    : 'linear-gradient(150deg,rgba(255,255,255,0.97),rgba(248,250,252,0.99))'

  const details = [
    { Icon: User,      label: 'Candidate',       value: data.candidate,     color: '#3b82f6' },
    { Icon: FileText,  label: 'Exam / Course',   value: data.course,        color: '#22d3ee' },
    { Icon: Building2, label: 'Organization',    value: data.organization,  color: '#8b5cf6' },
    { Icon: Calendar,  label: 'Issue Date',      value: data.issueDate,     color: '#10b981' },
    { Icon: Award,     label: 'Grade',           value: data.grade,         color: '#f59e0b' },
    { Icon: FileText,  label: 'Certificate ID',  value: data.certId,        color: '#94a3b8' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 32, filter: 'blur(12px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.65, ease: EASE }}
      className="max-w-3xl mx-auto px-4 mb-14"
    >
      <div className="rounded-[32px] overflow-hidden"
        style={{
          background:     cardBg,
          border:         '1px solid rgba(16,185,129,0.25)',
          boxShadow:      isDark
            ? '0 32px 80px rgba(0,0,0,0.55), 0 0 60px rgba(16,185,129,0.1)'
            : '0 32px 80px rgba(0,0,0,0.08), 0 0 40px rgba(16,185,129,0.07)',
          backdropFilter: 'blur(24px)',
        }}
      >
        {/* Success header */}
        <div className="px-8 pt-8 pb-6 text-center border-b"
          style={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
            background: isDark ? 'rgba(16,185,129,0.06)' : 'rgba(16,185,129,0.04)' }}>
          {/* Animated checkmark */}
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
            style={{
              background: 'linear-gradient(135deg,#10b981,#22d3ee)',
              boxShadow:  '0 0 40px rgba(16,185,129,0.4)',
            }}
          >
            <motion.div
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
            >
              <ShieldCheck className="w-8 h-8 text-white" />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4, ease: EASE }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold mb-2"
              style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981' }}>
              <CheckCircle className="w-4 h-4" />
              Certificate Verified
            </div>
            <div className="text-xs mt-1" style={{ color: t2 }}>
              Verified at {new Date().toLocaleTimeString()} · {new Date().toLocaleDateString()}
            </div>
          </motion.div>
        </div>

        {/* Content: details + QR */}
        <div className="flex flex-col lg:flex-row gap-0 lg:gap-0">
          {/* Details */}
          <div className="flex-1 px-8 py-6">
            <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: t2 }}>
              Certificate Details
            </div>
            <div>
              {details.map((d, i) => (
                <DetailRow key={i} {...d} delay={0.3 + i * 0.07} isDark={isDark} />
              ))}
            </div>
          </div>

          {/* Right: QR + preview + actions */}
          <div className="w-full lg:w-56 flex-shrink-0 px-8 lg:px-6 py-6 border-t lg:border-t-0 lg:border-l"
            style={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>

            <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: t2 }}>
              QR Verification
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.4, ease: EASE }}
              className="flex justify-center mb-4 p-3 rounded-2xl"
              style={{ background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                border: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.07)' }}
            >
              <motion.div
                animate={{ boxShadow: ['0 0 0 rgba(59,130,246,0)', '0 0 16px rgba(59,130,246,0.3)', '0 0 0 rgba(59,130,246,0)'] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <QRCode color={isDark ? '#3b82f6' : '#2563eb'} size={96} />
              </motion.div>
            </motion.div>

            <div className="text-[10px] text-center mb-5" style={{ color: t2 }}>
              Scan to verify on any device
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-2.5">
              {[
                { Icon: Download, label: 'Download PDF', primary: true  },
                { Icon: Share2,   label: 'Share',        primary: false },
                { Icon: Linkedin, label: 'LinkedIn',     primary: false },
              ].map(({ Icon, label, primary }, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + i * 0.08, duration: 0.35, ease: EASE }}
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-semibold"
                  style={primary
                    ? { background: 'linear-gradient(135deg,#10b981,#22d3ee)', color: 'white',
                        boxShadow: '0 6px 18px rgba(16,185,129,0.3)' }
                    : { background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                        border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)',
                        color: isDark ? 'rgba(241,245,249,0.8)' : 'rgba(15,23,42,0.7)' }
                  }
                >
                  <Icon className="w-3.5 h-3.5" />{label}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ── Not found result ──────────────────────────────────────────────────────────
function NotFoundResult({ isDark, onReset }) {
  const t1 = isDark ? '#f1f5f9' : '#0f172a'
  const t2 = isDark ? 'rgba(148,163,184,0.8)' : 'rgba(71,85,105,0.85)'
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.55, ease: EASE }}
      className="max-w-xl mx-auto px-4 mb-14"
    >
      <div className="rounded-[28px] text-center px-8 py-10"
        style={{
          background:     isDark ? 'rgba(10,14,30,0.96)' : 'rgba(255,255,255,0.97)',
          border:         '1px solid rgba(239,68,68,0.28)',
          boxShadow:      isDark ? '0 24px 64px rgba(0,0,0,0.5), 0 0 40px rgba(239,68,68,0.08)' : '0 24px 64px rgba(0,0,0,0.07)',
          backdropFilter: 'blur(24px)',
        }}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-5"
          style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)' }}
        >
          <ShieldX className="w-8 h-8" style={{ color: '#ef4444' }} />
        </motion.div>
        <div className="text-xl font-extrabold mb-2" style={{ color: t1 }}>Certificate Not Found</div>
        <p className="text-sm leading-relaxed mb-6" style={{ color: t2 }}>
          The provided Certificate ID could not be verified. Please double-check the ID and try again.
        </p>
        <motion.button
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={onReset}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg,#ef4444,#f97316)', boxShadow: '0 8px 24px rgba(239,68,68,0.3)' }}
        >
          <RefreshCw className="w-4 h-4" />
          Try Another ID
        </motion.button>
      </div>
    </motion.div>
  )
}

// ── Revoked / Expired result ──────────────────────────────────────────────────
function WarnResult({ data, status, isDark, onReset }) {
  const t1 = isDark ? '#f1f5f9' : '#0f172a'
  const t2 = isDark ? 'rgba(148,163,184,0.8)' : 'rgba(71,85,105,0.85)'
  const isRevoked = status === 'revoked'
  const label = isRevoked ? 'Certificate Revoked' : 'Certificate Expired'
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.55, ease: EASE }}
      className="max-w-xl mx-auto px-4 mb-14"
    >
      <div className="rounded-[28px] text-center px-8 py-10"
        style={{
          background:     isDark ? 'rgba(10,14,30,0.96)' : 'rgba(255,255,255,0.97)',
          border:         '1px solid rgba(245,158,11,0.3)',
          boxShadow:      isDark ? '0 24px 64px rgba(0,0,0,0.5), 0 0 40px rgba(245,158,11,0.07)' : '0 24px 64px rgba(0,0,0,0.07)',
          backdropFilter: 'blur(24px)',
        }}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-5"
          style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)' }}
        >
          <ShieldAlert className="w-8 h-8" style={{ color: '#f59e0b' }} />
        </motion.div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-3"
          style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)', color: '#f59e0b' }}>
          {label}
        </div>
        <div className="text-base font-bold mb-1" style={{ color: t1 }}>{data?.candidate}</div>
        <div className="text-sm mb-1" style={{ color: '#3b82f6' }}>{data?.course}</div>
        <p className="text-sm leading-relaxed mt-3 mb-6" style={{ color: t2 }}>
          {data?.reason || 'This certificate is no longer valid.'}
          <br />Please contact the issuing organization for more information.
        </p>
        <div className="flex justify-center gap-3">
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={onReset}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold"
            style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)',
              border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.1)',
              color: t1 }}
          >
            <RefreshCw className="w-4 h-4" />
            Try Another
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg,#f59e0b,#f97316)', boxShadow: '0 6px 18px rgba(245,158,11,0.3)' }}
          >
            Contact Support
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

// ── Loading skeleton ──────────────────────────────────────────────────────────
function LoadingSkeleton({ isDark }) {
  const s = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="max-w-3xl mx-auto px-4 mb-14"
    >
      <div className="rounded-[32px] p-8"
        style={{ background: isDark ? 'rgba(10,14,30,0.92)' : 'rgba(255,255,255,0.92)',
          border: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.07)',
          backdropFilter: 'blur(24px)' }}>
        <div className="flex flex-col items-center gap-4 mb-8">
          <motion.div className="w-16 h-16 rounded-full"
            style={{ background: s }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.4, repeat: Infinity }} />
          <div className="w-40 h-4 rounded-full" style={{ background: s }} />
          <div className="w-28 h-3 rounded-full" style={{ background: s }} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg flex-shrink-0" style={{ background: s }} />
              <div className="flex-1 space-y-1.5">
                <div className="h-2.5 rounded" style={{ background: s, width: '50%' }} />
                <div className="h-3 rounded" style={{ background: s }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function VerificationResult({ status, data, isDark, onReset }) {
  return (
    <AnimatePresence mode="wait">
      {status === 'loading' && <LoadingSkeleton key="loading" isDark={isDark} />}
      {status === 'valid'   && <ValidResult    key="valid"   data={data} isDark={isDark} />}
      {status === 'not_found' && <NotFoundResult key="notfound" isDark={isDark} onReset={onReset} />}
      {(status === 'revoked' || status === 'expired') && (
        <WarnResult key="warn" data={data} status={status} isDark={isDark} onReset={onReset} />
      )}
    </AnimatePresence>
  )
}
