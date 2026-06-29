import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import FooterColumn from './FooterColumn'
import SocialLinks from './SocialLinks'

const EASE = [0.25, 0.4, 0.25, 1]

const COLUMNS = [
  {
    title: 'Platform',
    links: [
      { label: 'Home',      to: '/'          },
      { label: 'Platform',  to: '/#platform' },
      { label: 'Features',  to: '/#features' },
      { label: 'Security',  to: '/#security' },
      { label: 'Pricing',   to: '/pricing'   },
      { label: 'Book Demo', to: '/demo'      },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', to: '/docs'      },
      { label: 'API',           to: '/api'       },
      { label: 'Help Center',   to: '/help'      },
      { label: 'FAQs',          to: '/faqs'      },
      { label: 'Blog',          to: '/blog'      },
      { label: 'Release Notes', to: '/changelog' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About',            to: '/about'   },
      { label: 'Careers',          to: '/careers' },
      { label: 'Privacy Policy',   to: '/privacy' },
      { label: 'Terms of Service', to: '/terms'   },
      { label: 'Contact',          to: '/contact' },
    ],
  },
  {
    title: 'Certificate',
    links: [
      { label: 'Verify Certificate',  to: '/verify'        },
      { label: 'Certificate Lookup',  to: '/lookup'        },
      { label: 'Public Verification', to: '/public-verify' },
      { label: 'Status',              to: '/status'        },
      { label: 'Support',             to: '/support'       },
    ],
  },
]

export default function FooterColumns({ isDark }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
      {/* Col 1: Brand */}
      <motion.div
        className="lg:col-span-1"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.55, ease: EASE }}
      >
        {/* Logo */}
        <Link
          to="/"
          aria-label="CertiByt — Home"
          className="inline-flex items-center gap-2.5 mb-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg"
        >
          <div
            className="flex items-center justify-center rounded-[10px] flex-shrink-0"
            style={{
              width: 30, height: 30,
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              boxShadow: '0 2px 10px rgba(59,130,246,0.35)',
            }}
          >
            <ShieldCheck className="w-[15px] h-[15px] text-white" strokeWidth={2.2} />
          </div>
          <div className="flex items-baseline">
            <span className="text-[16px] font-black tracking-tight" style={{ color: isDark ? 'rgba(255,255,255,0.95)' : 'rgb(15,23,42)' }}>
              Certi
            </span>
            <span className="text-[16px] font-black tracking-tight" style={{ color: '#3b82f6' }}>
              Byt
            </span>
          </div>
        </Link>

        {/* Description */}
        <p
          className="text-[13px] leading-[1.75] mb-6 max-w-[220px]"
          style={{ color: isDark ? 'rgba(255,255,255,0.42)' : 'rgba(15,23,42,0.48)' }}
        >
          Enterprise Examination &amp; Certification Platform built for universities, organizations, and training institutes.
        </p>

        <SocialLinks isDark={isDark} />
      </motion.div>

      {/* Cols 2-5: Link columns */}
      {COLUMNS.map((col, i) => (
        <FooterColumn
          key={col.title}
          title={col.title}
          links={col.links}
          isDark={isDark}
          delay={i * 0.07 + 0.08}
        />
      ))}
    </div>
  )
}
