// AES-256-GCM encryption helpers

async function getKey(password, salt) {
  const base = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']
  )
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 200000, hash: 'SHA-256' },
    base,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}

export async function encryptText(text, password) {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv   = crypto.getRandomValues(new Uint8Array(12))
  const key  = await getKey(password, salt)
  const ct   = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv }, key, new TextEncoder().encode(text)
  )
  const buf  = new Uint8Array([...salt, ...iv, ...new Uint8Array(ct)])
  return btoa(String.fromCharCode(...buf))
}

export async function decryptText(b64, password) {
  const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0))
  const key   = await getKey(password, bytes.slice(0, 16))
  const pt    = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: bytes.slice(16, 28) }, key, bytes.slice(28)
  )
  return new TextDecoder().decode(pt)
}

export function readFileAsBase64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader()
    r.onload  = () => res(r.result)
    r.onerror = rej
    r.readAsDataURL(file)
  })
}

export function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}
