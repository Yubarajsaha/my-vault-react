import { useState, useMemo } from 'react'

function DocIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  )
}

function PhotoIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  )
}

function PersonIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  )
}

const CARDS = [
  { id:'docs',    label:'Documents', subFn: d => `${d} files`,   icon:<DocIcon/>,    iconBg:'linear-gradient(135deg,#3b82f6,#6366f1)', cardBg:'linear-gradient(145deg,#161d35 0%,#0d1428 100%)' },
  { id:'photos',  label:'Photos',    subFn: d => `${d} photos`,  icon:<PhotoIcon/>,  iconBg:'linear-gradient(135deg,#10b981,#06b6d4)', cardBg:'linear-gradient(145deg,#0a2419 0%,#061510 100%)' },
  { id:'add',     label:'Add New',   subFn: () => 'Upload anything', icon:<PlusIcon/>,icon:   <PlusIcon/>, iconBg:'linear-gradient(135deg,#8b5cf6,#a855f7)', cardBg:'linear-gradient(145deg,#160b30 0%,#0e0620 100%)' },
  { id:'profile', label:'Profile',   subFn: d => `${d} secrets`, icon:<PersonIcon/>, iconBg:'linear-gradient(135deg,#f97316,#ef4444)', cardBg:'linear-gradient(145deg,#221008 0%,#150a04 100%)' },
]

function HomeCard({ card, sub, hov, onEnter, onLeave, onClick }) {
  return (
    <div
      onClick={onClick}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onTouchStart={onEnter}
      onTouchEnd={onLeave}
      style={{
        background: card.cardBg,
        borderRadius: 16,
        border: `1px solid ${hov ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.06)'}`,
        padding: '16px 14px',
        cursor: 'pointer',
        position: 'relative',
        transform: hov ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hov ? '0 10px 28px rgba(0,0,0,0.5)' : '0 2px 8px rgba(0,0,0,0.2)',
        transition: 'all 0.2s ease',
        WebkitTapHighlightColor: 'transparent',
        userSelect: 'none',
      }}
    >
      <div style={{
        position: 'absolute', top: 12, right: 12,
        color: hov ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.15)',
        fontSize: 12, transition: 'all 0.2s',
      }}>↗</div>

      <div style={{
        width: 44, height: 44, borderRadius: '50%',
        background: card.iconBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 28,
        boxShadow: hov ? '0 4px 14px rgba(0,0,0,0.4)' : 'none',
        transition: 'box-shadow 0.2s',
      }}>
        {card.icon}
      </div>

      <div style={{ fontSize: 14, fontWeight: 700, color: '#e8ecf3', marginBottom: 3 }}>
        {card.label}
      </div>
      <div style={{ fontSize: 11, color: '#5a6475' }}>{sub}</div>
    </div>
  )
}

function ActivityRow({ icon, iconBg, title, meta }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 16px',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        background: hov ? 'rgba(255,255,255,0.025)' : 'transparent',
        cursor: 'pointer', transition: 'background 0.15s',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: iconBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16, flexShrink: 0,
      }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: '#e8ecf3', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</div>
        <div style={{ fontSize: 11, color: '#4a5260' }}>{meta}</div>
      </div>
      <span style={{
        fontSize: 12,
        color: hov ? '#a78bfa' : '#4a5260',
        transition: 'all 0.15s',
        flexShrink: 0,
      }}>↗</span>
    </div>
  )
}

export default function HomePage({ docs, photos, secrets, profile, activity, onTab, onSearch, }) {
  const [hovCard, setHovCard]       = useState(null)
  const [searchHov, setSearchHov]   = useState(false)
  const [viewAllHov, setViewAllHov] = useState(false)

  const totalItems = docs.length + photos.length + secrets.length
  const storageEst = useMemo(() => {
    const rough = (docs.length * 200 + photos.length * 800) / 1024
    return rough < 1 ? `${(rough * 1024).toFixed(0)} KB` : `${rough.toFixed(1)} MB`
  }, [docs, photos])

  const cardSubs = {
    docs:    docs.length,
    photos:  photos.length,
    add:     0,
    profile: secrets.length,
  }

  const activityIcons = {
    doc:    { icon: '📄', bg: 'linear-gradient(135deg,#1e3a5f,#1e4d8c)' },
    photo:  { icon: '🖼️', bg: 'linear-gradient(135deg,#064e3b,#065f46)' },
    secret: { icon: '🔒', bg: 'linear-gradient(135deg,#3b1d6b,#4c1d95)' },
  }

  return (
    <div style={{ paddingBottom: 8 }}>

      {/* Hero card */}
      <div style={S.hero}>
        <div style={S.heroRow}>
          <div style={S.avatar}>
            {profile.avatarData
              ? <img src={profile.avatarData} style={{ width:'100%', height:'100%', objectFit:'cover' }} alt=""/>
              : <span style={{ fontSize: 22 }}>{profile.avatar || '👤'}</span>
            }
            <span style={S.dot}/>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={S.greeting}>
              Welcome back{profile.name ? ` ${profile.name.split(' ')[0]}` : ''}
              <span style={{ color: '#4ade80', fontSize: 11, marginLeft: 5 }}>•</span>
            </div>
            <div style={S.heroSub}>Your vault is unlocked and secure.</div>
          </div>
        </div>
      </div>
        {/* Stats */}
        <div style={S.statsRow}>
          <div style={S.stat}>
            <span style={{ ...S.statNum, color: '#60a5fa' }}>{totalItems}</span>
            <span style={S.statLabel}>ITEMS</span>
          </div>
          <div style={S.stat}>
            <span style={{ ...S.statNum, color: '#34d399' }}>{storageEst}</span>
            <span style={S.statLabel}>STORAGE</span>
          </div>
          <div style={S.stat}>
            <span style={{ ...S.statNum, color: '#a78bfa', fontSize: 12 }}>Just now</span>
            <span style={S.statLabel}>LAST SYNC</span>
          </div>
        </div>

        {/* Search */}
        <div
          onClick={onSearch}
          onMouseEnter={() => setSearchHov(true)}
          onMouseLeave={() => setSearchHov(false)}
          style={{
            ...S.search,
            borderColor: searchHov ? 'rgba(167,139,250,0.4)' : 'rgba(255,255,255,0.07)',
            background: searchHov ? '#12161f' : '#0d1018',
            transition: 'all 0.2s',
            cursor: 'pointer',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4a5260" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <span style={{ ...S.searchInput, color: '#4a5260', fontSize: 12 }}>
            Search your vault...
          </span>
          <span style={S.searchKey}>⌘K</span>
          
        </div>

      {/* Cards grid */}
      <div style={S.grid}>
        {CARDS.map(card => (
          <HomeCard
            key={card.id}
            card={card}
            sub={card.id === 'add' ? 'Upload anything' : card.subFn(cardSubs[card.id])}
            hov={hovCard === card.id}
            onEnter={() => setHovCard(card.id)}
            onLeave={() => setHovCard(null)}
            onClick={() => onTab(card.id)}
          />
        ))}
      </div>

      {/* Recent activity */}
      {activity.length > 0 && (
        <div style={S.actBox}>
          <div style={S.actHead}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#e8ecf3' }}>Recent activity</span>
            <button
              onMouseEnter={() => setViewAllHov(true)}
              onMouseLeave={() => setViewAllHov(false)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: viewAllHov ? '#c4b5fd' : '#a78bfa',
                fontSize: 12, fontWeight: 500, padding: 0,
                transition: 'color 0.15s',
              }}
            >
              View all
            </button>
          </div>
          {activity.slice(0, 3).map((a, i) => {
            const ai = activityIcons[a.type] || activityIcons.doc
            return (
              <ActivityRow
                key={i}
                icon={ai.icon}
                iconBg={ai.bg}
                title={a.name}
                meta={`Added to ${a.section} · ${timeAgo(a.ts)}`}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

function timeAgo(ts) {
  const diff = Date.now() - ts
  if (diff < 60000)    return 'Just now'
  if (diff < 3600000)  return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  return `${Math.floor(diff / 86400000)}d ago`
}

const S = {
  hero: {
    background: 'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 18, padding: '20px', marginBottom: 14,
    boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
  },
  heroRow: {
    display: 'flex', alignItems: 'center',
    gap: 14, marginBottom: 18,
  },
  avatar: {
    width: 48, height: 48, borderRadius: '50%',
    background: 'linear-gradient(135deg,#f97316,#ec4899)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, position: 'relative', overflow: 'hidden',
    border: '2px solid rgba(255,255,255,0.12)',
  },
  dot: {
    position: 'absolute', width: 10, height: 10, borderRadius: '50%',
    background: '#22c55e', bottom: 1, right: 1,
    border: '2px solid rgba(255,255,255,0.2)',
  },
  greeting: {
    fontSize: 15, fontWeight: 700, color: '#f1f5f9',
    marginBottom: 3,
    display: 'flex', alignItems: 'center',
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  },
  heroSub: { fontSize: 11, color: '#64748b' },
  statsRow: {
    display: 'flex', gap: 0,
    marginBottom: 14,
  },
  stat: {
    flex: 1,
    display: 'flex', flexDirection: 'column', gap: 2,
    paddingRight: 8,
  },
  statNum:   { fontSize: 16, fontWeight: 700 },
  statLabel: { fontSize: 8, fontWeight: 700, color: '#374151', letterSpacing: '0.08em' },
  search: {
    display: 'flex', alignItems: 'center', gap: 10,
    background: '#0d1018',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 10, padding: '9px 12px',
  },
  searchInput: {
    flex: 1, background: 'none', border: 'none',
    color: '#64748b', fontSize: 12, outline: 'none',
    pointerEvents: 'none',
  },
  searchKey: {
    fontSize: 9, color: '#374151',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 4, padding: '2px 6px',
    flexShrink: 0,
  },
  grid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr',
    gap: 8, marginBottom: 10,
  },
  actBox: {
    background: 'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 16, overflow: 'hidden',
    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
  },
  actHead: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '13px 16px 9px',
  },
}