import { useState, useEffect } from 'react'
import {
  isBiometricAvailable,
  isBiometricRegistered,
  registerBiometric,
  authenticateWithBiometric,
} from '../biometric'

export default function LoginScreen({ onUnlock }) {
  const [pw,           setPw]           = useState('')
  const [err,          setErr]          = useState('')
  const [loading,      setLoading]      = useState(false)
  const [showPw,       setShowPw]       = useState(false)
  const [focused,      setFocused]      = useState(false)
  const [bioAvailable, setBioAvailable] = useState(false)
  const [bioRegistered,setBioRegistered]= useState(false)
  const [bioLoading,   setBioLoading]   = useState(false)
  const [mode,         setMode]         = useState('password') // 'password' | 'biometric'

  useEffect(() => {
    async function check() {
      const available   = await isBiometricAvailable()
      const registered  = isBiometricRegistered()
      setBioAvailable(available)
      setBioRegistered(registered)
      // If biometric is set up — show biometric screen first
      if (available && registered) setMode('biometric')
    }
    check()
  }, [])

  // Unlock with password
  async function handleUnlock() {
    if (!pw) { setErr('Enter your master password'); return }
    setLoading(true); setErr('')
    try {
      await onUnlock(pw)
    } catch {
      setErr('Wrong password. Try again.')
      setLoading(false)
    }
  }

  // Unlock with biometric
  async function handleBiometric() {
    setBioLoading(true); setErr('')
    try {
      const passed = await authenticateWithBiometric()
      if (passed) {
        // Biometric passed — get password from secure storage
        const savedPw = localStorage.getItem('vaultBioPw')
        if (!savedPw) {
          setErr('Biometric linked password not found. Use password.')
          setBioLoading(false)
          setMode('password')
          return
        }
        await onUnlock(savedPw)
      }
    } catch (e) {
      if (e.name === 'NotAllowedError') {
        setErr('Biometric cancelled or timed out.')
      } else {
        setErr('Biometric failed. Try your password.')
      }
      setBioLoading(false)
    }
  }

  // Setup biometric after password unlock
  async function handleSetupBiometric() {
    if (!pw) { setErr('Enter your password first to link biometric'); return }
    setLoading(true); setErr('')
    try {
      await onUnlock(pw) // verify password first
      await registerBiometric()
      // Save password encrypted reference so biometric can unlock
      localStorage.setItem('vaultBioPw', pw)
      setBioRegistered(true)
      setMode('biometric')
    } catch (e) {
      setErr('Could not set up biometric. Try again.')
    }
    setLoading(false)
  }

  return (
    <div style={S.wrap}>
      <div style={S.blob1} />
      <div style={S.blob2} />
      <div style={S.blob3} />

      {[...Array(5)].map((_, i) => (
        <div key={i} style={{
          ...S.particle,
          width:  [4,5,3,6,4][i],
          height: [4,5,3,6,4][i],
          top:    ['15%','72%','42%','85%','28%'][i],
          left:   ['18%','78%','58%','28%','88%'][i],
          opacity: [0.3,0.2,0.25,0.15,0.2][i],
          animationDelay: `${i * 0.7}s`,
        }} />
      ))}

      <div style={S.card}>
        <div style={S.shineLine} />

        {/* Logo */}
        <div style={S.logoWrap}>
          <div style={S.logoRing2} />
          <div style={S.logoRing1} />
          <div style={S.logo}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
        </div>

        <h1 style={S.title}>My Vault</h1>
        <p style={S.sub}>Your private encrypted space</p>

        {/* ── BIOMETRIC MODE ── */}
        {mode === 'biometric' && (
          <div style={{ textAlign: 'center' }}>
            <div style={S.bioHint}>
              Use your fingerprint or face to unlock
            </div>

            {/* Big biometric button */}
            <BiometricButton
              loading={bioLoading}
              onClick={handleBiometric}
            />

            {err && <div style={S.errBox}>{err}</div>}

            <button
              onClick={() => { setMode('password'); setErr('') }}
              style={S.switchBtn}
            >
              Use password instead →
            </button>
          </div>
        )}

        {/* ── PASSWORD MODE ── */}
        {mode === 'password' && (
          <>
            <div style={S.divider}>
              <div style={S.divLine} />
              <span style={S.divText}>MASTER PASSWORD</span>
              <div style={S.divLine} />
            </div>

            {/* Password input */}
            <div style={{ position: 'relative', marginBottom: 14 }}>
              <div style={{
                ...S.inputWrap,
                borderColor: focused
                  ? 'rgba(167,139,250,0.5)'
                  : err ? 'rgba(248,113,113,0.4)'
                  : 'rgba(255,255,255,0.09)',
                boxShadow: focused ? '0 0 0 3px rgba(167,139,250,0.1)' : 'none',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4a5260" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0 }}>
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
            </div>

            {err && (
              <div style={S.errBox}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {err}
              </div>
            )}

            {/* Unlock button */}
            <UnlockButton onClick={handleUnlock} loading={loading} />

            {/* Setup biometric if available but not registered */}
            {bioAvailable && !bioRegistered && (
              <button onClick={handleSetupBiometric} style={S.bioSetupBtn}>
                <FingerprintIcon size={16} color="#a78bfa" />
                Set up fingerprint / Face ID unlock
              </button>
            )}

            {/* Switch to biometric if registered */}
            {bioAvailable && bioRegistered && (
              <button
                onClick={() => { setMode('biometric'); setErr('') }}
                style={S.switchBtn}
              >
                <FingerprintIcon size={14} color="#a78bfa" />
                Use biometric instead →
              </button>
            )}
          </>
        )}

        {/* Security badges */}
        <div style={S.badges}>
          {[
            '🔒 AES-256',
            '📵 No Cloud',
            bioAvailable ? '👆 Biometric' : '🔑 Password',
          ].map((b, i) => (
            <div key={i} style={S.badge}>{b}</div>
          ))}
        </div>

        <p style={S.footer}>
          Encrypted locally. No servers. No tracking.
        </p>
      </div>

      <style>{`
        @keyframes float {
          0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)}
        }
        @keyframes pulse-ring {
          0%{transform:scale(0.95);opacity:0.6}
          50%{transform:scale(1.05);opacity:0.2}
          100%{transform:scale(0.95);opacity:0.6}
        }
        @keyframes bio-pulse {
          0%,100%{box-shadow:0 0 0 0 rgba(167,139,250,0.4)}
          50%{box-shadow:0 0 0 16px rgba(167,139,250,0)}
        }
        @keyframes spin {
          from{transform:rotate(0deg)} to{transform:rotate(360deg)}
        }
      `}</style>
    </div>
  )
}

// ── Big fingerprint button ──
function BiometricButton({ onClick, loading }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      disabled={loading}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 100, height: 100, borderRadius: '50%',
        background: hov
          ? 'linear-gradient(135deg, #6d28d9, #9333ea)'
          : 'linear-gradient(135deg, #4c1d95, #7c3aed)',
        border: '2px solid rgba(255,255,255,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '20px auto 24px',
        cursor: 'pointer',
        animation: !loading ? 'bio-pulse 2.5s ease-in-out infinite' : 'none',
        transform: hov ? 'scale(1.06)' : 'scale(1)',
        transition: 'transform 0.2s, background 0.2s',
        opacity: loading ? 0.7 : 1,
      }}
    >
      {loading
        ? <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" style={{ animation:'spin 1s linear infinite' }}>
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
          </svg>
        : <FingerprintIcon size={44} color="white" />
      }
    </button>
  )
}

// ── Fingerprint SVG icon ──
function FingerprintIcon({ size = 24, color = 'white' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
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

// ── Unlock button ──
function UnlockButton({ onClick, loading }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      disabled={loading}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: '100%',
        background: hov
          ? 'linear-gradient(135deg, #8b5cf6, #a855f7, #c084fc)'
          : 'linear-gradient(135deg, #7c3aed, #9333ea)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: 14, color: '#fff',
        padding: '14px', fontSize: 15, fontWeight: 600,
        letterSpacing: '0.02em', marginBottom: 14,
        transform: hov && !loading ? 'translateY(-2px)' : 'none',
        boxShadow: hov
          ? '0 12px 28px rgba(124,58,237,0.5)'
          : '0 6px 16px rgba(124,58,237,0.35)',
        transition: 'all 0.2s ease',
        opacity: loading ? 0.75 : 1,
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', gap: 8,
        cursor: 'pointer',
      }}
    >
      {loading
        ? <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" style={{ animation:'spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>Unlocking...</>
        : <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>Unlock Vault</>
      }
    </button>
  )
}

const S = {
  wrap: {
    height: '100vh', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    background: '#060810', position: 'relative',
    overflow: 'hidden', padding: '20px',
  },
  blob1: { position:'absolute', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 65%)', top:'-150px', left:'50%', transform:'translateX(-50%)', pointerEvents:'none' },
  blob2: { position:'absolute', width:300, height:300, borderRadius:'50%', background:'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 65%)', bottom:'-80px', right:'-60px', pointerEvents:'none' },
  blob3: { position:'absolute', width:200, height:200, borderRadius:'50%', background:'radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 65%)', bottom:'20%', left:'-40px', pointerEvents:'none' },
  particle: { position:'absolute', borderRadius:'50%', background:'rgba(167,139,250,0.6)', animation:'float 4s ease-in-out infinite', pointerEvents:'none' },
  card: {
    width:'100%', maxWidth:400,
    background:'rgba(255,255,255,0.04)',
    backdropFilter:'blur(28px)', WebkitBackdropFilter:'blur(28px)',
    border:'1px solid rgba(255,255,255,0.1)', borderRadius:24,
    padding:'36px 28px 28px', textAlign:'center',
    boxShadow:'0 24px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
    position:'relative', zIndex:1, overflow:'hidden',
  },
  shineLine: { position:'absolute', top:0, left:'10%', right:'10%', height:1, background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)', pointerEvents:'none' },
  logoWrap: { position:'relative', display:'inline-block', marginBottom:18 },
  logo: { width:72, height:72, borderRadius:'50%', background:'linear-gradient(135deg,#4c1d95,#7c3aed)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 8px 24px rgba(124,58,237,0.5)', position:'relative', zIndex:1, margin:'0 auto' },
  logoRing1: { position:'absolute', width:88, height:88, borderRadius:'50%', border:'1px solid rgba(124,58,237,0.3)', top:'50%', left:'50%', transform:'translate(-50%,-50%)', animation:'pulse-ring 3s ease-in-out infinite' },
  logoRing2: { position:'absolute', width:104, height:104, borderRadius:'50%', border:'1px solid rgba(124,58,237,0.15)', top:'50%', left:'50%', transform:'translate(-50%,-50%)', animation:'pulse-ring 3s ease-in-out infinite 0.5s' },
  title: { fontSize:28, fontWeight:700, color:'#f1f5f9', marginBottom:6, letterSpacing:'-0.02em' },
  sub:   { fontSize:13, color:'#4a5260', marginBottom:24 },
  bioHint: { fontSize:13, color:'#6b7585', marginBottom:4, lineHeight:1.6 },
  divider: { display:'flex', alignItems:'center', gap:10, marginBottom:18 },
  divLine: { flex:1, height:1, background:'rgba(255,255,255,0.07)' },
  divText: { fontSize:9, fontWeight:700, color:'#374151', letterSpacing:'0.15em', whiteSpace:'nowrap' },
  inputWrap: {
    display:'flex', alignItems:'center', gap:10,
    background:'rgba(255,255,255,0.05)',
    backdropFilter:'blur(10px)', WebkitBackdropFilter:'blur(10px)',
    border:'1px solid rgba(255,255,255,0.09)',
    borderRadius:12, padding:'13px 14px',
    transition:'border-color 0.2s, box-shadow 0.2s',
  },
  input: { flex:1, background:'none', border:'none', color:'#f1f5f9', fontSize:14, outline:'none' },
  eyeBtn: { background:'none', border:'none', display:'flex', alignItems:'center', padding:0, cursor:'pointer', flexShrink:0 },
  errBox: {
    display:'flex', alignItems:'center', gap:8,
    background:'rgba(248,113,113,0.08)', border:'1px solid rgba(248,113,113,0.25)',
    borderRadius:10, padding:'10px 14px', color:'#f87171',
    fontSize:12, marginBottom:14, textAlign:'left',
  },
  bioSetupBtn: {
    width:'100%', display:'flex', alignItems:'center',
    justifyContent:'center', gap:8,
    background:'rgba(167,139,250,0.08)',
    border:'1px solid rgba(167,139,250,0.25)',
    borderRadius:12, color:'#a78bfa',
    padding:'12px', fontSize:13, fontWeight:500,
    marginBottom:14, cursor:'pointer', transition:'all 0.2s',
  },
  switchBtn: {
    display:'flex', alignItems:'center', justifyContent:'center', gap:6,
    background:'none', border:'none', color:'#6b7585',
    fontSize:12, cursor:'pointer', marginBottom:16,
    width:'100%', padding:'8px', transition:'color 0.15s',
  },
  badges: { display:'flex', justifyContent:'center', gap:6, flexWrap:'wrap', marginBottom:16 },
  badge: {
    background:'rgba(255,255,255,0.04)',
    backdropFilter:'blur(8px)', WebkitBackdropFilter:'blur(8px)',
    border:'1px solid rgba(255,255,255,0.08)',
    borderRadius:20, padding:'4px 10px',
    fontSize:10, color:'#6b7585', fontWeight:500,
  },
  footer: { fontSize:11, color:'#374151', lineHeight:1.7 },
}