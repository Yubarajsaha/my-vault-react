import { useState, useEffect } from 'react'
import LoginScreen  from './components/LoginScreen'
import HomePage     from './components/HomePage'
import DocsPage     from './components/DocsPage'
import PhotosPage   from './components/PhotosPage'
import AddPage      from './components/AddPage'
import ProfilePage  from './components/ProfilePage'
import SettingsPage from './components/SettingsPage'
import BottomNav    from './components/BottomNav'
import { loadVault, saveVault } from './store'
import './index.css'

const NAV_ITEMS = [
  { id: 'home',     label: 'Home',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
  },
  { id: 'docs',     label: 'Docs',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
  },
  { id: 'add',      label: 'Add', fab: true },
  { id: 'photos',   label: 'Photos',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
  },
  { id: 'settings', label: 'Settings',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
  },
]

const PAGE_TITLES = {
  home: 'Vault', docs: 'Documents', photos: 'Photos',
  add: 'Add New', profile: 'Profile', settings: 'Settings',
}

export default function App() {
  const [unlocked,  setUnlocked]  = useState(false)
  const [password,  setPassword]  = useState('')
  const [tab,       setTab]       = useState('home')
  const [docs,      setDocs]      = useState([])
  const [photos,    setPhotos]    = useState([])
  const [secrets,   setSecrets]   = useState([])
  const [profile,   setProfile]   = useState({})
  const [activity,  setActivity]  = useState([])
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768)

  useEffect(() => {
    const fn = () => setIsDesktop(window.innerWidth >= 768)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])

  async function handleUnlock(pw) {
    const data = await loadVault(pw)
    setPassword(pw)
    setDocs(data.docs       || [])
    setPhotos(data.photos   || [])
    setSecrets(data.secrets || [])
    setProfile(data.profile || {})
    setActivity(data.activity || [])
    setUnlocked(true)
  }

  function handleLock() {
    setUnlocked(false); setPassword('')
    setDocs([]); setPhotos([]); setSecrets([])
    setProfile({}); setActivity([]); setTab('home')
  }

  async function handleAdded(type, entry, actEntry) {
    let nd = docs, np = photos, ns = secrets
    if (type === 'docs')    nd = [...docs,    entry]
    if (type === 'photos')  np = [...photos,  entry]
    if (type === 'secrets') ns = [...secrets, entry]
    const na = [{ ...actEntry, ts: Date.now() }, ...activity].slice(0, 20)
    setDocs(nd); setPhotos(np); setSecrets(ns); setActivity(na)
    await saveVault(password, { docs: nd, photos: np, secrets: ns, profile, activity: na })
  }

  async function handleDelete(type, index) {
    let nd = [...docs], np = [...photos], ns = [...secrets]
    if (type === 'docs')    nd.splice(index, 1)
    if (type === 'photos')  np.splice(index, 1)
    if (type === 'secrets') ns.splice(index, 1)
    setDocs(nd); setPhotos(np); setSecrets(ns)
    await saveVault(password, { docs: nd, photos: np, secrets: ns, profile, activity })
  }

  async function handleProfileUpdate(p) {
    setProfile(p)
    await saveVault(password, { docs, photos, secrets, profile: p, activity })
  }

  // All page props bundled together
  const pageProps = {
    docs, photos, secrets, profile, activity, password,
    onTab: setTab, onDelete: handleDelete,
    onAdded: handleAdded, onUpdate: handleProfileUpdate,
    onLock: handleLock,
  }

  if (!unlocked) return <LoginScreen onUnlock={handleUnlock} />

  // ── DESKTOP LAYOUT ──────────────────────────────────
  if (isDesktop) {
    return (
      <div style={D.shell}>

        {/* Sidebar */}
        <aside style={D.sidebar}>
          <div style={D.sideTop}>

            {/* Logo */}
            <div style={D.sideLogo}>
              <div style={D.sideLogoIcon}>🔐</div>
              <div>
                <div style={D.sideLogoTitle}>My Vault</div>
                <div style={D.sideLogoSub}>Encrypted · Private</div>
              </div>
            </div>

            {/* Nav links */}
            <nav style={D.nav}>
              {NAV_ITEMS.filter(n => !n.fab && n.id !== 'settings').map(item => (
                <SideNavBtn
                  key={item.id}
                  item={item}
                  active={tab === item.id}
                  onClick={() => setTab(item.id)}
                />
              ))}
            </nav>

            {/* Add button */}
            <button
              onClick={() => setTab('add')}
              style={{
                ...D.addBtn,
                background: tab === 'add'
                  ? 'linear-gradient(135deg, #7c3aed, #a855f7)'
                  : 'rgba(124,58,237,0.12)',
                color:  tab === 'add' ? '#fff' : '#a78bfa',
                border: tab === 'add'
                  ? '1px solid rgba(168,85,247,0.5)'
                  : '1px solid rgba(124,58,237,0.25)',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5"  y1="12" x2="19" y2="12"/>
              </svg>
              Add New
            </button>
          </div>

          {/* Bottom of sidebar */}
          <div style={D.sideBottom}>

            {/* Settings link */}
            <SideNavBtn
              item={NAV_ITEMS.find(n => n.id === 'settings')}
              active={tab === 'settings'}
              onClick={() => setTab('settings')}
            />

            {/* Profile */}
            <div
              style={D.sideProfile}
              onClick={() => setTab('profile')}
            >
              <div style={D.sideAvatar}>
                {profile.avatarData
                  ? <img src={profile.avatarData} style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'50%' }} alt="" />
                  : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                }
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={D.sideProfileName}>{profile.name || 'Your Name'}</div>
                <div style={D.sideProfileSub}>Vault Owner</div>
              </div>
            </div>

            {/* Lock button */}
            <button onClick={handleLock} style={D.lockBtn}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Lock Vault
            </button>
          </div>
        </aside>

        {/* Main area */}
        <main style={D.main}>

          {/* Top bar */}
          <div style={D.topBar}>
            <div>
              <div style={D.pageTitle}>{PAGE_TITLES[tab]}</div>
              <div style={D.pageSub}>{tab === 'home' ? 'Overview' : tab.toUpperCase()}</div>
            </div>
            <div style={D.topStats}>
              <span style={D.topStat}><span style={{ color:'#60a5fa' }}>{docs.length}</span> docs</span>
              <span style={D.topStat}><span style={{ color:'#34d399' }}>{photos.length}</span> photos</span>
              <span style={D.topStat}><span style={{ color:'#a78bfa' }}>{secrets.length}</span> secrets</span>
            </div>
          </div>

          {/* Page content */}
          <div style={D.content}>
            {tab === 'home'     && <HomePage     {...pageProps} />}
            {tab === 'docs'     && <DocsPage     {...pageProps} />}
            {tab === 'photos'   && <PhotosPage   {...pageProps} />}
            {tab === 'add'      && <AddPage      {...pageProps} />}
            {tab === 'profile'  && <ProfilePage  {...pageProps} />}
            {tab === 'settings' && <SettingsPage onLock={handleLock} onClearAll={handleLock} />}
          </div>
        </main>

        {/* Bottom nav on desktop too */}
        <BottomNav active={tab} onTab={setTab} />
      </div>
    )
  }

  // ── MOBILE LAYOUT ───────────────────────────────────
  return (
    <div style={M.shell}>

      {/* Top bar */}
      <div style={M.topBar}>
        <div style={M.topLeft}>
          <div style={M.topLogo}>🔐</div>
          <div>
            <div style={M.topTitle}>{PAGE_TITLES[tab]}</div>
            <div style={M.topSub}>{tab.toUpperCase()}</div>
          </div>
        </div>
        <button
          onClick={handleLock}
          style={M.lockBtn}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'rgba(248,113,113,0.4)'
            e.currentTarget.style.color = '#f87171'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
            e.currentTarget.style.color = '#8a96a8'
          }}
        >
          🔒 Lock
        </button>
      </div>

      {/* Page content */}
      <div style={M.content}>
        {tab === 'home'     && <HomePage     {...pageProps} />}
        {tab === 'docs'     && <DocsPage     {...pageProps} />}
        {tab === 'photos'   && <PhotosPage   {...pageProps} />}
        {tab === 'add'      && <AddPage      {...pageProps} />}
        {tab === 'profile'  && <ProfilePage  {...pageProps} />}
        {tab === 'settings' && <SettingsPage onLock={handleLock} onClearAll={handleLock} />}
      </div>

      <BottomNav active={tab} onTab={setTab} />
    </div>
  )
}

// ── Sidebar nav button ───────────────────────────────
function SideNavBtn({ item, active, onClick }) {
  const [hov, setHov] = useState(false)
  if (!item) return null
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        width: '100%', padding: '10px 14px', borderRadius: 12,
        border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500,
        background: active
          ? 'rgba(167,139,250,0.12)'
          : hov ? 'rgba(255,255,255,0.04)' : 'transparent',
        color: active ? '#a78bfa' : hov ? '#c4b5fd' : '#6b7585',
        transition: 'all 0.15s',
        borderLeft: active ? '2px solid #a78bfa' : '2px solid transparent',
      }}
    >
      <span style={{ opacity: active ? 1 : 0.7 }}>{item.icon}</span>
      {item.label}
    </button>
  )
}

// ── Desktop styles ───────────────────────────────────
const D = {
  shell: {
    height: '100vh', display: 'flex',
    background: '#060810',
    position: 'relative',
  },
  sidebar: {
    width: 240, flexShrink: 0,
    display: 'flex', flexDirection: 'column',
    justifyContent: 'space-between',
    background: 'rgba(255,255,255,0.03)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    borderRight: '1px solid rgba(255,255,255,0.07)',
    padding: '20px 12px',
  },
  sideTop:  { display: 'flex', flexDirection: 'column', gap: 24 },
  sideLogo: { display: 'flex', alignItems: 'center', gap: 12, padding: '0 6px' },
  sideLogoIcon: {
    width: 40, height: 40, borderRadius: 12,
    background: 'linear-gradient(135deg, #4c1d95, #7c3aed)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 20, boxShadow: '0 0 14px rgba(124,58,237,0.4)',
  },
  sideLogoTitle: { fontSize: 15, fontWeight: 700, color: '#f1f5f9' },
  sideLogoSub:   { fontSize: 10, color: '#4a5260', letterSpacing: '0.06em' },
  nav: { display: 'flex', flexDirection: 'column', gap: 2 },
  addBtn: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '10px 14px', borderRadius: 12,
    fontSize: 14, fontWeight: 600,
    cursor: 'pointer', transition: 'all 0.2s', width: '100%',
  },
  sideBottom: { display: 'flex', flexDirection: 'column', gap: 8 },
  sideProfile: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '10px', borderRadius: 12,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    cursor: 'pointer', transition: 'all 0.15s',
  },
  sideAvatar: {
    width: 34, height: 34, borderRadius: '50%',
    background: 'linear-gradient(135deg, #f97316, #ec4899)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, overflow: 'hidden',
  },
  sideProfileName: {
    fontSize: 13, fontWeight: 600, color: '#e8ecf3',
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  },
  sideProfileSub: { fontSize: 10, color: '#4a5260' },
  lockBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    padding: '9px', borderRadius: 10, fontSize: 12, fontWeight: 500,
    background: 'rgba(248,113,113,0.07)',
    border: '1px solid rgba(248,113,113,0.2)',
    color: '#f87171', cursor: 'pointer',
    transition: 'all 0.15s', width: '100%',
  },
  main: { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 },
  topBar: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '18px 28px 14px',
    background: 'rgba(6,8,16,0.6)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    flexShrink: 0,
  },
  pageTitle: { fontSize: 22, fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.02em' },
  pageSub:   { fontSize: 10, color: '#4a5260', letterSpacing: '0.1em', marginTop: 2 },
  topStats:  { display: 'flex', gap: 16 },
  topStat:   { fontSize: 12, color: '#4a5260', fontWeight: 500 },
  content: {
    flex: 1, overflowY: 'auto',
    padding: '24px 28px', paddingBottom: 100,
  },
}

// ── Mobile styles ────────────────────────────────────
const M = {
  shell: {
    height: '100vh', display: 'flex',
    flexDirection: 'column', background: '#060810',
  },
  topBar: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '14px 16px 12px',
    background: 'rgba(6,8,16,0.7)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    flexShrink: 0,
  },
  topLeft:  { display: 'flex', alignItems: 'center', gap: 10 },
  topLogo: {
    width: 36, height: 36, borderRadius: '50%',
    background: 'linear-gradient(135deg, #4c1d95, #7c3aed)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 17, boxShadow: '0 0 14px rgba(124,58,237,0.45)',
  },
  topTitle: { fontSize: 15, fontWeight: 700, color: '#f1f5f9', lineHeight: 1.2 },
  topSub:   { fontSize: 9, fontWeight: 600, color: '#4a5260', letterSpacing: '0.12em' },
  lockBtn: {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 20, color: '#8a96a8',
    padding: '7px 14px', fontSize: 12,
    display: 'flex', alignItems: 'center', gap: 4,
    transition: 'all 0.2s',
  },
  content: {
    flex: 1, overflowY: 'auto',
    padding: '14px 16px', paddingBottom: 100,
  },
}