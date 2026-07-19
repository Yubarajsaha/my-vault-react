import { useState } from 'react'
import { removeBiometric, isBiometricRegistered, registerBiometric, isBiometricAvailable } from '../biometric'
import { getSettings, saveSettings } from '../store'
import QRSync from './QRSync'

function Toggle({ value, onChange }) {
  return (
    <div onClick={() => onChange(!value)} style={{
      width:46, height:26, borderRadius:13,
      background: value ? 'linear-gradient(135deg,#7c3aed,#a855f7)' : 'rgba(255,255,255,0.1)',
      position:'relative', cursor:'pointer', transition:'background 0.2s',
      border:'1px solid rgba(255,255,255,0.1)', flexShrink:0,
    }}>
      <div style={{
        position:'absolute', width:20, height:20, borderRadius:'50%',
        background:'#fff', top:2, left: value ? 22 : 2,
        transition:'left 0.2s', boxShadow:'0 2px 4px rgba(0,0,0,0.3)',
      }}/>
    </div>
  )
}

function Row({ icon, title, sub, danger, children }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        <div style={{ width:38, height:38, borderRadius:11, background: danger ? 'rgba(248,113,113,0.1)' : 'rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>
          {icon}
        </div>
        <div>
          <div style={{ fontSize:13, fontWeight:500, color: danger ? '#f87171' : '#e8ecf3' }}>{title}</div>
          {sub && <div style={{ fontSize:11, color:'#4a5260', marginTop:2 }}>{sub}</div>}
        </div>
      </div>
      <div style={{ flexShrink:0 }}>{children}</div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom:8 }}>
      <div style={{ fontSize:10, fontWeight:700, color:'#374151', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:4, marginTop:18, paddingLeft:4 }}>
        {title}
      </div>
      <div style={{ background:'rgba(255,255,255,0.04)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:'0 16px' }}>
        {children}
      </div>
    </div>
  )
}

function SmallBtn({ onClick, children, danger }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: danger ? (hov ? 'rgba(248,113,113,0.25)' : 'rgba(248,113,113,0.1)') : (hov ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.06)'),
        border: `1px solid ${danger ? 'rgba(248,113,113,0.3)' : 'rgba(255,255,255,0.1)'}`,
        borderRadius:8, color: danger ? '#f87171' : '#8a96a8',
        padding:'5px 12px', fontSize:11, cursor:'pointer',
        transition:'all 0.15s', whiteSpace:'nowrap',
      }}
    >{children}</button>
  )
}

export default function SettingsPage({ onLock, onClearAll, password, onPasswordSet }) {
  const settings = getSettings()
  const [hasPassword,  setHasPassword]  = useState(settings.hasPassword)
  const [hasBiometric, setHasBiometric] = useState(isBiometricRegistered())
  const [autoLock,     setAutoLock]     = useState(settings.autoLock ?? true)
  const [showSetPw,    setShowSetPw]    = useState(false)
  const [newPw,        setNewPw]        = useState('')
  const [confirmPw,    setConfirmPw]    = useState('')
  const [pwErr,        setPwErr]        = useState('')
  const [pwSuccess,    setPwSuccess]    = useState('')
  const [confirmClear, setConfirmClear] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [bioMsg,       setBioMsg]       = useState('')

  async function handleSetPassword() {
    if (!newPw)             { setPwErr('Enter a password'); return }
    if (newPw.length < 4)   { setPwErr('At least 4 characters'); return }
    if (newPw !== confirmPw){ setPwErr('Passwords do not match'); return }
    setPwErr('')
    await onPasswordSet(newPw)
    saveSettings({ ...getSettings(), hasPassword:true })
    setHasPassword(true)
    setShowSetPw(false)
    setNewPw(''); setConfirmPw('')
    setPwSuccess('Password set! ✅')
    setTimeout(() => setPwSuccess(''), 3000)
  }

  async function handleBiometricToggle(val) {
    if (!val) {
      removeBiometric()
      localStorage.removeItem('vaultBioPw')
      setHasBiometric(false)
    } else {
      const avail = await isBiometricAvailable()
      if (!avail)        { setBioMsg('Biometric not available on this device'); return }
      if (!hasPassword)  { setBioMsg('Set a password first to enable biometric'); return }
      try {
        await registerBiometric()
        localStorage.setItem('vaultBioPw', password)
        setHasBiometric(true)
        setBioMsg('Biometric enabled! ✅')
        setTimeout(() => setBioMsg(''), 3000)
      } catch { setBioMsg('Could not enable. Try again.') }
    }
  }

  function handleClearAll() {
    if (!confirmClear) { setConfirmClear(true); setTimeout(() => setConfirmClear(false), 4000); return }
    onClearAll()
  }

  const inp = { width:'100%', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.09)', borderRadius:10, color:'#e8ecf3', padding:'11px 14px', fontSize:14, outline:'none', marginBottom:10 }

  return (
    <div style={{ paddingBottom:20 }}>

      <div style={{ background:'rgba(255,255,255,0.04)', backdropFilter:'blur(24px)', WebkitBackdropFilter:'blur(24px)', border:'1px solid rgba(255,255,255,0.09)', borderRadius:18, padding:'20px', marginBottom:4, textAlign:'center' }}>
        <div style={{ fontSize:40, marginBottom:8 }}>⚙️</div>
        <div style={{ fontSize:18, fontWeight:700, color:'#f1f5f9', marginBottom:4 }}>Settings</div>
        <div style={{ fontSize:12, color:'#4a5260' }}>Manage your vault preferences</div>
      </div>

      <Section title="Security">
        <Row icon="🔑" title="Master Password" sub={hasPassword ? 'Password is set ✅' : 'No password — tap to set one'}>
          <SmallBtn onClick={() => setShowSetPw(!showSetPw)}>{hasPassword ? 'Change' : 'Set Password'}</SmallBtn>
        </Row>
        {showSetPw && (
          <div style={{ padding:'14px 0' }}>
            <input type="password" placeholder="New password" value={newPw} onChange={e => { setNewPw(e.target.value); setPwErr('') }} style={inp}/>
            <input type="password" placeholder="Confirm password" value={confirmPw} onChange={e => { setConfirmPw(e.target.value); setPwErr('') }} style={{ ...inp, marginBottom:8 }}/>
            {pwErr && <div style={{ color:'#f87171', fontSize:12, marginBottom:8 }}>⚠️ {pwErr}</div>}
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={() => { setShowSetPw(false); setNewPw(''); setConfirmPw(''); setPwErr('') }} style={{ flex:1, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, color:'#8a96a8', padding:'10px', fontSize:13, cursor:'pointer' }}>Cancel</button>
              <button onClick={handleSetPassword} style={{ flex:1, background:'linear-gradient(135deg,#7c3aed,#9333ea)', border:'none', borderRadius:10, color:'#fff', padding:'10px', fontSize:13, fontWeight:600, cursor:'pointer' }}>Save</button>
            </div>
          </div>
        )}
        {pwSuccess && <div style={{ color:'#4ade80', fontSize:12, padding:'8px 0' }}>{pwSuccess}</div>}

        <Row icon="👆" title="Biometric Unlock" sub={hasBiometric ? 'Fingerprint / Face ID active ✅' : 'Enable fingerprint or Face ID'}>
          <Toggle value={hasBiometric} onChange={handleBiometricToggle}/>
        </Row>
        {bioMsg && <div style={{ fontSize:12, color: bioMsg.includes('✅') ? '#4ade80' : '#f87171', padding:'6px 0' }}>{bioMsg}</div>}

        <Row icon="⏱️" title="Auto Lock" sub="Lock when switching apps">
          <Toggle value={autoLock} onChange={v => { setAutoLock(v); saveSettings({ ...getSettings(), autoLock:v }) }}/>
        </Row>
      </Section>

      <Section title="Sync & Backup">
        <Row icon="📱" title="QR Sync" sub="Move vault to another device via QR code">
          <SmallBtn onClick={() => setShowQR(!showQR)}>
            {showQR ? 'Close' : 'Open'}
          </SmallBtn>
        </Row>
        {showQR && (
          <div style={{ padding: '14px 0' }}>
            <QRSync
              docs={[]} photos={[]} secrets={[]}
              profile={{}} activity={[]}
              password={password}
            />
          </div>
        )}
        <Row icon="💾" title="Storage" sub="All data on this device only">
          <span style={{ fontSize: 11, color: '#4ade80' }}>Local ✅</span>
        </Row>
      </Section>

      <Section title="Install App">
        <div style={{ padding:'14px 0', display:'flex', flexDirection:'column', gap:8 }}>
          {[
            { icon:'🍎', label:'iPhone — Safari → Share → Add to Home Screen', color:'#60a5fa' },
            { icon:'🤖', label:'Android — Chrome → Menu → Add to Home Screen',  color:'#4ade80' },
            { icon:'🪟', label:'Windows — Chrome → Install icon in address bar', color:'#a78bfa' },
          ].map((item,i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:10, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:10, padding:'10px 12px' }}>
              <span style={{ fontSize:20 }}>{item.icon}</span>
              <span style={{ fontSize:12, color:item.color, lineHeight:1.5 }}>{item.label}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="About">
        <Row icon="ℹ️" title="Version" sub="My Vault v1.0.0"><span style={{ fontSize:11, color:'#4a5260' }}>v1.0.0</span></Row>
        <Row icon="🔒" title="Encryption" sub="AES-256-GCM"><span style={{ fontSize:11, color:'#4ade80' }}>Active</span></Row>
        <Row icon="☁️" title="Cloud Sync" sub="Never — local only"><span style={{ fontSize:11, color:'#f87171' }}>Off</span></Row>
      </Section>

      <Section title="Danger Zone">
        <Row icon="🔒" title="Lock Vault" sub="Return to login screen" danger>
          <SmallBtn onClick={onLock} danger>Lock</SmallBtn>
        </Row>
        <Row icon="🗑️" title="Clear All Data" sub="Permanently delete everything" danger>
          <SmallBtn onClick={handleClearAll} danger>{confirmClear ? 'Tap again!' : 'Clear All'}</SmallBtn>
        </Row>
      </Section>

    </div>
  )
}