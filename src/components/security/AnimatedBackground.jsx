import { motion, useReducedMotion } from 'framer-motion'

const PARTICLES = Array.from({ length: 16 }, (_, i) => ({
  x:     (i * 79 + 19) % 100,
  y:     (i * 53 + 37) % 100,
  size:  ((i * 31) % 3) + 1.5,
  dur:   14 + ((i * 17) % 18),
  dx:    (((i * 13) % 22) - 11),
  dy:    -16 - ((i * 9) % 16),
  color: ['#C9A84C','#10b981','#E4C36E'][i % 3],
  op:    0.06 + ((i * 11) % 12) / 100,
}))

export default function AnimatedBackground({ isDark }) {
  const reduced = useReducedMotion()
  const gc = isDark ? 'rgba(201,168,76,0.022)' : 'rgba(201,168,76,0.028)'

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0" style={{
        backgroundImage: `radial-gradient(circle, ${gc} 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
      }} />

      <motion.div className="absolute rounded-full"
        style={{ width: 900, height: 900, top: '-25%', left: '-10%',
          background: isDark
            ? 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, rgba(201,168,76,0.02) 40%, transparent 70%)'
            : 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 60%)',
          filter: 'blur(2px)',
        }}
        animate={reduced ? {} : { x:[0,35,-18,0], y:[0,-28,14,0] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div className="absolute rounded-full"
        style={{ width: 700, height: 700, bottom: '-20%', right: '-5%',
          background: isDark
            ? 'radial-gradient(circle, rgba(16,185,129,0.07) 0%, rgba(16,185,129,0.02) 40%, transparent 70%)'
            : 'radial-gradient(circle, rgba(16,185,129,0.04) 0%, transparent 60%)',
          filter: 'blur(2px)',
        }}
        animate={reduced ? {} : { x:[0,-28,14,0], y:[0,22,-11,0] }}
        transition={{ duration: 36, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
      />
      <motion.div className="absolute rounded-full"
        style={{ width: 500, height: 500, top: '25%', right: '-8%',
          background: isDark
            ? 'radial-gradient(circle, rgba(175,144,55,0.06) 0%, transparent 65%)'
            : 'radial-gradient(circle, rgba(175,144,55,0.04) 0%, transparent 65%)',
        }}
        animate={reduced ? {} : { x:[0,-18,9,0], y:[0,18,-9,0] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />

      {!reduced && PARTICLES.map((p, i) => (
        <motion.div key={i} className="absolute rounded-full"
          style={{ width: p.size, height: p.size, left:`${p.x}%`, top:`${p.y}%`,
            background: p.color, opacity: 0 }}
          animate={{ x:[0,p.dx,0], y:[0,p.dy,0], opacity:[0,p.op,0] }}
          transition={{ duration: p.dur, repeat: Infinity, delay: i*0.45, ease:'easeInOut' }}
        />
      ))}
    </div>
  )
}
