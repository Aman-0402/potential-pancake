import { useRef } from 'react'
import { useInView } from 'framer-motion'
import { useTheme } from '../../contexts/ThemeContext'
import AnimatedBackground from './AnimatedBackground'
import SectionHeader from './SectionHeader'
import SecurityPanel from './SecurityPanel'
import AnalyticsDashboard from './AnalyticsDashboard'

export default function SecurityAnalyticsSection() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -80px 0px' })

  return (
    <section
      ref={ref}
      aria-label="Enterprise Security and Analytics"
      className="relative overflow-hidden"
      style={{
        background: isDark ? 'rgb(3,5,16)' : 'rgb(248,250,252)',
        paddingTop: 140,
        paddingBottom: 140,
      }}
    >
      <AnimatedBackground isDark={isDark} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader isDark={isDark} inView={inView} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-14 items-start">
          <SecurityPanel isDark={isDark} inView={inView} />
          <AnalyticsDashboard isDark={isDark} inView={inView} />
        </div>
      </div>
    </section>
  )
}
