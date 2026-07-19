import { useState, useEffect, useRef } from 'react'
import QRCode from 'qrcode'

export default function QRSync({ docs, photos, secrets, profile, activity, password, onImport }) {
  const [mode,       setMode]       = useState(null) // null | 'export' | 'import'
  const [qrUrl,      setQrUrl]      = useState('')
  const [generating, setGenerating] = useState(false)
  const [importing,  setImporting]  = useState(false)
  const [importText, setImportText] = useState('')
  const [status,     setStatus]     = useState('')
  const [statusType, setStatusType] = useState('good')
  const canvasRef = useRef(null)

  function showStatus(msg, type = 'good') {
    setStatus(msg)
    setStatusType(type)
    setTimeout(() => setStatus(''), 4000)
  }

  // Generate QR code with encrypted vault data
  async function handleExport() {
    setGenerating(true)
    setMode('export')
    try {
      // Bundle all vault data
      const vaultBundle = {
        version: 1,
        ts: Date.now(),
        data: localStorage.getItem('vaultData_v3') || '',
        user: localStorage.getItem('vaultUser_v1') || '',
        settings: localStorage.getItem('vaultSettings_v1') || '',
        noPw: localStorage.getItem('vault_no_pw_data') || '',
      }

      const bundleStr = JSON.stringify(vaultBundle)

      // Check size — QR codes have limits
      if (bundleStr.length > 2000) {
        // Too large for QR — offer download instead
        const blob = new Blob([bundleStr], { type: 'application/json' })
        const url  = URL.createObjectURL(blob)
        const a    = document.createElement('a')
        a.href     = url
        a.download = 'my-vault-export.vaultbundle'
        a.click()
        URL.revokeObjectURL(url)
        showStatus('Vault too large for QR — downloaded as file instead. Import it on your other device.', 'info')
        setGenerating(false)
        return
      }

      // Generate QR
      const url = await QRCode.toDataURL(bundleStr, {
        width: 280,
        margin: 2,
        color: { dark: '#ffffff', light: '#111318' },
        errorCorrectionLevel: 'M',
      })
      setQrUrl(url)
      showStatus('QR generated! Scan this on your other device after installing the app.', 'good')
    } catch (e) {
      showStatus('Could not generate QR. Try the file export instead.', 'bad')
    }
    setGenerating(false)
  }

  // Export as downloadable file (for larger vaults)
  function handleFileExport() {
    const vaultBundle = {
      version: 1,
      ts: Date.now(),
      data:     localStorage.getItem('vaultData_v3')     || '',
      user:     localStorage.getItem('vaultUser_v1')     || '',
      settings: localStorage.getItem('vaultSettings_v1') || '',
      noPw:     localStorage.getItem('vault_no_pw_data') || '',
    }
    const blob = new Blob([JSON.stringify(vaultBundle, null, 2)], { type: 'application/json' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `my-vault-${Date.now()}.vaultbundle`
    a.click()
    URL.revokeObjectURL(url)
    showStatus('Vault exported! Copy this file to your other device and import it.', 'good')
  }

  // Import from pasted text or file
  async function handleImport() {
    if (!importText.trim()) {
      showStatus('Paste your vault bundle text first.', 'bad')
      return
    }
    setImporting(true)
    try {
      const bundle = JSON.parse(importText.trim())
      if (!bundle.version) throw new Error('Invalid bundle')

      // Restore all localStorage keys
      if (bundle.data)     localStorage.setItem('vaultData_v3',      bundle.data)
      if (bundle.user)     localStorage.setItem('vaultUser_v1',      bundle.user)
      if (bundle.settings) localStorage.setItem('vaultSettings_v1',  bundle.settings)
      if (bundle.noPw)     localStorage.setItem('vault_no_pw_data',  bundle.noPw)

      showStatus('✅ Vault imported! Reloading app...', 'good')
      setTimeout(() => window.location.reload(), 1500)
    } catch (e) {
      showStatus('Invalid vault data. Make sure you pasted the complete export.', 'bad')
    }
    setImporting(false)
  }

  // Import from file
  function handleFileImport(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setImportText(ev.target.result)
      showStatus('File loaded! Click "Import Vault" to restore.', 'good')
    }
    reader.readAsText(file)
  }

  return (
    <div>
      {/* Status message */}
      {status && (
        <div style={{
          padding: '10px 14px', borderRadius: 10, marginBottom: 14,
          fontSize: 12, lineHeight: 1.6,
          background: statusType === 'good' ? 'rgba(74,222,128,0.08)' : statusType === 'bad' ? 'rgba(248,113,113,0.08)' : 'rgba(96,165,250,0.08)',
          border: `1px solid ${statusType === 'good' ? 'rgba(74,222,128,0.3)' : statusType === 'bad' ? 'rgba(248,113,113,0.3)' : 'rgba(96,165,250,0.3)'}`,
          color: statusType === 'good' ? '#4ade80' : statusType === 'bad' ? '#f87171' : '#60a5fa',
        }}>
          {status}
        </div>
      )}

      {/* Mode selector */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <ModeBtn active={mode === 'export'} onClick={() => { setMode('export'); setQrUrl('') }}>
          📤 Export / Share
        </ModeBtn>
        <ModeBtn active={mode === 'import'} onClick={() => { setMode('import'); setImportText('') }}>
          📥 Import
        </ModeBtn>
      </div>

      {/* EXPORT MODE */}
      {mode === 'export' && (
        <div>
          <div style={S.infoBox}>
            <div style={S.infoTitle}>📱 How to sync to another device</div>
            <ol style={S.steps}>
              <li>Install My Vault on your other device</li>
              <li>Open it and complete registration</li>
              <li>Go to Settings → QR Sync → Import</li>
              <li>Choose "Paste text" and paste the bundle</li>
              <li>Your data will appear instantly</li>
            </ol>
            <div style={{ fontSize: 11, color: '#f87171', marginTop: 8 }}>
              ⚠️ Your data is encrypted. Anyone who gets this bundle still needs your password to read it.
            </div>
          </div>

          {/* QR Code display */}
          {qrUrl && (
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <div style={S.qrWrap}>
                <img src={qrUrl} alt="Vault QR Code" style={{ width: 240, height: 240, borderRadius: 8 }}/>
              </div>
              <div style={{ fontSize: 11, color: '#4a5260', marginTop: 8 }}>
                Scan this QR with your other device's camera
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <ActionBtn onClick={handleExport} loading={generating} icon="🔳">
              {generating ? 'Generating...' : 'Generate QR Code'}
            </ActionBtn>
            <ActionBtn onClick={handleFileExport} icon="💾" secondary>
              Export as File (.vaultbundle)
            </ActionBtn>
          </div>

          {/* Text bundle for copy-paste */}
          {qrUrl && (
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 11, color: '#4a5260', marginBottom: 6 }}>
                Or copy this text and paste it on your other device:
              </div>
              <textarea
                readOnly
                value={JSON.stringify({
                  version: 1,
                  ts: Date.now(),
                  data:     localStorage.getItem('vaultData_v3')     || '',
                  user:     localStorage.getItem('vaultUser_v1')     || '',
                  settings: localStorage.getItem('vaultSettings_v1') || '',
                  noPw:     localStorage.getItem('vault_no_pw_data') || '',
                })}
                style={S.textarea}
                onClick={e => e.target.select()}
              />
              <button
                onClick={() => {
                  const bundle = JSON.stringify({
                    version: 1, ts: Date.now(),
                    data:     localStorage.getItem('vaultData_v3')     || '',
                    user:     localStorage.getItem('vaultUser_v1')     || '',
                    settings: localStorage.getItem('vaultSettings_v1') || '',
                    noPw:     localStorage.getItem('vault_no_pw_data') || '',
                  })
                  navigator.clipboard.writeText(bundle)
                  showStatus('Copied! Paste it on your other device in the Import section.', 'good')
                }}
                style={S.copyBtn}
              >
                📋 Copy to Clipboard
              </button>
            </div>
          )}
        </div>
      )}

      {/* IMPORT MODE */}
      {mode === 'import' && (
        <div>
          <div style={S.infoBox}>
            <div style={S.infoTitle}>📲 Import vault from another device</div>
            <div style={{ fontSize: 12, color: '#6b7585', lineHeight: 1.6, marginTop: 6 }}>
              Paste the exported bundle text below, or choose the .vaultbundle file.
              Your existing data will be replaced.
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={S.fileLabel}>
              📁 Choose .vaultbundle file
              <input type="file" accept=".vaultbundle,.json" onChange={handleFileImport} style={{ display: 'none' }}/>
            </label>
          </div>

          <div style={{ fontSize: 11, color: '#4a5260', marginBottom: 6 }}>
            Or paste the bundle text:
          </div>
          <textarea
            value={importText}
            onChange={e => setImportText(e.target.value)}
            placeholder='Paste your vault bundle here...'
            style={{ ...S.textarea, minHeight: 100 }}
          />

          <ActionBtn onClick={handleImport} loading={importing} icon="📥">
            {importing ? 'Importing...' : 'Import Vault'}
          </ActionBtn>

          <div style={{ fontSize: 11, color: '#f87171', marginTop: 10, lineHeight: 1.6 }}>
            ⚠️ This will replace your current vault data. Make sure you have a backup.
          </div>
        </div>
      )}
    </div>
  )
}

function ModeBtn({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, padding: '10px 8px', borderRadius: 10, fontSize: 12, fontWeight: 500,
      background: active ? 'rgba(167,139,250,0.12)' : 'rgba(255,255,255,0.04)',
      border: `1px solid ${active ? 'rgba(167,139,250,0.35)' : 'rgba(255,255,255,0.08)'}`,
      color: active ? '#a78bfa' : '#6b7585',
      cursor: 'pointer', transition: 'all 0.15s',
    }}>
      {children}
    </button>
  )
}

function ActionBtn({ onClick, loading, icon, children, secondary }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      disabled={loading}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: '100%', padding: '12px', borderRadius: 12,
        fontSize: 13, fontWeight: 600, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        background: secondary
          ? (hov ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)')
          : (hov ? 'linear-gradient(135deg,#8b5cf6,#a855f7)' : 'linear-gradient(135deg,#7c3aed,#9333ea)'),
        border: secondary ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.15)',
        color: secondary ? '#8a96a8' : '#fff',
        transform: hov && !loading ? 'translateY(-1px)' : 'none',
        boxShadow: hov && !secondary ? '0 8px 20px rgba(124,58,237,0.35)' : 'none',
        transition: 'all 0.2s', opacity: loading ? 0.7 : 1,
      }}
    >
      {icon} {children}
    </button>
  )
}

const S = {
  infoBox: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 12, padding: '14px', marginBottom: 14,
  },
  infoTitle: { fontSize: 13, fontWeight: 600, color: '#e8ecf3', marginBottom: 8 },
  steps: { fontSize: 12, color: '#6b7585', paddingLeft: 18, lineHeight: 2 },
  qrWrap: {
    display: 'inline-block',
    background: '#111318',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12, padding: 12,
    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
  },
  textarea: {
    width: '100%', background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: 10, color: '#6b7585',
    padding: '10px 12px', fontSize: 10,
    outline: 'none', resize: 'none',
    minHeight: 60, fontFamily: 'monospace',
    marginBottom: 8, lineHeight: 1.4,
  },
  copyBtn: {
    width: '100%', background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10, color: '#8a96a8',
    padding: '10px', fontSize: 12,
    cursor: 'pointer', fontFamily: 'inherit',
  },
  fileLabel: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: 8, padding: '12px',
    background: 'rgba(96,165,250,0.08)',
    border: '1px solid rgba(96,165,250,0.25)',
    borderRadius: 10, color: '#60a5fa',
    fontSize: 13, fontWeight: 500, cursor: 'pointer',
  },
}