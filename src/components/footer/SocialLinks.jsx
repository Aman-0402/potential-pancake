import { motion } from 'framer-motion'
import { Github, Linkedin, Twitter, Youtube, Mail } from 'lucide-react'

const SOCIALS = [
  { Icon: Github,   label: 'GitHub',   href: 'https://github.com/certibyt',   color: '#ffffff' },
  { Icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com/company/certibyt', color: '#0a66c2' },
  { Icon: Twitter,  label: 'X',        href: 'https://twitter.com/certibyt',  color: '#1d9bf0' },
  { Icon: Youtube,  label: 'YouTube',  href: 'https://youtube.com/@certibyt', color: '#ff0000' },
  { Icon: Mail,     label: 'Email',    href: 'mailto:hello@certibyt.com',     color: '#22d3ee' },
]

export default function SocialLinks({ isDark }) {
  return (
    <div className="flex items-center gap-2.5 flex-wrap" role="list" aria-label="Social media links">
      {SOCIALS.map(({ Icon, label, href, color }) => (
        <motion.a
          key={label}
          href={href}
          target={href.startsWith('mailto') ? undefined : '_blank'}
          rel="noopener noreferrer"
          aria-label={label}
          role="listitem"
          className="relative flex items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          style={{
            width: 36,
            height: 36,
            background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)',
            color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(15,23,42,0.55)',
          }}
          whileHover={{
            y: -3,
            scale: 1.12,
            color,
            boxShadow: `0 6px 20px ${color}35`,
            background: isDark ? 'rgba(255,255,255,0.1)' : `${color}10`,
            borderColor: `${color}55`,
          }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 380, damping: 18 }}
        >
          <Icon className="w-[15px] h-[15px]" strokeWidth={1.8} />
        </motion.a>
      ))}
    </div>
  )
}
