'use client'

import { useEffect, useState } from 'react'

export default function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const isIOS =
    typeof navigator !== 'undefined' &&
    /iPad|iPhone|iPod/.test(navigator.userAgent)
  const isStandalone =
    typeof window !== 'undefined' &&
    window.matchMedia('(display-mode: standalone)').matches

  useEffect(() => {
    if (!isIOS || isStandalone) {
      return
    }

    const timer = window.setTimeout(() => setShowPrompt(true), 3000)
    return () => window.clearTimeout(timer)
  }, [isIOS, isStandalone])

  if (!showPrompt || isStandalone || !isIOS) {
    return null
  }

  return (
    <div style={{ position: 'fixed', bottom: '60px', left: '10px', right: '10px', background: '#003893', color: '#fff', padding: '10px', borderRadius: '8px', zIndex: 10000, textAlign: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
      <p style={{ margin: '0', fontSize: '14px' }}>
        Install this app for a full experience! Tap <span style={{ fontWeight: 'bold' }}>Share</span> and then &quot;Add to Home Screen&quot;.
      </p>
      <button onClick={() => setShowPrompt(false)} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '14px', position: 'absolute', top: '8px', right: '10px', cursor: 'pointer' }}>Close</button>
    </div>
  )
}
