import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import AuthShell from '@/features/account/components/AuthShell'
import { PrimaryLink } from '@/features/account/components/FormButtons'
import { authRequest } from '@/features/account/authApi'

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState(token ? 'Verifying your email…' : 'Verification link is missing or invalid.')
  const requestStarted = useRef(false)

  useEffect(() => {
    if (!token || requestStarted.current) return
    requestStarted.current = true
    authRequest('verify-email', { token })
      .then(() => setStatus('Email verified. You can now log in.'))
      .catch((error) => setStatus(error.message || 'This verification link is invalid or has expired.'))
  }, [token])

  return (
    <AuthShell word="Verify" eyebrow="Join the garage" headline="Your journey starts here." title="Verify your email" subtitle={status}>
      <PrimaryLink to="/login">GO TO LOG IN</PrimaryLink>
    </AuthShell>
  )
}

export default VerifyEmailPage
