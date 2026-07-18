# 🔐 My Vault

> Your personal encrypted vault — store passwords, documents, photos and secrets safely on your device. No cloud. No account. Only you.

![My Vault](https://img.shields.io/badge/Encrypted-AES--256-purple?style=for-the-badge)
![No Cloud](https://img.shields.io/badge/Cloud-Never-red?style=for-the-badge)
![PWA](https://img.shields.io/badge/PWA-Installable-blue?style=for-the-badge)

## 🌐 Live App

**👉 [Open My Vault](https://yubarajsaha.github.io/my-vault-react)**

---

## 📲 Install on Your Device

### 🍎 iPhone
1. Open **Safari** on your iPhone
2. Go to [https://yubarajsaha.github.io/my-vault-react](https://yubarajsaha.github.io/my-vault-react)
3. Tap the **Share button** (box with arrow at the bottom)
4. Tap **"Add to Home Screen"**
5. Tap **Add**
6. ✅ App appears on your home screen!

### 🤖 Android
1. Open **Chrome** on your Android phone
2. Go to [https://yubarajsaha.github.io/my-vault-react](https://yubarajsaha.github.io/my-vault-react)
3. Tap the **3 dots menu** (top right)
4. Tap **"Add to Home Screen"**
5. Tap **Install**
6. ✅ App installed like a native app!

### 🪟 Windows
1. Open **Google Chrome** on your laptop
2. Go to [https://yubarajsaha.github.io/my-vault-react](https://yubarajsaha.github.io/my-vault-react)
3. Look for the **install icon** in the address bar (computer with + sign)
4. Click it → Click **Install**
5. ✅ App opens like a standalone desktop app!

### 🍎 Mac
1. Open **Safari** or **Chrome**
2. Go to the app URL
3. Safari: File menu → **Add to Dock**
4. Chrome: Install icon in address bar → **Install**
5. ✅ Done!

---

## ✨ Features

| Feature | Details |
|---|---|
| 🔒 **Encryption** | AES-256-GCM — same as banks |
| 👆 **Biometric** | Fingerprint / Face ID unlock |
| 📄 **Documents** | Store Aadhaar, PAN, Passport etc |
| 🖼️ **Photos** | Private encrypted photo vault |
| 🔑 **Secrets** | Passwords, PINs, notes |
| 📵 **No Cloud** | Everything stays on your device |
| 📲 **Installable** | Works on iPhone, Android, Windows, Mac |
| 🌐 **Offline** | Works without internet after install |

---

## 🛡️ Security

- All data encrypted with **AES-256-GCM** before saving
- Master password never stored — only used to derive encryption key
- **PBKDF2** with 200,000 iterations for key derivation
- Biometric via **WebAuthn API** — fingerprint/face never leaves your device
- Zero data sent to any server — ever

---

## 🛠️ Built With

- **React + Vite** — fast modern frontend
- **Web Crypto API** — built-in browser encryption
- **WebAuthn API** — biometric authentication
- **PWA** — installable on any device
- **localStorage** — encrypted local storage

---

## 🚀 Run Locally

```bash
# Clone the repo
git clone https://github.com/Yubarajsaha/my-vault-react.git

# Go into the folder
cd my-vault-react

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 📁 Project Structure
my-vault-react/
├── src/
│   ├── components/
│   │   ├── LoginScreen.jsx    # Login + biometric screen
│   │   ├── HomePage.jsx       # Dashboard
│   │   ├── DocsPage.jsx       # Documents section
│   │   ├── PhotosPage.jsx     # Photos grid
│   │   ├── AddPage.jsx        # Add new items
│   │   ├── ProfilePage.jsx    # User profile
│   │   ├── SettingsPage.jsx   # App settings
│   │   └── BottomNav.jsx      # Navigation
│   ├── crypto.js              # AES-256 encryption
│   ├── biometric.js           # WebAuthn biometric
│   ├── store.js               # Encrypted storage
│   └── App.jsx                # Main app
├── public/
│   ├── manifest.json          # PWA manifest
│   └── sw.js                  # Service worker
└── .github/
└── workflows/
└── deploy.yml         # Auto deploy to GitHub Pages

---

## 📄 License

MIT License — free to use and modify.

---

Made with ❤️ — Your data, your device, your control.

