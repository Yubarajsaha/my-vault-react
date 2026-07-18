import { useState, useMemo } from 'react'

// Clean SVG icons matching the reference exactly
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

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  )
}

const CARDS = [
  { id: 'docs',    label: 'Documents', icon: <DocIcon />,    iconBg: "linear-gradient(135deg,#4F8CFF,#7C6CFF)",},
  { id: 'photos',  label: 'Photos',    icon: <PhotoIcon />,  iconBg: "linear-gradient(135deg,#16D9A5,#11C5C6)",},
  { id: 'add',     label: 'Add New',   icon: <PlusIcon />,   iconBg: "linear-gradient(135deg,#B56DFF,#9A5BFF)",},
  { id: 'profile', label: 'Profile',   icon: <PersonIcon />, iconBg: "linear-gradient(135deg,#FF9C61,#FF6B6B)",},
]

function HomeCard({ card, sub, hov, onEnter, onLeave, onClick }) {
  return (
    <div
      onClick={onClick}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        background: "linear-gradient(180deg,#171C28 0%,#11151F 100%)",
        borderRadius: 28,
        border: `1px solid ${hov? "rgba(255,255,255,.10)": "rgba(255,255,255,.04)"}`,
        padding: '28px',
        cursor: 'pointer',
        position: 'relative',
        transform: hov? "translateY(-8px) scale(1.02)": "translateY(0) scale(1)",
        boxShadow: hov? "0 24px 60px rgba(0,0,0,.45)": "0 8px 20px rgba(0,0,0,.18)",
        transition: "all .35s cubic-bezier(.22,1,.36,1)",
      }}
    >
      {/* Arrow top right */}
      <div style={{
        position: 'absolute', top: 14, right: 14,
        color: hov ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.15)',
        fontSize: 18, opacity:.35, transition: 'color 0.2s',
        transform: hov ? 'translate(1px,-1px)' : 'none',
      }}>↗</div>

      {/* Icon circle */}
      <div style={{
        width: 60, height: 60, borderRadius: '50%',
        background: card.iconBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 54,
        boxShadow: hov ? '0 4px 16px rgba(0,0,0,0.4)' : 'none',
        transition: 'box-shadow 0.2s',
      }}>
        {card.icon}
      </div>

      <div style={{ fontSize: 24, fontWeight: 700,letterSpacing:"-.4px", color: '#e8ecf3', marginBottom: 3 }}>
        {card.label}
      </div>
      <div style={{ fontSize: 14, color: "#8B97AA",marginTop:8, }}>{sub}</div>
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
        display: 'flex', alignItems: 'center', gap: 18,
        padding: '18px 24px',
        borderTop: "1px solid rgba(255,255,255,.035)",
        background: hov?"rgba(255,255,255,.03)":"transparent",
        cursor: 'pointer',
        transition: 'background 0.15s',
      }}
    >
      <div style={{
        width: 52, height: 52, borderRadius: 18,
        background: iconBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 20, flexShrink: 0,
      }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 16, fontWeight: 600, letterSpacing:"-.2px", color: '#e8ecf3', marginBottom: 2 }}>{title}</div>
        <div style={{ fontSize: 13, color: "#8B97AA", }}>{meta}</div>
      </div>
      <span style={{
        fontSize:18, opacity:.35, color: hov ? '#a78bfa' : '#4a5260',
        transform: hov ? 'translate(5px,-5px)' : 'none',
        transition: 'all 0.15s',
      }}>↗</span>
    </div>
  )
}

export default function HomePage({ docs, photos, secrets, profile, activity, onTab }) {
  const [hovCard, setHovCard] = useState(null)
  const [searchHov, setSearchHov] = useState(false)
  const [viewAllHov, setViewAllHov] = useState(false)

  const totalItems = docs.length + photos.length + secrets.length
  const storageEst = useMemo(() => {
    const rough = (docs.length * 200 + photos.length * 800) / 1024
    return rough < 1 ? `${(rough * 1024).toFixed(0)} KB` : `${rough.toFixed(1)} MB`
  }, [docs, photos])

  const cardSubs = {
    docs:    `${docs.length} files`,
    photos:  `${photos.length} photos`,
    add:     'Upload anything',
    profile: `${secrets.length} secrets`,
  }

  const activityIcons = {
    doc:    { icon: '📄', bg: 'linear-gradient(135deg, #1e3a5f, #1e4d8c)' },
    photo:  { icon: '🖼️', bg: 'linear-gradient(135deg, #064e3b, #065f46)' },
    secret: { icon: '🔒', bg: 'linear-gradient(135deg, #3b1d6b, #4c1d95)' },
  }

  return (
    <div
  style={{
    paddingBottom: 20,
    minHeight: "100vh",
    background: `
      radial-gradient(circle at top left, rgba(139,92,246,.08), transparent 30%),
      radial-gradient(circle at top right, rgba(34,197,94,.05), transparent 25%),
      linear-gradient(180deg,#090B12 0%, #0D111B 100%)
    `
  }}
>

      {/* ── Hero card ── */}
      <div style={S.hero}>
        <div style={S.heroRow}>
          {/* Avatar */}
          <div style={S.avatar}>
            {profile.avatarData
              ? <img src={profile.avatarData} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
              : <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
            }
            <span style={S.dot} />
          </div>

          {/* Greeting */}
          <div>
            <div style={S.greeting}>
              Welcome back{profile.name ? ` ${profile.name.split(' ')[0]}` : ''}&nbsp;
              <span style={{ color: '#4ade80', fontSize: 11 }}>•</span>
            </div>
            <div style={S.heroSub}>Your vault is unlocked and secure.</div>
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
            <span style={{ ...S.statNum, color: '#a78bfa' }}>Just now</span>
            <span style={S.statLabel}>LAST SYNC</span>
          </div>
        </div>

        {/* Search */}
        <div
          onMouseEnter={() => setSearchHov(true)}
          onMouseLeave={() => setSearchHov(false)}
          style={{
            ...S.search,
            borderColor: searchHov ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.07)',
            background: searchHov ? '#12161f' : '#0d1018',
            transition: 'all 0.2s',
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#4a5260" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input placeholder="Search your vault..." style={S.searchInput} readOnly />
          <span style={S.searchKey}>⌘K</span>
        </div>
      </div>

      {/* ── Section cards ── */}
      <div style={S.grid}>
        {CARDS.map(card => (
          <HomeCard
            key={card.id}
            card={card}
            sub={cardSubs[card.id]}
            hov={hovCard === card.id}
            onEnter={() => setHovCard(card.id)}
            onLeave={() => setHovCard(null)}
            onClick={() => onTab(card.id)}
          />
        ))}
      </div>

      {/* ── Recent activity ── */}
      {activity.length > 0 && (
        <div style={S.actBox}>
          <div style={S.actHead}>
            <span style={{ fontSize: 20, fontWeight: 700,letterSpacing:"-.3px", color: '#e8ecf3' }}>Recent activity</span>
            <button
              onMouseEnter={() => setViewAllHov(true)}
              onMouseLeave={() => setViewAllHov(false)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: viewAllHov ? "#ffffff" : "#9F7AEA",
                fontSize: 14, fontWeight: 500, padding: 0,
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
  background:
    "linear-gradient(180deg,#181C28 0%,#11151F 100%)",

  border: "1px solid rgba(255,255,255,.05)",

  borderRadius: 32,

  padding: "36px",

  marginBottom: 30,

  boxShadow:
    "0 20px 60px rgba(0,0,0,.45)",

  backdropFilter: "blur(18px)"
},
  heroRow: {
  display: "flex",
  alignItems: "center",
  gap: 18,
  marginBottom: 24
},
  avatar: {
  width: 76,
  height: 76,
  borderRadius: "50%",

  background:
    "linear-gradient(135deg,#FF9A62,#FF6B6B)",

  display: "flex",

  alignItems: "center",

  justifyContent: "center",

  overflow: "hidden",

  position: "relative",

  border: "2px solid rgba(255,255,255,.08)",

  boxShadow:
    "0 15px 40px rgba(255,120,80,.25)"
},
  dot: {
    position: 'absolute', width: 11, height: 11, borderRadius: '50%',
    background: '#22c55e', bottom: 2, right: 2,
    border: '2px solid #181d28',
  },
  greeting: {fontSize: 48,fontWeight: 700,color: "#F8FAFC",lineHeight: 1.1,letterSpacing: "-1px"},
  heroSub: {fontSize: 15,color: "#94A3B8",marginTop: 8},
  statsRow: {display: "flex",gap: 70,marginBottom: 24},
  stat: { display: 'flex', flexDirection: 'column', gap: 2 },
  statNum: {fontSize: 28,fontWeight: 700},
  statLabel: {fontSize: 11,letterSpacing: ".18em",color: "#64748B",marginTop: 4},
  search: {display: "flex",alignItems: "center",gap: 14,height: 58,background: "rgba(8,10,18,.65)",
  border: "1px solid rgba(255,255,255,.05)",borderRadius: 18,padding: "0 18px",backdropFilter: "blur(18px)"},
  searchInput: {
    flex: 1, background: 'none', border: 'none',
    color: '#64748b', fontSize: 13, outline: 'none',
  },
  searchKey: {
    fontSize: 10, color: '#374151',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 5, padding: '2px 7px',
  },
  grid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr',
    gap: 10, marginBottom: 12,
  },
  actBox: {
    background:
    "linear-gradient(180deg,#171C28 0%,#11151F 100%)",border: "1px solid rgba(255,255,255,.04)",borderRadius: 28,overflow: "hidden",
      boxShadow: "0 18px 45px rgba(0,0,0,.28)",backdropFilter: "blur(18px)"
  },
  actHead: {
     display: "flex",justifyContent: "space-between",alignItems: "center",padding: "24px 24px 18px",
      borderBottom: "1px solid rgba(255,255,255,.04)"
  },
}