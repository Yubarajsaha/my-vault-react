import { useState } from 'react'

const AVATARS = ['🦁','🐯','🦊','🐺','🦅','🦋','🐉','⚡','🌊','🔥','🌙','⭐']

export default function RegisterScreen({ onRegister }) {
  const [step,   setStep]   = useState(1)
  const [name,   setName]   = useState('')
  const [avatar, setAvatar] = useState('🦁')
  const [err,    setErr]    = useState('')

  function handleNext() {
    if (!name.trim())        { setErr('Please enter your name'); return }
    if (name.trim().length < 2) { setErr('Name must be at least 2 characters'); return }
    setErr(''); setStep(2)
  }

  function handleRegister() {
    onRegister({ name: name.trim(), avatar, registeredAt: Date.now() })
  }

  return (
    <div style={S.wrap}>
      <div style={S.blob1}/><div style={S.blob2}/><div style={S.blob3}/>

      <div style={S.card}>
        <div style={S.shine}/>

        {step === 1 && (
          <>
            <div style={S.logoWrap}>
              <div style={S.logoRing2}/><div style={S.logoRing1}/>
              <div style={S.logo}>🔐</div>
            </div>
            <h1 style={S.title}>Welcome to Vault</h1>
            <p style={S.sub}>Your private encrypted space — no cloud, no tracking</p>

            <div style={S.divider}>
              <div style={S.divLine}/>
              <span style={S.divText}>CREATE YOUR VAULT</span>
              <div style={S.divLine}/>
            </div>

            <div style={S.fieldLabel}>What's your name?</div>
            <div style={{ ...S.inputWrap, borderColor: err ? 'rgba(248,113,113,0.4)' : 'rgba(255,255,255,0.09)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4a5260" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <input
                value={name}
                onChange={e => { setName(e.target.value); setErr('') }}
                onKeyDown={e => e.key === 'Enter' && handleNext()}
                placeholder="Enter your name"
                style={S.input}
                autoFocus
              />
            </div>
            {err && <div style={S.err}>⚠️ {err}</div>}

            <button onClick={handleNext} style={S.btn}>Continue →</button>

            <div style={S.badges}>
              {['🔒 AES-256','📵 No Cloud','👆 Biometric'].map((b,i) => (
                <div key={i} style={S.badge}>{b}</div>
              ))}
            </div>
            <p style={S.footer}>
              No password required to start.<br/>
              Set one later in Settings if you want.
            </p>
          </>
        )}

        {step === 2 && (
          <>
            <div style={{ fontSize:56, marginBottom:12, lineHeight:1 }}>{avatar}</div>
            <h1 style={S.title}>Choose your avatar</h1>
            <p style={S.sub}>Hi {name}! Pick an icon for your vault</p>

            <div style={S.avatarGrid}>
              {AVATARS.map(a => (
                <button key={a} onClick={() => setAvatar(a)} style={{
                  ...S.avatarBtn,
                  background: avatar === a ? 'rgba(167,139,250,0.2)' : 'rgba(255,255,255,0.04)',
                  border: avatar === a ? '2px solid rgba(167,139,250,0.6)' : '1px solid rgba(255,255,255,0.08)',
                  transform: avatar === a ? 'scale(1.1)' : 'scale(1)',
                }}>
                  {a}
                </button>
              ))}
            </div>

            <button onClick={handleRegister} style={S.btn}>
              Create My Vault 🔐
            </button>
            <button onClick={() => setStep(1)} style={S.backBtn}>← Back</button>
          </>
        )}
      </div>

      <style>{`
        @keyframes pulse-ring {
          0%  { transform: translate(-50%,-50%) scale(0.95); opacity: 0.5; }
          50% { transform: translate(-50%,-50%) scale(1.05); opacity: 0.15; }
          100%{ transform: translate(-50%,-50%) scale(0.95); opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}

const S = {
  wrap: { height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#060810', position:'relative', overflow:'hidden', padding:'20px' },
  blob1: { position:'absolute', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle,rgba(124,58,237,0.18) 0%,transparent 65%)', top:'-150px', left:'50%', transform:'translateX(-50%)', pointerEvents:'none' },
  blob2: { position:'absolute', width:300, height:300, borderRadius:'50%', background:'radial-gradient(circle,rgba(59,130,246,0.1) 0%,transparent 65%)', bottom:'-80px', right:'-60px', pointerEvents:'none' },
  blob3: { position:'absolute', width:200, height:200, borderRadius:'50%', background:'radial-gradient(circle,rgba(236,72,153,0.08) 0%,transparent 65%)', bottom:'20%', left:'-40px', pointerEvents:'none' },
  card: { width:'100%', maxWidth:400, background:'rgba(255,255,255,0.04)', backdropFilter:'blur(28px)', WebkitBackdropFilter:'blur(28px)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:24, padding:'36px 28px 28px', textAlign:'center', boxShadow:'0 24px 64px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.1)', position:'relative', zIndex:1, overflow:'hidden' },
  shine: { position:'absolute', top:0, left:'10%', right:'10%', height:1, background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)', pointerEvents:'none' },
  logoWrap: { position:'relative', display:'inline-block', marginBottom:16 },
  logo: { width:68, height:68, borderRadius:'50%', background:'linear-gradient(135deg,#4c1d95,#7c3aed)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:30, margin:'0 auto', boxShadow:'0 8px 24px rgba(124,58,237,0.5)', position:'relative', zIndex:1 },
  logoRing1: { position:'absolute', width:84, height:84, borderRadius:'50%', border:'1px solid rgba(124,58,237,0.3)', top:'50%', left:'50%', transform:'translate(-50%,-50%)', animation:'pulse-ring 3s ease-in-out infinite' },
  logoRing2: { position:'absolute', width:100, height:100, borderRadius:'50%', border:'1px solid rgba(124,58,237,0.15)', top:'50%', left:'50%', transform:'translate(-50%,-50%)', animation:'pulse-ring 3s ease-in-out infinite 0.5s' },
  title: { fontSize:26, fontWeight:700, color:'#f1f5f9', marginBottom:6, letterSpacing:'-0.02em' },
  sub:   { fontSize:13, color:'#4a5260', marginBottom:24, lineHeight:1.6 },
  divider: { display:'flex', alignItems:'center', gap:10, marginBottom:18 },
  divLine: { flex:1, height:1, background:'rgba(255,255,255,0.07)' },
  divText: { fontSize:9, fontWeight:700, color:'#374151', letterSpacing:'0.15em', whiteSpace:'nowrap' },
  fieldLabel: { fontSize:13, color:'#8a96a8', textAlign:'left', marginBottom:8, fontWeight:500 },
  inputWrap: { display:'flex', alignItems:'center', gap:10, background:'rgba(255,255,255,0.05)', backdropFilter:'blur(10px)', WebkitBackdropFilter:'blur(10px)', border:'1px solid rgba(255,255,255,0.09)', borderRadius:12, padding:'13px 14px', marginBottom:14, transition:'border-color 0.2s' },
  input: { flex:1, background:'none', border:'none', color:'#f1f5f9', fontSize:15, outline:'none' },
  err: { background:'rgba(248,113,113,0.08)', border:'1px solid rgba(248,113,113,0.25)', borderRadius:10, padding:'10px 14px', color:'#f87171', fontSize:12, marginBottom:14, textAlign:'left' },
  btn: { width:'100%', background:'linear-gradient(135deg,#7c3aed,#9333ea)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:14, color:'#fff', padding:'14px', fontSize:15, fontWeight:600, marginBottom:12, cursor:'pointer', boxShadow:'0 6px 16px rgba(124,58,237,0.35)', transition:'all 0.2s' },
  backBtn: { width:'100%', background:'none', border:'none', color:'#4a5260', fontSize:13, cursor:'pointer', padding:'8px' },
  badges: { display:'flex', justifyContent:'center', gap:6, flexWrap:'wrap', marginBottom:14 },
  badge: { background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, padding:'4px 10px', fontSize:10, color:'#6b7585', fontWeight:500 },
  footer: { fontSize:11, color:'#374151', lineHeight:1.7 },
  avatarGrid: { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:20, marginTop:8 },
  avatarBtn: { fontSize:26, padding:'10px', borderRadius:12, cursor:'pointer', transition:'all 0.15s', aspectRatio:'1' },
}