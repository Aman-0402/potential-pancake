import { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import AnimatedBackground from '../components/verify/AnimatedBackground'
import VerifyHero from '../components/verify/VerifyHero'
import CertificateSearch from '../components/verify/CertificateSearch'
import VerificationResult from '../components/verify/VerificationResult'
import VerificationTimeline from '../components/verify/VerificationTimeline'
import TrustBadges from '../components/verify/TrustBadges'
import VerifyFAQ from '../components/verify/VerifyFAQ'

const MOCK_DB = {
  'CBT-2026-8F92D4A1': {
    status:       'valid',
    candidate:    'Ahmed Al-Rashid',
    course:       'AWS Cloud Practitioner',
    organization: 'TechCorp Inc.',
    issueDate:    'January 15, 2026',
    grade:        'Distinction — 94%',
    certId:       'CBT-2026-8F92D4A1',
  },
  'CBT-2025-3B71E2C9': {
    status:       'expired',
    candidate:    'Sara M. Johnson',
    course:       'ISO 27001 Compliance',
    organization: 'SecureFinance Ltd.',
    issueDate:    'March 22, 2025',
    expiryDate:   'March 22, 2026',
    certId:       'CBT-2025-3B71E2C9',
    reason:       'Certificate validity period ended on March 22, 2026.',
  },
  'CBT-2024-7A43F891': {
    status:       'revoked',
    candidate:    'James R. Chen',
    course:       'React Advanced Certification',
    organization: 'DevAcademy Pro',
    issueDate:    'June 8, 2024',
    certId:       'CBT-2024-7A43F891',
    reason:       'Certificate revoked by issuing organization on November 3, 2024.',
  },
}

async function verifyCertificate(id) {
  await new Promise(r => setTimeout(r, 1400))
  const result = MOCK_DB[id.trim().toUpperCase()]
  if (!result) return { status: 'not_found', certId: id }
  return result
}

export default function Verify() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const [verifyStatus, setVerifyStatus] = useState('idle')
  const [certData, setCertData] = useState(null)

  const handleVerify = async (id) => {
    setVerifyStatus('loading')
    setCertData(null)
    try {
      const result = await verifyCertificate(id)
      setCertData(result)
      setVerifyStatus(result.status)
    } catch {
      setVerifyStatus('error')
    }
  }

  const handleReset = () => {
    setVerifyStatus('idle')
    setCertData(null)
  }

  const pageBg = isDark
    ? 'linear-gradient(160deg,#050810 0%,#080d1c 40%,#050810 100%)'
    : 'linear-gradient(160deg,#f8fafc 0%,#f1f5f9 40%,#f8fafc 100%)'

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: pageBg }}>
      <AnimatedBackground isDark={isDark} />

      <div className="relative z-10">
        {/* Hero */}
        <VerifyHero isDark={isDark} />

        {/* Search card */}
        <CertificateSearch
          isDark={isDark}
          status={verifyStatus}
          onVerify={handleVerify}
        />

        {/* Result (loading/valid/invalid/revoked/expired) */}
        <VerificationResult
          status={verifyStatus}
          data={certData}
          isDark={isDark}
          onReset={handleReset}
        />

        {/* Divider */}
        <div className="max-w-xl mx-auto px-4 mb-20">
          <div className="h-px" style={{
            background: isDark
              ? 'linear-gradient(to right,transparent,rgba(255,255,255,0.07),transparent)'
              : 'linear-gradient(to right,transparent,rgba(0,0,0,0.07),transparent)',
          }} />
        </div>

        {/* Timeline */}
        <VerificationTimeline isDark={isDark} />

        {/* Trust badges */}
        <TrustBadges isDark={isDark} />

        {/* FAQ */}
        <VerifyFAQ isDark={isDark} />
      </div>
    </div>
  )
}
