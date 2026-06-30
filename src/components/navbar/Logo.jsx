import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import darkLogo  from '../../assets/dark_themeee.png'
import lightLogo from '../../assets/light_themeee.png'

export default function Logo({ isDark }) {
  return (
    <Link
      to="/"
      aria-label="CertiByt — Home"
      className="flex items-center select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg"
    >
      <motion.img
        src={isDark ? darkLogo : lightLogo}
        alt="CertiByt"
        className="h-9 w-auto object-contain"
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      />
    </Link>
  )
}
