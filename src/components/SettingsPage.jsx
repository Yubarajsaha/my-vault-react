import { useState } from 'react'
import { removeBiometric, isBiometricRegistered } from '../biometric'

function SettingRow({ icon, title, sub, children, danger }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 0',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: danger ? 'rgba(248,113,113,0.1)' : 'rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, flexShrink: 0,
        }}>
          {icon}
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: danger ? '#f87171' : '#e8ecf3' }}>
            {title}
          </div>
          {sub && <div style={{ fontSize: 11, color: '#4a5260', marginTop: 2 }}>{sub}</div>}
        </div>
      </div>
      <div>{children}</div>
    </div>
  )
}

function Toggle({ value, onChange }) {
  return (
    <div
      onClick={() => onChange(!value)}
      style={{
        width: 44, height: 24, borderRadius: 12,
        background: value ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : 'rgba(255,255,255,0.1)',
        position: 'relative', cursor: 'pointer',
        transition: 'background 0.2s',
        border: '1px solid rgba(255,255,255,0.1)',
        flexShrink: 0,
      }}
    >
      <div style={{
        position: 'absolute',
        width: 18, height: 18, borderRadius: '50%',
        background: '#fff',
        top: 2,
        left: value ? 22 : 2,
        transition: 'left 0.2s',
        boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
      }} />
    </div>
  )
}

function SectionTitle({ title }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 700, color: '#374151',
      textTransform: 'uppercase', letterSpacing: '0.1em',
      marginBottom: 4, marginTop: 20,
    }}>
      {title}
    </div>
  )
}

export default function SettingsPage({ onLock, onClearAll }) {
  const [bioEnabled,    setBioEnabled]    = useState(isBiometricRegistered())
  const [darkMode,      setDarkMode]      = useState(true)
  const [autoLock,      setAutoLock]      = useState(true)
  const [notifications, setNotifications] = useState(false)
  const [confirmClear,  setConfirmClear]  = useState(false)
  const [showAbout,     setShowAbout]     = useState(false)

  function handleBioToggle(val) {
    if (!val) {
      removeBiometric()
      localStorage.removeItem('vaultBioPw')
      setBioEnabled(false)
    } else {
      alert('Go to Lock screen and use "Set up fingerprint / Face ID" button to enable biometric.')
    }
  }

  function handleClearAll() {
    if (!confirmClear) {
      setConfirmClear(true)
      setTimeout(() => setConfirmClear(false), 4000)
      return
    }
    localStorage.clear()
    onClearAll()
  }

  const glass = {
    background: 'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: 16, padding: '0 16px',
    marginBottom: 4,
  }

  return (
    <div style={{ paddingBottom: 20 }}>

      {/* Header */}
      <div style={{
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.09)',
        borderRadius: 16, padding: '20px',
        marginBottom: 16, textAlign: 'center',
      }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>⚙️</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>Settings</div>
        <div style={{ fontSize: 12, color: '#4a5260' }}>Manage your vault preferences</div>
      </div>

      {/* Security */}
      <SectionTitle title="Security" />
      <div style={glass}>
        <SettingRow
          icon="👆"
          title="Biometric Unlock"
          sub="Fingerprint or Face ID"
        >
          <Toggle value={bioEnabled} onChange={handleBioToggle} />
        </SettingRow>
        <SettingRow
          icon="⏱️"
          title="Auto Lock"
          sub="Lock when app goes to background"
        >
          <Toggle value={autoLock} onChange={setAutoLock} />
        </SettingRow>
        <SettingRow
          icon="🔑"
          title="Change Password"
          sub="Update your master password"
        >
          <button style={S.smallBtn} onClick={() => alert('Coming soon — change password feature')}>
            Change
          </button>
        </SettingRow>
      </div>

      {/* Appearance */}
      <SectionTitle title="Appearance" />
      <div style={glass}>
        <SettingRow
          icon="🌙"
          title="Dark Mode"
          sub="Always on for best experience"
        >
          <Toggle value={darkMode} onChange={setDarkMode} />
        </SettingRow>
        <SettingRow
          icon="🌐"
          title="Language"
          sub="English"
        >
          <button style={S.smallBtn}>English</button>
        </SettingRow>
      </div>

      {/* Notifications */}
      <SectionTitle title="Notifications" />
      <div style={glass}>
        <SettingRow
          icon="🔔"
          title="Push Notifications"
          sub="Vault activity alerts"
        >
          <Toggle value={notifications} onChange={setNotifications} />
        </SettingRow>
      </div>

      {/* Storage */}
      <SectionTitle title="Storage" />
      <div style={glass}>
        <SettingRow
          icon="💾"
          title="Storage Location"
          sub="This device only — never cloud"
        >
          <span style={{ fontSize: 11, color: '#4ade80' }}>Local ✅</span>
        </SettingRow>
        <SettingRow
          icon="📤"
          title="Export Vault"
          sub="Download encrypted backup file"
        >
          <button style={S.smallBtn} onClick={() => alert('Coming soon — export feature')}>
            Export
          </button>
        </SettingRow>
        <SettingRow
          icon="📥"
          title="Import Vault"
          sub="Restore from backup file"
        >
          <button style={S.smallBtn} onClick={() => alert('Coming soon — import feature')}>
            Import
          </button>
        </SettingRow>
      </div>

      {/* About */}
      <SectionTitle title="About" />
      <div style={glass}>
        <SettingRow icon="ℹ️" title="Version" sub="My Vault v1.0.0">
          <span style={{ fontSize: 11, color: '#4a5260' }}>v1.0.0</span>
        </SettingRow>
        <SettingRow icon="🔒" title="Encryption" sub="AES-256-GCM via Web Crypto API">
          <span style={{ fontSize: 11, color: '#4ade80' }}>Active</span>
        </SettingRow>
        <SettingRow icon="☁️" title="Cloud Sync" sub="Never — your data stays local">
          <span style={{ fontSize: 11, color: '#f87171' }}>Off</span>
        </SettingRow>
        <SettingRow icon="📱" title="Install App" sub="Add to home screen for best experience">
          <button style={S.smallBtn} onClick={() => alert('Open this app in Safari/Chrome and use "Add to Home Screen"')}>
            Install
          </button>
        </SettingRow>
        <SettingRow
          icon="⭐"
          title="Rate App"
          sub="Share your experience"
        >
          <button style={S.smallBtn}>⭐ Rate</button>
        </SettingRow>
      </div>

      {/* Install links */}
      <SectionTitle title="Install on your device" />
      <div style={{
        ...glass,
        padding: '16px',
        display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        {[
          { icon: '🍎', label: 'iPhone — Safari → Share → Add to Home Screen', color: '#60a5fa' },
          { icon: '🤖', label: 'Android — Chrome → Menu → Add to Home Screen',  color: '#4ade80' },
          { icon: '🪟', label: 'Windows — Chrome → Install icon in address bar', color: '#a78bfa' },
        ].map((item, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 10, padding: '10px 12px',
          }}>
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            <span style={{ fontSize: 12, color: item.color, lineHeight: 1.5 }}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Danger zone */}
      <SectionTitle title="Danger Zone" />
      <div style={{ ...glass, marginBottom: 16 }}>
        <SettingRow
          icon="🔒"
          title="Lock Vault"
          sub="Return to login screen"
          danger
        >
          <button style={{ ...S.smallBtn, ...S.dangerBtn }} onClick={onLock}>
            Lock
          </button>
        </SettingRow>
        <SettingRow
          icon="🗑️"
          title="Clear All Data"
          sub="Permanently delete everything"
          danger
        >
          <button
            style={{
              ...S.smallBtn,
              ...S.dangerBtn,
              background: confirmClear ? 'rgba(248,113,113,0.3)' : 'rgba(248,113,113,0.1)',
            }}
            onClick={handleClearAll}
          >
            {confirmClear ? 'Tap again!' : 'Clear'}
          </button>
        </SettingRow>
      </div>

    </div>
  )
}

const S = {
  smallBtn: {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8, color: '#8a96a8',
    padding: '5px 12px', fontSize: 11,
    cursor: 'pointer', transition: 'all 0.15s',
    whiteSpace: 'nowrap',
  },
  dangerBtn: {
    background: 'rgba(248,113,113,0.1)',
    border: '1px solid rgba(248,113,113,0.25)',
    color: '#f87171',
  },
}