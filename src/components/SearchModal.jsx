import { useState, useEffect, useRef } from 'react'
import { decryptText } from '../crypto'

export default function SearchModal({ open, onClose, docs, photos, secrets, password, onTab }) {
  const [query,   setQuery]   = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)

  // Focus input when modal opens
  useEffect(() => {
    if (open) {
      setQuery('')
      setResults([])
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  // Search whenever query changes
  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    const timer = setTimeout(() => doSearch(query.trim()), 300)
    return () => clearTimeout(timer)
  }, [query, docs, photos, secrets])

  async function doSearch(q) {
    setLoading(true)
    const lower   = q.toLowerCase()
    const found   = []

    // Search docs
    docs.forEach((doc, i) => {
      if (
        doc.name?.toLowerCase().includes(lower) ||
        doc.category?.toLowerCase().includes(lower) ||
        doc.notes?.toLowerCase().includes(lower) ||
        doc.fileName?.toLowerCase().includes(lower)
      ) {
        found.push({
          type: 'doc', index: i,
          title: doc.name,
          sub: `${doc.category} · ${doc.fileName || 'No file'}`,
          icon: catIcon(doc.category),
          iconBg: 'linear-gradient(135deg,#3b82f6,#6366f1)',
          tab: 'docs',
        })
      }
    })

    // Search photos
    photos.forEach((photo, i) => {
      if (photo.title?.toLowerCase().includes(lower) ||
          photo.fileName?.toLowerCase().includes(lower)) {
        found.push({
          type: 'photo', index: i,
          title: photo.title || photo.fileName,
          sub: 'Photo',
          icon: '🖼️',
          iconBg: 'linear-gradient(135deg,#10b981,#06b6d4)',
          tab: 'photos',
          fileData: photo.fileData,
        })
      }
    })

    // Search secrets (title and username only — never decrypt in search)
    secrets.forEach((sec, i) => {
      if (
        sec.title?.toLowerCase().includes(lower) ||
        sec.user?.toLowerCase().includes(lower)  ||
        sec.notes?.toLowerCase().includes(lower)
      ) {
        found.push({
          type: 'secret', index: i,
          title: sec.title,
          sub: sec.user ? `User: ${sec.user}` : 'Secret',
          icon: '🔑',
          iconBg: 'linear-gradient(135deg,#8b5cf6,#a855f7)',
          tab: 'settings',
        })
      }
    })

    setResults(found)
    setLoading(false)
  }

  function catIcon(cat) {
    const icons = { Aadhaar:'🪪', PAN:'🪪', 'Voter ID':'🗳️', 'Driving Licence':'🚗', Passbook:'🏦', Other:'📁' }
    return icons[cat] || '📄'
  }

  function handleResultClick(result) {
    onTab(result.tab)
    onClose()
  }

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 300,
        }}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed',
        top: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90%',
        maxWidth: 520,
        zIndex: 301,
        maxHeight: '75vh',
        display: 'flex',
        flexDirection: 'column',
      }}>

        {/* Search input */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          background: 'rgba(20,22,32,0.98)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(167,139,250,0.4)',
          borderRadius: 16, padding: '14px 18px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(167,139,250,0.1)',
          marginBottom: 8,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Escape' && onClose()}
            placeholder="Search documents, photos, secrets..."
            style={{
              flex: 1, background: 'none', border: 'none',
              color: '#f1f5f9', fontSize: 15, outline: 'none',
            }}
          />
          {query && (
            <button
              onClick={() => { setQuery(''); setResults([]) }}
              style={{ background: 'none', border: 'none', color: '#4a5260', cursor: 'pointer', fontSize: 18, padding: 0 }}
            >
              ✕
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 6, color: '#6b7585',
              padding: '4px 8px', fontSize: 10,
              cursor: 'pointer', whiteSpace: 'nowrap',
            }}
          >
            ESC
          </button>
        </div>

        {/* Results */}
        <div style={{
          background: 'rgba(16,18,26,0.98)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 16,
          overflow: 'hidden',
          overflowY: 'auto',
          boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
        }}>

          {/* Empty state */}
          {!query && (
            <div style={{ padding: '24px 20px' }}>
              <div style={{ fontSize: 12, color: '#374151', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Quick Access
              </div>
              {[
                { icon: '📄', label: 'Documents', sub: 'Your stored documents', tab: 'docs',     bg: 'linear-gradient(135deg,#3b82f6,#6366f1)' },
                { icon: '🖼️', label: 'Photos',    sub: 'Private photos',        tab: 'photos',   bg: 'linear-gradient(135deg,#10b981,#06b6d4)' },
                { icon: '🔑', label: 'Secrets',   sub: 'Passwords & notes',     tab: 'settings', bg: 'linear-gradient(135deg,#8b5cf6,#a855f7)' },
              ].map((item, i) => (
                <QuickItem key={i} item={item} onClick={() => { onTab(item.tab); onClose() }}/>
              ))}
            </div>
          )}

          {/* Loading */}
          {loading && query && (
            <div style={{ padding: '20px', textAlign: 'center', color: '#4a5260', fontSize: 13 }}>
              Searching...
            </div>
          )}

          {/* No results */}
          {!loading && query && results.length === 0 && (
            <div style={{ padding: '32px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>🔍</div>
              <div style={{ fontSize: 14, color: '#e8ecf3', marginBottom: 4 }}>No results for "{query}"</div>
              <div style={{ fontSize: 12, color: '#4a5260' }}>Try a different search term</div>
            </div>
          )}

          {/* Results list */}
          {!loading && results.length > 0 && (
            <div>
              <div style={{ padding: '12px 16px 6px', fontSize: 11, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
              </div>
              {results.map((result, i) => (
                <ResultRow
                  key={i}
                  result={result}
                  query={query}
                  onClick={() => handleResultClick(result)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function QuickItem({ item, onClick }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 12px', borderRadius: 10, cursor: 'pointer',
        background: hov ? 'rgba(255,255,255,0.05)' : 'transparent',
        transition: 'background 0.15s',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: item.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18, flexShrink: 0,
      }}>
        {item.icon}
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 500, color: '#e8ecf3' }}>{item.label}</div>
        <div style={{ fontSize: 11, color: '#4a5260' }}>{item.sub}</div>
      </div>
      <span style={{ marginLeft: 'auto', color: '#374151', fontSize: 12 }}>→</span>
    </div>
  )
}

function ResultRow({ result, query, onClick }) {
  const [hov, setHov] = useState(false)

  // Highlight matching text
  function highlight(text) {
    if (!text) return ''
    const lower = text.toLowerCase()
    const idx   = lower.indexOf(query.toLowerCase())
    if (idx === -1) return text
    return (
      <>
        {text.slice(0, idx)}
        <span style={{ background: 'rgba(167,139,250,0.3)', color: '#c4b5fd', borderRadius: 3, padding: '0 2px' }}>
          {text.slice(idx, idx + query.length)}
        </span>
        {text.slice(idx + query.length)}
      </>
    )
  }

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 16px',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        background: hov ? 'rgba(255,255,255,0.04)' : 'transparent',
        cursor: 'pointer', transition: 'background 0.15s',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <div style={{
        width: 40, height: 40, borderRadius: 11,
        background: result.iconBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18, flexShrink: 0,
      }}>
        {result.icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: '#e8ecf3', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {highlight(result.title)}
        </div>
        <div style={{ fontSize: 11, color: '#4a5260', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {result.type === 'doc' ? '📄 Document' : result.type === 'photo' ? '🖼️ Photo' : '🔑 Secret'} · {result.sub}
        </div>
      </div>
      <span style={{ color: '#4a5260', fontSize: 12, flexShrink: 0 }}>→</span>
    </div>
  )
}