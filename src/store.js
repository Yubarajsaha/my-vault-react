// Vault store — handles all localStorage operations

const VAULT_KEY    = 'vaultData_v3'
const USER_KEY     = 'vaultUser_v1'
const SETTINGS_KEY = 'vaultSettings_v1'

// ── User ──
export function getUser() {
  const u = localStorage.getItem(USER_KEY)
  return u ? JSON.parse(u) : null
}
export function saveUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

// ── Settings ──
export function getSettings() {
  const s = localStorage.getItem(SETTINGS_KEY)
  return s ? JSON.parse(s) : { hasPassword: false, hasBiometric: false, autoLock: true }
}
export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

// ── Vault data ──
import { encryptText, decryptText } from './crypto'

export async function saveVault(password, data) {
  const payload   = JSON.stringify(data)
  const encrypted = password ? await encryptText(payload, password) : payload
  localStorage.setItem(VAULT_KEY, encrypted)
}

export async function loadVault(password) {
  const saved = localStorage.getItem(VAULT_KEY)
  if (!saved) return { docs:[], photos:[], secrets:[], profile:{}, activity:[] }
  try {
    const text = password ? await decryptText(saved, password) : saved
    return JSON.parse(text)
  } catch {
    return { docs:[], photos:[], secrets:[], profile:{}, activity:[] }
  }
}

export function clearAll() {
  localStorage.clear()
}