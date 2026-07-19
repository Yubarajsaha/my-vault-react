import { useState, useEffect } from 'react'

const CURRENT_VERSION = '1.0.0'
const VERSION_URL = 'https://raw.githubusercontent.com/Yubarajsaha/my-vault-react/main/package.json'

export default function UpdateBanner() {
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [newVersion,      setNewVersion]      = useState('')
  const [dismissed,       setDismissed]       = useState(false)

  useEffect(() => {
    // Check for update once per day
    const lastCheck = localStorage.getItem('lastUpdateCheck')
    const now       = Date.now()

    if (lastCheck && now - parseInt(lastCheck) < 86400000) return

    fetch(VERSION_URL)
      .then(r => r.json())
      .then(pkg => {
        localStorage.setItem('lastUpdateCheck', String(now))
        if (pkg.version && pkg.version !== CURRENT_VERSION) {
          setNewVersion(pkg.version)
          setUpdateAvailable(true)
        }
      })
      .catch(() => {}) // silently fail if no internet
  }, [])

  if (!updateAvailable || dismissed) return null

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0,
      background: 'linear-gradient(135deg, rgba(124,58,237,0.95), rgba(168,85,247,0.95))',
      backdropFilter: 'blur(10px)',
      padding: '10px 16px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      zIndex: 999,
      boxShadow: '0 4px 20px rgba(124,58,237,0.4)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 18 }}>🚀</span>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>
            Update available — v{newVersion}
          </div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>
            Your data is safe. Tap to update.
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={() => window.location.reload()}
          style={{
            background: '#fff', border: 'none', borderRadius: 8,
            color: '#7c3aed', padding: '6px 12px',
            fontSize: 11, fontWeight: 700, cursor: 'pointer',
          }}
        >
          Update
        </button>
        <button
          onClick={() => setDismissed(true)}
          style={{
            background: 'rgba(255,255,255,0.15)', border: 'none',
            borderRadius: 8, color: '#fff',
            padding: '6px 10px', fontSize: 11, cursor: 'pointer',
          }}
        >
          ✕
        </button>
      </div>
    </div>
  )
}