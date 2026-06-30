import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Check, Star, ArrowRight, Zap, Building2, Rocket } from 'lucide-react'

const EASE = [0.25, 0.4, 0.25, 1]

const PLANS = [
  {
    key:   'starter',
    Icon:  Rocket,
    name:  'Starter',
    desc:  'Perfect for small institutes getting started with online examinations.',
    price: '$49',
    per:   '/month',
    color: '#AF8E38',
    grad:  'linear-gradient(135deg,#AF8E38,#C9A84C)',
    featured: false,
    features: [
      'Up to 5 organizations',
      '500 candidates / month',
      'Full exam builder',
      'Certificate generation',
      'Email support',
    ],
  },
  {
    key:   'professional',
    Icon:  Star,
    name:  'Professional',
    desc:  'For growing platforms that need advanced proctoring and analytics.',
    price: '$149',
    per:   '/month',
    color: '#C9A84C',
    grad:  'linear-gradient(135deg,#C9A84C,#E4C36E)',
    featured: true,
    features: [
      'Up to 25 organizations',
      '5,000 candidates / month',
      'AI proctoring & monitoring',
      'Custom certificate branding',
      'Advanced analytics',
      'Priority support',
    ],
  },
  {
    key:   'enterprise',
    Icon:  Building2,
    name:  'Enterprise',
    desc:  'Unlimited scale for universities and large enterprise deployments.',
    price: 'Custom',
    per:   '',
    color: '#9E7E28',
    grad:  'linear-gradient(135deg,#9E7E28,#AF8E38)',
    featured: false,
    features: [
      'Unlimited organizations',
      'Unlimited candidates',
      'White-label certificates',
      'Full API access',
      'Dedicated account manager',
    ],
  },
]

function PricingCard({ plan, idx, isDark, inView }) {
  const t1  = isDark ? '#f1f5f9' : '#0f172a'
  const t2  = isDark ? 'rgba(148,163,184,0.8)' : 'rgba(71,85,105,0.8)'
  const t3  = isDark ? 'rgba(148,163,184,0.6)' : 'rgba(100,116,139,0.7)'

  const baseCard = {
    background: isDark
      ? 'linear-gradient(150deg,rgba(12,16,34,0.95),rgba(6,10,24,0.98))'
      : 'linear-gradient(150deg,rgba(255,255,255,0.95),rgba(248,250,252,0.98))',
    backdropFilter: 'blur(24px)',
  }

  if (plan.featured) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.96, filter: 'blur(10px)' }}
        animate={inView ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' } : {}}
        transition={{ duration: 0.6, delay: 0.15 + idx * 0.12, ease: EASE }}
        whileHover={{ y: -8, scale: 1.02 }}
        className="relative rounded-[28px] lg:scale-[1.04] z-10"
        style={{
          padding: 2,
          background: plan.grad,
          boxShadow: `0 0 60px ${plan.color}30, 0 32px 80px rgba(0,0,0,0.4)`,
        }}
      >
        {/* Popular badge */}
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
          <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold"
            style={{ background: plan.grad, color: 'white', boxShadow: `0 4px 16px ${plan.color}40` }}>
            <Star className="w-3 h-3 fill-current" />
            Most Popular
          </div>
        </div>

        <div className="rounded-[26px] h-full flex flex-col p-7" style={baseCard}>
          <CardInner plan={plan} t1={t1} t2={t2} t3={t3} isDark={isDark} featured />
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.96, filter: 'blur(10px)' }}
      animate={inView ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.6, delay: 0.15 + idx * 0.12, ease: EASE }}
      whileHover={{ y: -6, boxShadow: `0 24px 64px rgba(0,0,0,0.35), 0 0 40px ${plan.color}18` }}
      className="relative rounded-[28px] flex flex-col p-7"
      style={{
        ...baseCard,
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'}`,
        boxShadow: isDark
          ? '0 20px 60px rgba(0,0,0,0.45)'
          : '0 20px 60px rgba(0,0,0,0.06)',
        transition: 'box-shadow 0.3s ease',
      }}
    >
      <CardInner plan={plan} t1={t1} t2={t2} t3={t3} isDark={isDark} featured={false} />
    </motion.div>
  )
}

function CardInner({ plan, t1, t2, t3, isDark, featured }) {
  return (
    <>
      {/* Icon + name */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-2xl flex-shrink-0"
          style={{ background: `${plan.color}15`, border: `1px solid ${plan.color}28` }}>
          <plan.Icon className="w-5 h-5" style={{ color: plan.color }} />
        </div>
        <div>
          <div className="text-base font-extrabold" style={{ color: t1 }}>{plan.name}</div>
          <div className="text-[11px] leading-tight" style={{ color: t3 }}>{plan.desc}</div>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-end gap-1 mb-6">
        <span className="text-4xl font-extrabold tracking-tight"
          style={{
            background: plan.grad,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
          {plan.price}
        </span>
        {plan.per && (
          <span className="text-sm mb-1.5" style={{ color: t3 }}>{plan.per}</span>
        )}
      </div>

      {/* Divider */}
      <div className="mb-5 h-px" style={{
        background: `linear-gradient(to right,${plan.color}30,transparent)`,
      }} />

      {/* Features */}
      <ul className="flex flex-col gap-2.5 flex-1 mb-7">
        {plan.features.map((f, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <div className="flex items-center justify-center w-4.5 h-4.5 rounded-full mt-0.5 flex-shrink-0"
              style={{ background: `${plan.color}18` }}>
              <Check style={{ width: 10, height: 10, color: plan.color }} />
            </div>
            <span className="text-sm leading-snug" style={{ color: t2 }}>{f}</span>
          </li>
        ))}
      </ul>

      {/* CTA button */}
      <Link to="/pricing" tabIndex={0}>
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="group flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-sm font-semibold"
          style={featured
            ? { background: plan.grad, color: 'white', boxShadow: `0 8px 24px ${plan.color}35` }
            : { background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)',
                border: `1px solid ${plan.color}30`, color: plan.color }
          }
        >
          {plan.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
          <motion.span
            className="inline-block"
            initial={{ x: 0 }}
            whileHover={{ x: 3 }}
            transition={{ duration: 0.2 }}
          >
            <ArrowRight className="w-4 h-4" />
          </motion.span>
        </motion.div>
      </Link>
    </>
  )
}

export default function PricingPreview({ isDark, inView }) {
  const t1  = isDark ? '#f1f5f9' : '#0f172a'
  const t2  = isDark ? 'rgba(148,163,184,0.8)' : 'rgba(71,85,105,0.85)'

  return (
    <div className="mb-28">
      {/* Section header */}
      <div className="text-center mb-14">
        <motion.h2
          initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.55, delay: 0.1, ease: EASE }}
          className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4"
          style={{ color: t1 }}
        >
          Choose Your{' '}
          <span style={{
            background: 'linear-gradient(135deg,#C9A84C,#E4C36E)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Growth Plan
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, delay: 0.22, ease: EASE }}
          className="text-base max-w-xl mx-auto"
          style={{ color: t2 }}
        >
          Start free. Scale as you grow. Every plan includes secure exams, verified certificates,
          and real-time monitoring.
        </motion.p>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-5 items-center">
        {PLANS.map((plan, i) => (
          <PricingCard key={plan.key} plan={plan} idx={i} isDark={isDark} inView={inView} />
        ))}
      </div>

      {/* See full pricing link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.7, duration: 0.4 }}
        className="text-center mt-8"
      >
        <Link to="/pricing">
          <motion.span
            whileHover={{ x: 4 }}
            className="inline-flex items-center gap-1.5 text-sm font-semibold"
            style={{ color: isDark ? '#E4C36E' : '#9E7E28' }}
          >
            See full pricing details
            <ArrowRight className="w-4 h-4" />
          </motion.span>
        </Link>
      </motion.div>
    </div>
  )
}
