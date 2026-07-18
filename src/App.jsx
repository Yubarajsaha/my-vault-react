import { useState, useCallback } from 'react'
import LoginScreen from './components/LoginScreen'
import HomePage    from './components/HomePage'
import DocsPage    from './components/DocsPage'
import PhotosPage  from './components/PhotosPage'
import AddPage     from './components/AddPage'
import ProfilePage from './components/ProfilePage'
import BottomNav   from './components/BottomNav'
import { loadVault, saveVault } from './store'
import './index.css'

const glass = {
  background: 'rgba(255,255,255,0.04)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border: '1px solid rgba(255,255,255,0.09)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)',
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

  async function handleUnlock(pw) {
    const data = await loadVault(pw)
    setPassword(pw)
    setDocs(data.docs || [])
    setPhotos(data.photos || [])
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

  const pageTitles = { home:'Vault', docs:'Documents', photos:'Photos', add:'Add New', profile:'Profile' }

  if (!unlocked) return <LoginScreen onUnlock={handleUnlock} />

  return (
    <div style={S.shell}>

      {/* Top bar */}
      <div style={S.topBar}>
        <div style={S.topLeft}>
          <div style={S.topLogo}>🔐</div>
          <div>
            <div style={S.topTitle}>{pageTitles[tab]}</div>
            <div style={S.topSub}>{tab.toUpperCase()}</div>
          </div>
        </div>
        <button
          onClick={handleLock}
          style={S.lockBtn}
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

      {/* Content */}
      <div style={S.content}>
        {tab === 'home'    && <HomePage    docs={docs} photos={photos} secrets={secrets} profile={profile} activity={activity} onTab={setTab} />}
        {tab === 'docs'    && <DocsPage    docs={docs} password={password} onDelete={handleDelete} />}
        {tab === 'photos'  && <PhotosPage  photos={photos} password={password} onDelete={handleDelete} />}
        {tab === 'add'     && <AddPage     password={password} onAdded={handleAdded} />}
        {tab === 'profile' && <ProfilePage profile={profile} docs={docs} photos={photos} secrets={secrets} onUpdate={handleProfileUpdate} onLock={handleLock} />}
      </div>

      <BottomNav active={tab} onTab={setTab} />
    </div>
  )
}

const S = {
  shell: {
    height: '100vh', maxWidth: 1100, margin: '0 auto',
    display: 'flex', flexDirection: 'column', position: 'relative',
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
  topLeft: { display: 'flex', alignItems: 'center', gap: 10 },
  topLogo: {
    width: 36, height: 36, borderRadius: '50%',
    background: 'linear-gradient(135deg, #4c1d95, #7c3aed)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 17, boxShadow: '0 0 14px rgba(124,58,237,0.45)',
  },
  topTitle: { fontSize: 15, fontWeight: 700, color: '#f1f5f9', lineHeight: 1.2 },
  topSub:   { fontSize: 9,  fontWeight: 600, color: '#4a5260', letterSpacing: '0.12em' },
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
    flex: 1, overflowY: 'auto', padding: '14px 16px', paddingBottom: 90,
  },
}