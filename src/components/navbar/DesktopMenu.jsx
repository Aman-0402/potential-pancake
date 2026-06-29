import { motion } from 'framer-motion'
import NavItem from './NavItem'
import { NAV_ITEMS } from './navItems'

const EASE = [0.25, 0.4, 0.25, 1]

const containerV = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055, delayChildren: 0.25 } },
}
const itemV = {
  hidden: { opacity: 0, y: -10, filter: 'blur(6px)' },
  show:   { opacity: 1, y: 0,   filter: 'blur(0px)', transition: { duration: 0.45, ease: EASE } },
}

export default function DesktopMenu({ isDark }) {
  return (
    <motion.nav
      aria-label="Primary navigation"
      variants={containerV}
      initial="hidden"
      animate="show"
      className="hidden lg:flex items-center gap-0.5"
    >
      {NAV_ITEMS.map((item) => (
        <motion.div key={item.key} variants={itemV}>
          <NavItem {...item} isDark={isDark} />
        </motion.div>
      ))}
    </motion.nav>
  )
}
