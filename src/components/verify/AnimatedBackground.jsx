import { motion, useReducedMotion } from 'framer-motion'

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  x:     (i * 73 + 17) % 100,
  y:     (i * 47 + 31) % 100,
  size:  ((i * 29) % 3) + 1.5,
  dur:   13 + ((i * 17) % 18),
  dx:    (((i * 11) % 22) - 11),
  dy:    -14 - ((i * 7) % 16),
  color: ['#3b82f6','#10b981','#22d3ee'][i % 3],
  op:    0.06 + ((i * 13) % 12) / 100,
}))

export default function AnimatedBackground({ isDark }) {
  const reduced = useReducedMotion()
  const gc = isDark ? 'rgba(59,130,246,0.018)' : 'rgba(59,130,246,0.022)'

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0" style={{
        backgroundImage: `radial-gradient(circle,${gc} 1px,transparent 1px)`,
        backgroundSize: '40px 40px',
      }} />
      <motion.div className="absolute rounded-full"
        style={{ width: 900, height: 900, top: '-20%', left: '-8%',
          background: isDark
            ? 'radial-gradient(circle,rgba(59,130,246,0.09) 0%,rgba(59,130,246,0.02) 40%,transparent 70%)'
            : 'radial-gradient(circle,rgba(59,130,246,0.05) 0%,transparent 60%)',
          filter: 'blur(2px)',
        }}
        animate={reduced ? {} : { x:[0,30,-15,0], y:[0,-24,12,0] }}
        transition={{ duration: 30, repeat: Infinity, ease:'easeInOut' }}
      />
      <motion.div className="absolute rounded-full"
        style={{ width: 700, height: 700, bottom: '-18%', right: '-5%',
          background: isDark
            ? 'radial-gradient(circle,rgba(16,185,129,0.07) 0%,rgba(16,185,129,0.02) 40%,transparent 70%)'
            : 'radial-gradient(circle,rgba(16,185,129,0.04) 0%,transparent 60%)',
          filter: 'blur(2px)',
        }}
        animate={reduced ? {} : { x:[0,-26,13,0], y:[0,20,-10,0] }}
        transition={{ duration: 36, repeat: Infinity, ease:'easeInOut', delay: 6 }}
      />
      <motion.div className="absolute rounded-full"
        style={{ width: 500, height: 500, top: '35%', right: '5%',
          background: isDark
            ? 'radial-gradient(circle,rgba(34,211,238,0.05) 0%,transparent 65%)'
            : 'radial-gradient(circle,rgba(34,211,238,0.03) 0%,transparent 65%)',
        }}
        animate={reduced ? {} : { x:[0,-18,9,0], y:[0,16,-8,0] }}
        transition={{ duration: 24, repeat: Infinity, ease:'easeInOut', delay: 3 }}
      />
      {!reduced && PARTICLES.map((p, i) => (
        <motion.div key={i} className="absolute rounded-full"
          style={{ width:p.size, height:p.size, left:`${p.x}%`, top:`${p.y}%`,
            background:p.color, opacity:0 }}
          animate={{ x:[0,p.dx,0], y:[0,p.dy,0], opacity:[0,p.op,0] }}
          transition={{ duration:p.dur, repeat:Infinity, delay:i*0.42, ease:'easeInOut' }}
        />
      ))}
    </div>
  )
}
