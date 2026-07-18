import { useState, useEffect } from 'react'
import { decryptText } from '../crypto'

function PhotoThumb({ photo, password, index, onDelete }) {
  const [src, setSrc] = useState(null)
  const [hover, setHover] = useState(false)

  useEffect(() => {
    let cancelled = false
    decryptText(photo.fileData, password).then(data => {
      if (!cancelled) setSrc(data)
    }).catch(() => {})
    return () => { cancelled = true }
  }, [photo.fileData, password])

  async function share() {
    if (!src) return
    const res  = await fetch(src)
    const blob = await res.blob()
    const file = new File([blob], photo.fileName, { type: photo.fileType })
    if (navigator.share && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: photo.title })
    } else {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = photo.fileName; a.click()
      URL.revokeObjectURL(url)
    }
  }

  function download() {
    if (!src) return
    const a = document.createElement('a')
    a.href = src; a.download = photo.fileName; a.click()
  }

  return (
    <div
      style={styles.thumb}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {src
        ? <img src={src} alt={photo.title} style={styles.img} />
        : <div style={styles.loading}>⟳</div>
      }
      {hover && (
        <div style={styles.overlay}>
          <button style={styles.miniBtn} onClick={share}>↗</button>
          <button style={styles.miniBtn} onClick={download}>⬇</button>
          <button style={{ ...styles.miniBtn, color: '#f87171' }}
            onClick={() => { if(confirm('Delete photo?')) onDelete('photos', index) }}>✕</button>
        </div>
      )}
      {photo.title && <div style={styles.caption}>{photo.title}</div>}
    </div>
  )
}

export default function PhotosPage({ photos, password, onDelete }) {
  if (photos.length === 0) {
    return (
      <div style={styles.empty}>
        <div style={styles.emptyIcon}>🖼️</div>
        <div>No photos yet</div>
        <div style={{ fontSize: 12, color: '#4a5260', marginTop: 6 }}>Add photos from the ＋ tab</div>
      </div>
    )
  }

  return (
    <div style={styles.grid}>
      {photos.map((p, i) => (
        <PhotoThumb key={p.id} photo={p} password={password} index={i} onDelete={onDelete} />
      ))}
    </div>
  )
}

const styles = {
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 },
  thumb: {
    position: 'relative', aspectRatio: '1',
    borderRadius: 10, overflow: 'hidden',
    background: '#181b22', cursor: 'pointer',
  },
  img: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  loading: {
    width: '100%', height: '100%', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    color: '#4a5260', fontSize: 20, animation: 'spin 1s linear infinite',
  },
  overlay: {
    position: 'absolute', inset: 0,
    background: 'rgba(0,0,0,0.6)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
  },
  miniBtn: {
    background: 'rgba(255,255,255,0.15)',
    border: '1px solid rgba(255,255,255,0.2)',
    color: '#fff', borderRadius: 6,
    padding: '4px 8px', fontSize: 12,
  },
  caption: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
    color: '#e8ecf3', fontSize: 10, padding: '12px 6px 4px',
    fontWeight: 500,
  },
  empty: {
    textAlign: 'center', color: '#6b7585', fontSize: 14,
    padding: '60px 16px',
  },
  emptyIcon: { fontSize: 40, marginBottom: 10 },
}
