import { useState } from 'react'
import { readFileAsBase64 } from '../crypto'

const glass = {
  background: 'rgba(255,255,255,0.04)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border: '1px solid rgba(255,255,255,0.09)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05)',
}

export default function ProfilePage({ profile, docs, photos, secrets, onUpdate, onLock }) {
  const [editing, setEditing] = useState(null)
  const [editVal, setEditVal] = useState('')
  const [lockHov, setLockHov] = useState(false)

  function startEdit(field) { setEditing(field); setEditVal(profile[field] || '') }
  async function saveEdit() { onUpdate({ ...profile, [editing]: editVal }); setEditing(null) }

  async function changeAvatar(e) {
    const file = e.target.files[0]; if (!file) return
    onUpdate({ ...profile, avatarData: await readFileAsBase64(file) })
  }

  const fields = [
    { key: 'name',  label: 'Name',  placeholder: 'Your full name'    },
    { key: 'email', label: 'Email', placeholder: 'your@email.com'    },
    { key: 'phone', label: 'Phone', placeholder: '+91 00000 00000'   },
  ]

  return (
    <div>
      {/* Edit modal */}
      {editing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 20 }}>
          <div style={{ ...glass, borderRadius: 18, padding: '24px', width: '100%', maxWidth: 360 }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#f1f5f9', marginBottom: 14, textTransform: 'capitalize' }}>
              Edit {editing}
            </div>
            <input
              value={editVal}
              onChange={e => setEditVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && saveEdit()}
              placeholder={fields.find(f => f.key === editing)?.placeholder}
              autoFocus
              style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: '#e8ecf3', padding: '12px 14px', fontSize: 14, outline: 'none', marginBottom: 16 }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setEditing(null)} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#8a96a8', padding: '11px', fontSize: 13 }}>
                Cancel
              </button>
              <button onClick={saveEdit} style={{ flex: 1, background: 'linear-gradient(135deg, #c9a35e, #e8c07d)', border: 'none', borderRadius: 10, color: '#1a1200', padding: '11px', fontSize: 13, fontWeight: 700 }}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile header */}
      <div style={{ ...glass, borderRadius: 20, padding: '28px 20px', textAlign: 'center', marginBottom: 12 }}>
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: 14 }}>
          <div style={{ width: 84, height: 84, borderRadius: '50%', background: 'linear-gradient(135deg, #f97316, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '3px solid rgba(255,255,255,0.15)', boxShadow: '0 8px 24px rgba(249,115,22,0.3)', margin: '0 auto' }}>
            {profile.avatarData
              ? <img src={profile.avatarData} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
              : <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            }
          </div>
          <label style={{ position: 'absolute', bottom: 0, right: 0, width: 26, height: 26, borderRadius: '50%', background: '#c9a35e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, cursor: 'pointer', border: '2px solid #060810' }}>
            ✏️
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={changeAvatar} />
          </label>
        </div>

        <div style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>
          {profile.name || 'Your Name'}
        </div>
        <div style={{ fontSize: 12, color: '#4a5260', marginBottom: 20 }}>Vault Owner</div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 0 }}>
          {[
            { n: docs.length,    l: 'Docs'    },
            { n: photos.length,  l: 'Photos'  },
            { n: secrets.length, l: 'Secrets' },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#c9a35e' }}>{s.n}</div>
              <div style={{ fontSize: 10, color: '#4a5260', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Personal info */}
      <div style={{ ...glass, borderRadius: 16, padding: '16px', marginBottom: 10 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Personal info</div>
        {fields.map((f, i) => (
          <div key={f.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < fields.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
            <div>
              <div style={{ fontSize: 11, color: '#4a5260', marginBottom: 2 }}>{f.label}</div>
              <div style={{ fontSize: 13, color: '#e8ecf3' }}>{profile[f.key] || 'Not set'}</div>
            </div>
            <button onClick={() => startEdit(f.key)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#8a96a8', padding: '5px 12px', fontSize: 11, transition: 'all 0.15s' }}>
              Edit
            </button>
          </div>
        ))}
      </div>

      {/* Security info */}
      <div style={{ ...glass, borderRadius: 16, padding: '16px', marginBottom: 12 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Security</div>
        {[
          { label: 'Encryption',    value: '✅ AES-256-GCM', color: '#4ade80' },
          { label: 'Storage',       value: 'This device only', color: '#e8ecf3' },
          { label: 'Cloud backup',  value: '❌ Never',        color: '#f87171' },
        ].map((r, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
            <span style={{ fontSize: 12, color: '#6b7585' }}>{r.label}</span>
            <span style={{ fontSize: 12, color: r.color }}>{r.value}</span>
          </div>
        ))}
      </div>

      {/* Lock button */}
      <button
        onClick={onLock}
        onMouseEnter={() => setLockHov(true)}
        onMouseLeave={() => setLockHov(false)}
        style={{
          width: '100%',
          background: lockHov ? 'rgba(248,113,113,0.15)' : 'rgba(248,113,113,0.07)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: `1px solid ${lockHov ? 'rgba(248,113,113,0.5)' : 'rgba(248,113,113,0.2)'}`,
          borderRadius: 14, color: '#f87171',
          padding: '14px', fontSize: 14, fontWeight: 600,
          transform: lockHov ? 'translateY(-1px)' : 'none',
          boxShadow: lockHov ? '0 8px 20px rgba(248,113,113,0.15)' : 'none',
          transition: 'all 0.2s',
        }}
      >
        🔒 Lock Vault
      </button>
    </div>
  )
}