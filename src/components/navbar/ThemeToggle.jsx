import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'

export default function ThemeToggle({ compact = false }) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <motion.button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      type="button"
      className="relative flex items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 flex-shrink-0"
      style={{
        width: compact ? 34 : 36,
        height: compact ? 34 : 36,
        background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
        border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)',
        focusRingOffset: isDark ? 'rgba(6,10,24,1)' : 'white',
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.88, rotate: 20 }}
      transition={{ type: 'spring', stiffness: 380, damping: 18 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? 'moon' : 'sun'}
          initial={{ opacity: 0, rotate: -60, scale: 0.5 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 60, scale: 0.5 }}
          transition={{ duration: 0.22, ease: [0.25, 0.4, 0.25, 1] }}
          className="flex items-center justify-center"
        >
          {isDark
            ? <Sun className="w-[15px] h-[15px] text-amber-400" strokeWidth={2} />
            : <Moon className="w-[15px] h-[15px] text-slate-500" strokeWidth={2} />
          }
        </motion.span>
      </AnimatePresence>
    </motion.button>
  )
}
