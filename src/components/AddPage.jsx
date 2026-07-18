import { useState } from 'react'
import { encryptText, readFileAsBase64, uid } from '../crypto'

const TYPES = [
  { id: 'doc',    label: '📄 Document' },
  { id: 'photo',  label: '🖼️ Photo'    },
  { id: 'secret', label: '🔑 Secret'   },
]
const DOC_CATS = ['Aadhaar', 'PAN', 'Voter ID', 'Driving Licence', 'Passbook', 'Other']

const glass = {
  background: 'rgba(255,255,255,0.04)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border: '1px solid rgba(255,255,255,0.09)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05)',
}

const inputStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.05)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: 10, color: '#e8ecf3',
  padding: '12px 14px', fontSize: 14, outline: 'none', marginBottom: 14,
  transition: 'border-color 0.15s',
}

function FileDrop({ accept, preview, onPick }) {
  const [hov, setHov] = useState(false)
  return (
    <div style={{ marginBottom: 14 }}>
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          background: hov ? 'rgba(167,139,250,0.06)' : 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: `1px dashed ${hov ? 'rgba(167,139,250,0.4)' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: 12, padding: '22px', textAlign: 'center',
          position: 'relative', cursor: 'pointer', transition: 'all 0.2s',
        }}
      >
        <div style={{ fontSize: 26, marginBottom: 6 }}>📎</div>
        <div style={{ fontSize: 12, color: hov ? '#a78bfa' : '#6b7585', transition: 'color 0.2s' }}>
          Click to choose file
        </div>
        <input type="file" accept={accept}
          style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
          onChange={async e => {
            const f = e.target.files[0]; if (!f) return
            const b64 = await readFileAsBase64(f)
            onPick({ name: f.name, type: f.type, data: b64 })
          }}
        />
      </div>
      {preview && (
        <div style={{ marginTop: 8 }}>
          {preview.type.startsWith('image/')
            ? <img src={preview.data} style={{ width: '100%', maxHeight: 140, objectFit: 'cover', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)' }} alt="preview" />
            : <div style={{ ...glass, borderRadius: 10, padding: '10px 14px', fontSize: 12, color: '#8a96a8' }}>
                📄 {preview.name}
              </div>
          }
        </div>
      )}
    </div>
  )
}

export default function AddPage({ password, onAdded }) {
  const [type, setType]       = useState('doc')
  const [status, setStatus]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [docCat, setDocCat]   = useState('Aadhaar')
  const [docName, setDocName] = useState('')
  const [docNotes, setDocNotes] = useState('')
  const [docFile, setDocFile] = useState(null)
  const [photoTitle, setPhotoTitle] = useState('')
  const [photoFile, setPhotoFile]   = useState(null)
  const [secTitle, setSecTitle]   = useState('')
  const [secUser, setSecUser]     = useState('')
  const [secValue, setSecValue]   = useState('')
  const [secNotes, setSecNotes]   = useState('')
  const [showPw, setShowPw]       = useState(false)

  function msg(text, ok) {
    setStatus({ text, ok })
    setTimeout(() => setStatus(null), 3000)
  }

  async function saveDoc() {
    if (!docName) { msg('Enter a document name', false); return }
    setLoading(true)
    const entry = { id: uid(), category: docCat, name: docName, notes: docNotes, fileData: null, fileName: null, fileType: null }
    if (docFile) { entry.fileData = await encryptText(docFile.data, password); entry.fileName = docFile.name; entry.fileType = docFile.type }
    onAdded('docs', entry, { name: docName, section: 'Documents', type: 'doc' })
    setDocName(''); setDocNotes(''); setDocFile(null); setLoading(false); msg('Document saved!', true)
  }

  async function savePhoto() {
    if (!photoFile) { msg('Choose a photo first', false); return }
    setLoading(true)
    const entry = { id: uid(), title: photoTitle || photoFile.name, fileData: await encryptText(photoFile.data, password), fileName: photoFile.name, fileType: photoFile.type }
    onAdded('photos', entry, { name: entry.title, section: 'Photos', type: 'photo' })
    setPhotoTitle(''); setPhotoFile(null); setLoading(false); msg('Photo saved!', true)
  }

  async function saveSecret() {
    if (!secTitle) { msg('Enter a title', false); return }
    setLoading(true)
    const entry = { id: uid(), title: secTitle, user: secUser, notes: secNotes, secret: secValue ? await encryptText(secValue, password) : null }
    onAdded('secrets', entry, { name: secTitle, section: 'Secrets', type: 'secret' })
    setSecTitle(''); setSecUser(''); setSecValue(''); setSecNotes(''); setLoading(false); msg('Secret saved!', true)
  }

  const label = txt => (
    <div style={{ fontSize: 11, fontWeight: 600, color: '#6b7585', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
      {txt}
    </div>
  )

  return (
    <div>
      {/* Type tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        {TYPES.map(t => (
          <button key={t.id} onClick={() => setType(t.id)} style={{
            flex: 1,
            background: type === t.id ? 'rgba(167,139,250,0.12)' : 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: `1px solid ${type === t.id ? 'rgba(167,139,250,0.35)' : 'rgba(255,255,255,0.08)'}`,
            borderRadius: 12, color: type === t.id ? '#a78bfa' : '#6b7585',
            padding: '10px 6px', fontSize: 12, fontWeight: 500,
            transition: 'all 0.15s',
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Form glass card */}
      <div style={{ ...glass, borderRadius: 18, padding: '20px' }}>
        {status && (
          <div style={{
            borderRadius: 10, padding: '10px 14px', marginBottom: 14,
            border: '1px solid',
            fontSize: 13,
            background: status.ok ? 'rgba(74,222,128,0.08)' : 'rgba(248,113,113,0.08)',
            borderColor: status.ok ? 'rgba(74,222,128,0.3)' : 'rgba(248,113,113,0.3)',
            color: status.ok ? '#4ade80' : '#f87171',
          }}>
            {status.ok ? '✅' : '⚠️'} {status.text}
          </div>
        )}

        {type === 'doc' && <>
          {label('Category')}
          <select value={docCat} onChange={e => setDocCat(e.target.value)} style={{ ...inputStyle, background: 'rgba(6,8,16,0.6)' }}>
            {DOC_CATS.map(c => <option key={c} style={{ background: '#111' }}>{c}</option>)}
          </select>
          {label('Document name')}
          <input value={docName} onChange={e => setDocName(e.target.value)} placeholder="e.g. My Aadhaar Card" style={inputStyle} />
          {label('Attach PDF or image')}
          <FileDrop accept="image/*,.pdf" preview={docFile} onPick={setDocFile} />
          {label('Notes (optional)')}
          <input value={docNotes} onChange={e => setDocNotes(e.target.value)} placeholder="Any extra info" style={inputStyle} />
          <SaveBtn onClick={saveDoc} loading={loading}>+ Save Document</SaveBtn>
        </>}

        {type === 'photo' && <>
          {label('Title (optional)')}
          <input value={photoTitle} onChange={e => setPhotoTitle(e.target.value)} placeholder="e.g. Family 2024" style={inputStyle} />
          {label('Choose photo')}
          <FileDrop accept="image/*" preview={photoFile} onPick={setPhotoFile} />
          <SaveBtn onClick={savePhoto} loading={loading}>+ Save Photo</SaveBtn>
        </>}

        {type === 'secret' && <>
          {label('Title')}
          <input value={secTitle} onChange={e => setSecTitle(e.target.value)} placeholder="e.g. Gmail, Bank PIN" style={inputStyle} />
          {label('Username / Email')}
          <input value={secUser} onChange={e => setSecUser(e.target.value)} placeholder="your@email.com" style={inputStyle} />
          {label('Password / Secret')}
          <div style={{ position: 'relative', marginBottom: 14 }}>
            <input type={showPw ? 'text' : 'password'} value={secValue} onChange={e => setSecValue(e.target.value)}
              placeholder="your secret" style={{ ...inputStyle, marginBottom: 0, paddingRight: 42 }} />
            <button onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', fontSize: 16 }}>
              {showPw ? '🙈' : '👁️'}
            </button>
          </div>
          {label('Notes')}
          <textarea value={secNotes} onChange={e => setSecNotes(e.target.value)} placeholder="Any extra info"
            style={{ ...inputStyle, minHeight: 80, resize: 'vertical', marginBottom: 14 }} />
          <SaveBtn onClick={saveSecret} loading={loading}>+ Save Secret</SaveBtn>
        </>}
      </div>
    </div>
  )
}

function SaveBtn({ onClick, loading, children }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      disabled={loading}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: '100%',
        background: hov ? 'linear-gradient(135deg, #c9a35e, #f0d080)' : 'linear-gradient(135deg, #b8923a, #e8c07d)',
        border: 'none', borderRadius: 12, color: '#1a1200',
        padding: '13px', fontSize: 14, fontWeight: 700, marginTop: 4,
        transform: hov ? 'translateY(-1px)' : 'none',
        boxShadow: hov ? '0 8px 20px rgba(201,163,94,0.3)' : 'none',
        transition: 'all 0.2s', opacity: loading ? 0.7 : 1,
      }}
    >
      {loading ? '🔒 Encrypting...' : children}
    </button>
  )
}