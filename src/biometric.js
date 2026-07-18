// WebAuthn biometric helper — works with Face ID, Touch ID, Windows Hello

const RP_ID   = window.location.hostname || 'localhost'
const RP_NAME = 'My Vault'
const USER_ID = new Uint8Array(16).fill(1) // fixed user

function b64url(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

function fromB64url(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/')
  while (str.length % 4) str += '='
  return Uint8Array.from(atob(str), c => c.charCodeAt(0))
}

// Check if device supports biometrics
export async function isBiometricAvailable() {
  try {
    if (!window.PublicKeyCredential) return false
    const available = await PublicKeyCredential
      .isUserVerifyingPlatformAuthenticatorAvailable()
    return available
  } catch {
    return false
  }
}

// Check if user has already registered biometric
export function isBiometricRegistered() {
  return !!localStorage.getItem('vaultBiometricCred')
}

// Register biometric for the first time
export async function registerBiometric() {
  const challenge = crypto.getRandomValues(new Uint8Array(32))

  const credential = await navigator.credentials.create({
    publicKey: {
      challenge,
      rp: { id: RP_ID, name: RP_NAME },
      user: {
        id: USER_ID,
        name: 'vault-user',
        displayName: 'Vault User',
      },
      pubKeyCredParams: [
        { type: 'public-key', alg: -7  }, // ES256
        { type: 'public-key', alg: -257 }, // RS256
      ],
      authenticatorSelection: {
        authenticatorAttachment: 'platform', // device only (not USB keys)
        userVerification: 'required',        // must verify with biometric
        residentKey: 'preferred',
      },
      timeout: 60000,
      attestation: 'none',
    }
  })

  // Save credential ID so we can use it next time
  const credId = b64url(credential.rawId)
  localStorage.setItem('vaultBiometricCred', credId)
  return credId
}

// Authenticate with biometric
export async function authenticateWithBiometric() {
  const savedCredId = localStorage.getItem('vaultBiometricCred')
  if (!savedCredId) throw new Error('No biometric registered')

  const challenge = crypto.getRandomValues(new Uint8Array(32))

  const assertion = await navigator.credentials.get({
    publicKey: {
      challenge,
      rpId: RP_ID,
      allowCredentials: [{
        type: 'public-key',
        id: fromB64url(savedCredId),
        transports: ['internal'],
      }],
      userVerification: 'required',
      timeout: 60000,
    }
  })

  // If we got here without error — biometric passed ✅
  return assertion !== null
}

// Remove biometric registration
export function removeBiometric() {
  localStorage.removeItem('vaultBiometricCred')
}