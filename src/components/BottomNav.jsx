import { useState } from 'react'

const tabs = [
  { id:'home',     label:'Home',
    icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { id:'docs',     label:'Docs',
    icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
  { id:'add',      label:'', fab:true },
  { id:'photos',   label:'Photos',
    icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg> },
  { id:'settings', label:'Settings',
    icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> },
]

function NavBtn({ tab, active, onTab }) {
  const [hov, setHov] = useState(false)
  const isActive = active === tab.id

  if (tab.fab) {
    return (
      <button
        onClick={() => onTab(tab.id)}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          width: 52, height: 52, borderRadius: '50%',
          background: 'linear-gradient(135deg,#7c3aed,#a855f7)',
          border: '2px solid rgba(255,255,255,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, marginBottom: 8,
          boxShadow: hov
            ? '0 0 28px rgba(168,85,247,0.7), 0 8px 20px rgba(0,0,0,0.5)'
            : '0 0 18px rgba(124,58,237,0.5), 0 4px 12px rgba(0,0,0,0.4)',
          transform: hov ? 'scale(1.1) translateY(-2px)' : 'scale(1)',
          transition: 'all 0.2s ease',
          cursor: 'pointer',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5"  y1="12" x2="19" y2="12"/>
        </svg>
      </button>
    )
  }

  return (
    <button
      onClick={() => onTab(tab.id)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        flex: 1,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 3,
        background: hov && !isActive ? 'rgba(255,255,255,0.03)' : 'none',
        border: 'none',
        padding: '8px 4px 6px',
        borderRadius: 10,
        color: isActive ? '#a78bfa' : hov ? '#8a96a8' : '#4a5260',
        transition: 'all 0.15s',
        cursor: 'pointer',
        position: 'relative',
        WebkitTapHighlightColor: 'transparent',
        minWidth: 0,
      }}
    >
      <span style={{
        transform: isActive || hov ? 'scale(1.1)' : 'scale(1)',
        transition: 'transform 0.15s',
        display: 'flex',
      }}>
        {tab.icon}
      </span>
      <span style={{ fontSize: 9, fontWeight: 500, letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>
        {tab.label}
      </span>
      {isActive && (
        <span style={{
          position: 'absolute', bottom: 2,
          width: 4, height: 4, borderRadius: '50%',
          background: '#a78bfa',
        }}/>
      )}
    </button>
  )
}

export default function BottomNav({ active, onTab }) {
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,zIndex: 200,
      background: 'rgba(6,8,16,0.92)',
      backdropFilter: 'blur(28px)',
      WebkitBackdropFilter: 'blur(28px)',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      display: 'flex', alignItems: 'center',
      padding: '6px 8px',
      paddingBottom: 'max(10px, env(safe-area-inset-bottom))',
      zIndex: 100,
      boxShadow: '0 -8px 32px rgba(0,0,0,0.5)',
      WebkitTapHighlightColor: 'transparent',
    }}>
      {tabs.map(t => <NavBtn key={t.id} tab={t} active={active} onTab={onTab}/>)}
    </nav>
  )
}