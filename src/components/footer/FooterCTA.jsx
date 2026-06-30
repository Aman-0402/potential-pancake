import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, CalendarDays } from 'lucide-react'
import { useReducedMotion } from 'framer-motion'

const EASE = [0.25, 0.4, 0.25, 1]

const containerV = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}
const itemV = {
  hidden: { opacity: 0, y: 36, filter: 'blur(12px)' },
  show:   { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.65, ease: EASE } },
}

export default function FooterCTA({ isDark }) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      variants={reduced ? {} : containerV}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      className="text-center"
    >
      {/* Badge */}
      <motion.div variants={reduced ? {} : itemV} className="flex justify-center mb-6">
        <span
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[12px] font-semibold"
          style={{
            background: isDark ? 'rgba(201,168,76,0.1)' : 'rgba(201,168,76,0.07)',
            border: isDark ? '1px solid rgba(201,168,76,0.3)' : '1px solid rgba(201,168,76,0.25)',
            color: isDark ? '#E4C36E' : '#9E7E28',
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: '#C9A84C', boxShadow: '0 0 6px rgba(201,168,76,0.6)' }}
          />
          Trusted by 500+ organizations worldwide
        </span>
      </motion.div>

      {/* Heading */}
      <motion.h2
        variants={reduced ? {} : itemV}
        className="text-4xl sm:text-5xl lg:text-[56px] font-black tracking-tight leading-[1.1] mb-6 mx-auto max-w-3xl"
        style={{ color: isDark ? 'rgba(255,255,255,0.96)' : 'rgb(15,23,42)' }}
      >
        Ready to Build{' '}
        <span
          style={{
            background: 'linear-gradient(135deg, #C9A84C 0%, #E4C36E 50%, #AF8E38 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Secure Online Examinations?
        </span>
      </motion.h2>

      {/* Description */}
      <motion.p
        variants={reduced ? {} : itemV}
        className="text-[16px] leading-relaxed mb-10 mx-auto max-w-xl"
        style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(15,23,42,0.52)' }}
      >
        Join organizations using CertiByt to conduct secure online exams, issue verified certificates, and manage enterprise-scale assessments.
      </motion.p>

      {/* Buttons */}
      <motion.div
        variants={reduced ? {} : itemV}
        className="flex flex-col sm:flex-row items-center justify-center gap-3"
      >
        {/* Primary: Start Free */}
        <motion.div
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 380, damping: 18 }}
        >
          <Link
            to="/register"
            className="relative inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-[14px] font-bold text-white overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            style={{
              background: 'linear-gradient(135deg, #C9A84C 0%, #AF8E38 100%)',
              boxShadow: '0 4px 28px rgba(201,168,76,0.40), inset 0 1px 0 rgba(255,255,255,0.18)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 36px rgba(201,168,76,0.55), inset 0 1px 0 rgba(255,255,255,0.18)' }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 28px rgba(201,168,76,0.40), inset 0 1px 0 rgba(255,255,255,0.18)' }}
          >
            Start Free
            <motion.span whileHover={{ x: 2 }} transition={{ duration: 0.18 }}>
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </motion.span>
            {/* Sheen */}
            <span
              aria-hidden
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.14) 0%, transparent 55%)' }}
            />
          </Link>
        </motion.div>

        {/* Secondary: Book Demo */}
        <motion.div
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 380, damping: 18 }}
        >
          <Link
            to="/demo"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-[14px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            style={{
              color: isDark ? 'rgba(255,255,255,0.85)' : 'rgb(30,41,59)',
              background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.04)',
              border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.1)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
            }}
          >
            <CalendarDays className="w-4 h-4" strokeWidth={1.8} />
            Book Demo
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
