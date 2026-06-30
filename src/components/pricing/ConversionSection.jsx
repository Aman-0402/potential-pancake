import { useRef } from 'react'
import { motion, useReducedMotion, useInView } from 'framer-motion'
import { useTheme } from '../../contexts/ThemeContext'
import PricingPreview from './PricingPreview'
import FAQAccordion from './FAQAccordion'
import FinalCTA from './FinalCTA'

const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  x:     (i * 83 + 21) % 100,
  y:     (i * 57 + 43) % 100,
  size:  ((i * 31) % 3) + 1.5,
  dur:   14 + ((i * 19) % 18),
  dx:    (((i * 13) % 20) - 10),
  dy:    -14 - ((i * 7) % 16),
  color: ['#3b82f6','#8b5cf6','#22d3ee'][i % 3],
  op:    0.06 + ((i * 11) % 10) / 100,
}))

function AnimatedBackground({ isDark }) {
  const reduced = useReducedMotion()
  const gc = isDark ? 'rgba(59,130,246,0.016)' : 'rgba(59,130,246,0.02)'

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0" style={{
        backgroundImage: `radial-gradient(circle, ${gc} 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
      }} />
      <motion.div className="absolute rounded-full"
        style={{ width: 800, height: 800, top: '-20%', right: '-10%',
          background: isDark
            ? 'radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 65%)'
            : 'radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 65%)',
          filter: 'blur(2px)',
        }}
        animate={reduced ? {} : { x:[0,-30,15,0], y:[0,-22,11,0] }}
        transition={{ duration: 28, repeat: Infinity, ease:'easeInOut' }}
      />
      <motion.div className="absolute rounded-full"
        style={{ width: 600, height: 600, bottom: '-15%', left: '-5%',
          background: isDark
            ? 'radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 65%)'
            : 'radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 65%)',
          filter: 'blur(2px)',
        }}
        animate={reduced ? {} : { x:[0,24,-12,0], y:[0,18,-9,0] }}
        transition={{ duration: 34, repeat: Infinity, ease:'easeInOut', delay: 5 }}
      />
      {!reduced && PARTICLES.map((p, i) => (
        <motion.div key={i} className="absolute rounded-full"
          style={{ width:p.size, height:p.size, left:`${p.x}%`, top:`${p.y}%`,
            background:p.color, opacity:0 }}
          animate={{ x:[0,p.dx,0], y:[0,p.dy,0], opacity:[0,p.op,0] }}
          transition={{ duration:p.dur, repeat:Infinity, delay:i*0.45, ease:'easeInOut' }}
        />
      ))}
    </div>
  )
}

export default function ConversionSection() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const pricingRef = useRef(null)
  const faqRef     = useRef(null)
  const ctaRef     = useRef(null)

  const pricingInView = useInView(pricingRef, { once: true, margin: '0px 0px -60px 0px' })
  const faqInView     = useInView(faqRef,     { once: true, margin: '0px 0px -60px 0px' })
  const ctaInView     = useInView(ctaRef,     { once: true, margin: '0px 0px -40px 0px' })

  return (
    <section
      aria-label="Pricing, FAQ, and Call to Action"
      className="relative overflow-hidden"
      style={{
        background:    isDark ? 'rgb(3,5,16)' : 'rgb(248,250,252)',
        paddingTop:    140,
        paddingBottom: 140,
      }}
    >
      <AnimatedBackground isDark={isDark} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Pricing */}
        <div ref={pricingRef}>
          <PricingPreview isDark={isDark} inView={pricingInView} />
        </div>

        {/* Divider */}
        <div className="mb-28 h-px max-w-2xl mx-auto"
          style={{ background: `linear-gradient(to right,transparent,${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'},transparent)` }} />

        {/* FAQ */}
        <div ref={faqRef}>
          <FAQAccordion isDark={isDark} inView={faqInView} />
        </div>

        {/* Divider */}
        <div className="mb-28 h-px max-w-2xl mx-auto"
          style={{ background: `linear-gradient(to right,transparent,${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'},transparent)` }} />

        {/* Final CTA */}
        <div ref={ctaRef}>
          <FinalCTA isDark={isDark} inView={ctaInView} />
        </div>
      </div>
    </section>
  )
}
