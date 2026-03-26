# 📁 WASH HUB DASHBOARD - File Structure

Ecco la struttura ESATTA che devi creare su GitLab:

```
wash-hub-dashboard/
├── pages/
│   ├── index.js          (← pages-index.jsx)
│   ├── _app.js           (nuovo file da creare)
│   └── api/
│       └── sheets.js     (← api-sheets.js)
├── public/
│   └── favicon.ico       (puoi lasciare vuoto)
├── package.json
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.local
└── .gitignore            (nuovo file da creare)
```

---

## 📄 FILE AGGIUNTIVI DA CREARE:

### **1. pages/_app.js**
```javascript
import 'tailwindcss/tailwind.css'

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp
```

### **2. .gitignore**
```
node_modules/
.next/
.env.local
*.log
.DS_Store
```

---

## 📝 RIEPILOGO FILE CHE HAI NEI DOWNLOAD:

✅ `package.json` - Dipendenze del progetto
✅ `next.config.js` - Configurazione Next.js
✅ `pages-index.jsx` - Rinomina in `pages/index.js`
✅ `api-sheets.js` - Rinomina in `pages/api/sheets.js`
✅ `tailwind.config.js` - CSS Framework
✅ `postcss.config.js` - PostCSS config
✅ `.env.local` - Variabili ambiente
✅ `SETUP_ISTRUZIONI.md` - Guida completa
✅ `STRUTTURA_PROGETTI.md` - Questo file

---

## 🚀 NEXT STEPS:

1. Crea il progetto su GitLab
2. Crea la struttura di cartelle (pages/, public/, api/)
3. Carica i file
4. Crea il Service Account Google
5. Deploy su Vercel

**Segui il file SETUP_ISTRUZIONI.md passo dopo passo!**
