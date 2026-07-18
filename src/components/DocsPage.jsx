import { useState } from 'react'
import { decryptText } from '../crypto'

const CATS = ['All', 'Aadhaar', 'PAN', 'Voter ID', 'Driving Licence', 'Passbook', 'Other']
const CAT_ICON = { Aadhaar:'🪪', PAN:'🪪', 'Voter ID':'🗳️', 'Driving Licence':'🚗', Passbook:'🏦', Other:'📁' }
const CAT_COLOR = {
  Aadhaar: 'linear-gradient(135deg,#3b82f6,#6366f1)',
  PAN: 'linear-gradient(135deg,#f97316,#ef4444)',
  'Voter ID': 'linear-gradient(135deg,#10b981,#06b6d4)',
  'Driving Licence': 'linear-gradient(135deg,#f59e0b,#f97316)',
  Passbook: 'linear-gradient(135deg,#8b5cf6,#6366f1)',
  Other: 'linear-gradient(135deg,#6b7280,#4b5563)',
}

function HoverBtn({ onClick, children, danger, green }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 34, height: 34, borderRadius: 10,
        background: hov
          ? danger ? 'rgba(248,113,113,0.15)' : green ? 'rgba(74,222,128,0.12)' : 'rgba(255,255,255,0.1)'
          : 'rgba(255,255,255,0.05)',
        border: `1px solid ${hov
          ? danger ? 'rgba(248,113,113,0.4)' : green ? 'rgba(74,222,128,0.35)' : 'rgba(255,255,255,0.2)'
          : 'rgba(255,255,255,0.08)'}`,
        color: hov
          ? danger ? '#f87171' : green ? '#4ade80' : '#e8ecf3'
          : danger ? '#f87171' : green ? '#4ade80' : '#8a96a8',
        fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.15s', backdropFilter: 'blur(8px)',
      }}
    >
      {children}
    </button>
  )
}

function DocRow({ doc, onDownload, onShare, onDelete }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${hov ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: 14, padding: '14px', marginBottom: 8,
        display: 'flex', alignItems: 'flex-start',
        justifyContent: 'space-between', gap: 10,
        boxShadow: hov ? '0 8px 24px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.15)',
        transition: 'all 0.2s ease',
        transform: hov ? 'translateY(-1px)' : 'none',
      }}
    >
      <div style={{ display: 'flex', gap: 12, flex: 1, minWidth: 0 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12, flexShrink: 0,
          background: CAT_COLOR[doc.category] || CAT_COLOR.Other,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        }}>
          {CAT_ICON[doc.category] || '📁'}
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9', marginBottom: 3 }}>{doc.name}</div>
          <div style={{ fontSize: 11, color: '#4a5260' }}>{doc.category} · {doc.fileName || 'No file'}</div>
          {doc.notes && <div style={{ fontSize: 11, color: '#6b7585', marginTop: 4 }}>{doc.notes}</div>}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
        {doc.fileData && <>
          <HoverBtn onClick={onDownload}>⬇</HoverBtn>
          <HoverBtn onClick={onShare} green>↗</HoverBtn>
        </>}
        <HoverBtn onClick={onDelete} danger>✕</HoverBtn>
      </div>
    </div>
  )
}

export default function DocsPage({ docs, password, onDelete }) {
  const [filter, setFilter] = useState('All')

  const filtered = filter === 'All' ? docs : docs.filter(d => d.category === filter)

  async function download(doc) {
    const data = await decryptText(doc.fileData, password)
    const a = document.createElement('a')
    a.href = data; a.download = doc.fileName; a.click()
  }

  async function share(doc) {
    const data = await decryptText(doc.fileData, password)
    const res  = await fetch(data)
    const blob = await res.blob()
    const file = new File([blob], doc.fileName, { type: doc.fileType })
    if (navigator.share && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: doc.name })
    } else {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a'); a.href = url; a.download = doc.fileName; a.click()
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div>
      {/* Category pills */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
        {CATS.map(c => {
          const active = filter === c
          return (
            <button key={c} onClick={() => setFilter(c)} style={{
              background: active ? 'rgba(167,139,250,0.15)' : 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: `1px solid ${active ? 'rgba(167,139,250,0.4)' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 20, color: active ? '#a78bfa' : '#6b7585',
              padding: '6px 14px', fontSize: 11, fontWeight: 500,
              transition: 'all 0.15s', whiteSpace: 'nowrap',
            }}>
              {CAT_ICON[c] || ''} {c}
            </button>
          )
        })}
      </div>

      {filtered.length === 0
        ? <div style={{
            textAlign: 'center', color: '#4a5260', fontSize: 13,
            padding: '50px 16px', lineHeight: 1.8,
            background: 'rgba(255,255,255,0.02)',
            backdropFilter: 'blur(10px)',
            border: '1px dashed rgba(255,255,255,0.07)', borderRadius: 16,
          }}>
            No {filter === 'All' ? 'documents' : filter} yet.<br />
            <span style={{ color: '#374151' }}>Add from the ＋ tab</span>
          </div>
        : filtered.map(doc => (
            <DocRow
              key={doc.id}
              doc={doc}
              onDownload={() => download(doc)}
              onShare={() => share(doc)}
              onDelete={() => { if (confirm('Delete this document?')) onDelete('docs', docs.indexOf(doc)) }}
            />
          ))
      }
    </div>
  )
}