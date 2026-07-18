// Vault data store — save/load encrypted from localStorage
import { encryptText, decryptText } from './crypto'

const STORAGE_KEY = 'vaultData_v2'

export async function saveVault(password, { docs, photos, secrets, profile, activity }) {
  const payload = JSON.stringify({ docs, photos, secrets, profile, activity })
  const encrypted = await encryptText(payload, password)
  localStorage.setItem(STORAGE_KEY, encrypted)
}

export async function loadVault(password) {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (!saved) return { docs: [], photos: [], secrets: [], profile: {}, activity: [] }
  const decrypted = await decryptText(saved, password)
  return JSON.parse(decrypted)
}
