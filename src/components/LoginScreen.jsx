import { useState, useEffect } from 'react'
import { isBiometricAvailable, isBiometricRegistered, authenticateWithBiometric } from '../biometric'

export default function LoginScreen({ user, onUnlock }) {
  const [pw,       setPw]       = useState('')
  const [err,      setErr]      = useState('')
  const [loading,  setLoading]  = useState(false)
  const [showPw,   setShowPw]   = useState(false)
  const [focused,  setFocused]  = useState(false)
  const [bioAvail, setBioAvail] = useState(false)
  const [bioReg,   setBioReg]   = useState(false)
  const [bioLoad,  setBioLoad]  = useState(false)
  const [mode,     setMode]     = useState('password')

  useEffect(() => {
    async function check() {
      const avail = await isBiometricAvailable()
      const reg   = isBiometricRegistered()
      setBioAvail(avail); setBioReg(reg)
      if (avail && reg) setMode('biometric')
    }
    check()
  }, [])

  async function handleUnlock() {
    if (!pw) { setErr('Enter your password'); return }
    setLoading(true); setErr('')
    try { await onUnlock(pw) }
    catch { setErr('Wrong password. Try again.'); setLoading(false) }
  }

  async function handleBiometric() {
    setBioLoad(true); setErr('')
    try {
      const ok = await authenticateWithBiometric()
      if (ok) {
        const saved = localStorage.getItem('vaultBioPw')
        if (!saved) { setErr('Biometric not linked. Use password.'); setBioLoad(false); setMode('password'); return }
        await onUnlock(saved)
      }
    } catch(e) {
      setErr(e.name === 'NotAllowedError' ? 'Cancelled. Try again.' : 'Failed. Use password.')
      setBioLoad(false)
    }
  }

  return (
    <div style={S.wrap}>
      <div style={S.blob1}/><div style={S.blob2}/>

      <div style={S.card}>
        <div style={S.shine}/>

        <div style={S.avatarWrap}>
          <div style={S.avatar}>{user?.avatar || '🔐'}</div>
          <div style={S.avatarRing}/>
        </div>

        <p style={S.greeting}>Welcome back,</p>
        <h1 style={S.name}>{user?.name || 'User'}</h1>
        <p style={S.sub}>Your vault is waiting</p>

        {mode === 'biometric' && (
          <div style={{ textAlign:'center' }}>
            <p style={S.bioHint}>Touch to unlock with biometric</p>
            <button onClick={handleBiometric} disabled={bioLoad} style={{
              ...S.bioBtn,
              animation: !bioLoad ? 'bio-pulse 2.5s ease-in-out infinite' : 'none',
            }}>
              {bioLoad
                ? <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" style={{animation:'spin 1s linear infinite'}}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                : <FingerprintIcon size={42}/>
              }
            </button>
            {err && <div style={S.err}>{err}</div>}
            <button onClick={() => { setMode('password'); setErr('') }} style={S.switchBtn}>
              Use password instead
            </button>
          </div>
        )}

        {mode === 'password' && (
          <>
            <div style={{
              ...S.inputWrap,
              borderColor: focused ? 'rgba(167,139,250,0.5)' : err ? 'rgba(248,113,113,0.4)' : 'rgba(255,255,255,0.09)',
              boxShadow: focused ? '0 0 0 3px rgba(167,139,250,0.1)' : 'none',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4a5260" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input
                type={showPw ? 'text' : 'password'}
                value={pw}
                onChange={e => { setPw(e.target.value); setErr('') }}
                onKeyDown={e => e.key === 'Enter' && handleUnlock()}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Master password"
                style={S.input}
                autoFocus
              />
              <button onClick={() => setShowPw(!showPw)} style={S.eyeBtn}>
                {showPw
                  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4a5260" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4a5260" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>

            {err && (
              <div style={S.err}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {err}
              </div>
            )}

            <button onClick={handleUnlock} disabled={loading} style={S.unlockBtn}>
              {loading
                ? <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" style={{animation:'spin 1s linear infinite'}}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Unlocking...</>
                : <>🔓 Unlock Vault</>
              }
            </button>

            {bioAvail && bioReg && (
              <button onClick={() => { setMode('biometric'); setErr('') }} style={S.switchBtn}>
                <FingerprintIcon size={14}/> Use biometric instead
              </button>
            )}
          </>
        )}
      </div>

      <style>{`
        @keyframes bio-pulse { 0%,100%{box-shadow:0 0 0 0 rgba(167,139,250,0.4)} 50%{box-shadow:0 0 0 16px rgba(167,139,250,0)} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>
    </div>
  )
}

function FingerprintIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4"/>
      <path d="M14 13.12c0 2.38 0 6.38-1 8.88"/>
      <path d="M17.29 21.02c.12-.6.43-2.3.5-3.02"/>
      <path d="M2 12a10 10 0 0 1 18-6"/>
      <path d="M2 17c1 .5 2.1.86 3 1"/>
      <path d="M20 12c.3 2.17.23 4.27-.04 5.04"/>
      <path d="M7 12.09C7 13.41 6.19 17.4 5 19"/>
      <path d="M7.5 7.27A5 5 0 0 1 17 12"/>
    </svg>
  )
}

const S = {
  wrap: { height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#060810', position:'relative', overflow:'hidden', padding:'20px' },
  blob1: { position:'absolute', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle,rgba(124,58,237,0.18) 0%,transparent 65%)', top:'-150px', left:'50%', transform:'translateX(-50%)', pointerEvents:'none' },
  blob2: { position:'absolute', width:300, height:300, borderRadius:'50%', background:'radial-gradient(circle,rgba(59,130,246,0.1) 0%,transparent 65%)', bottom:'-80px', right:'-60px', pointerEvents:'none' },
  card: { width:'100%', maxWidth:380, background:'rgba(255,255,255,0.04)', backdropFilter:'blur(28px)', WebkitBackdropFilter:'blur(28px)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:24, padding:'32px 28px', textAlign:'center', boxShadow:'0 24px 64px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.1)', position:'relative', zIndex:1, overflow:'hidden' },
  shine: { position:'absolute', top:0, left:'10%', right:'10%', height:1, background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)', pointerEvents:'none' },
  avatarWrap: { position:'relative', display:'inline-block', marginBottom:14 },
  avatar: { width:72, height:72, borderRadius:'50%', background:'linear-gradient(135deg,#4c1d95,#7c3aed)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, margin:'0 auto', boxShadow:'0 8px 24px rgba(124,58,237,0.4)', position:'relative', zIndex:1 },
  avatarRing: { position:'absolute', width:88, height:88, borderRadius:'50%', border:'1px solid rgba(124,58,237,0.25)', top:'50%', left:'50%', transform:'translate(-50%,-50%)' },
  greeting: { fontSize:14, fontWeight:400, color:'#6b7585', marginBottom:2 },
  name:     { fontSize:24, fontWeight:700, color:'#f1f5f9', marginBottom:4, letterSpacing:'-0.02em' },
  sub:      { fontSize:12, color:'#374151', marginBottom:22 },
  bioHint:  { fontSize:13, color:'#6b7585', marginBottom:8 },
  bioBtn: { width:88, height:88, borderRadius:'50%', background:'linear-gradient(135deg,#4c1d95,#7c3aed)', border:'2px solid rgba(255,255,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', cursor:'pointer', transition:'transform 0.2s' },
  inputWrap: { display:'flex', alignItems:'center', gap:10, background:'rgba(255,255,255,0.05)', backdropFilter:'blur(10px)', WebkitBackdropFilter:'blur(10px)', border:'1px solid rgba(255,255,255,0.09)', borderRadius:12, padding:'13px 14px', marginBottom:14, transition:'all 0.2s' },
  input: { flex:1, background:'none', border:'none', color:'#f1f5f9', fontSize:14, outline:'none' },
  eyeBtn: { background:'none', border:'none', display:'flex', alignItems:'center', padding:0, cursor:'pointer' },
  err: { display:'flex', alignItems:'center', gap:6, background:'rgba(248,113,113,0.08)', border:'1px solid rgba(248,113,113,0.25)', borderRadius:10, padding:'10px 14px', color:'#f87171', fontSize:12, marginBottom:14, textAlign:'left' },
  unlockBtn: { width:'100%', background:'linear-gradient(135deg,#7c3aed,#9333ea)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:14, color:'#fff', padding:'14px', fontSize:15, fontWeight:600, marginBottom:14, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, boxShadow:'0 6px 16px rgba(124,58,237,0.35)', transition:'all 0.2s' },
  switchBtn: { background:'none', border:'none', color:'#6b7585', fontSize:12, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6, width:'100%', padding:'8px' },
}