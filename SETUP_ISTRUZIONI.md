# 🚀 WASH HUB LUNGOMARE - Dashboard Setup Guide

## ✅ Passo 1: Crea il Progetto su GitLab

1. Vai su **https://gitlab.com**
2. Accedi con il tuo account
3. Clicca **"New project"**
4. Seleziona **"Create blank project"**
5. **Nome:** `wash-hub-dashboard`
6. **Visibility:** Public
7. Clicca **"Create project"**

---

## ✅ Passo 2: Carica il Codice su GitLab

### Via GitLab Web UI (Più semplice):

1. Nel tuo nuovo progetto GitLab, clicca **"+"** → **"New file"**
2. Per ogni file qui sotto, crea il file con il nome esatto:

#### **File 1: package.json**
Crea file → Incolla il contenuto → Commit

#### **File 2: next.config.js**
Crea file → Incolla il contenuto → Commit

#### **File 3: pages/index.js**
- Crea cartella "pages"
- Crea file "index.js" dentro
- Incolla il contenuto del file `pages-index.jsx`

#### **File 4: pages/api/sheets.js**
- Crea cartella "api" dentro "pages"
- Crea file "sheets.js"
- Incolla il contenuto del file `api-sheets.js`

#### **File 5: .env.local**
```
GOOGLE_CREDENTIALS={}
```

#### **File 6: tailwind.config.js**
```javascript
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

#### **File 7: postcss.config.js**
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

---

## ✅ Passo 3: Crea Service Account Google

1. Vai su **https://console.cloud.google.com**
2. Crea un nuovo progetto: clicca il nome del progetto in alto → **"New Project"** → **"WASH-HUB"** → **Create**
3. Aspetta 30 secondi che si carichi
4. Cerca **"Google Sheets API"** nella barra di ricerca
5. Clicca su **"Google Sheets API"** → **Enable**
6. Vai a **"IAM & Admin"** → **"Service Accounts"**
7. Clicca **"Create Service Account"**
8. **Nome:** `wash-hub-reader`
9. Clicca **Create and Continue**
10. Clicca **Continue** (senza aggiungere ruoli)
11. Nel tab **"Keys"**, clicca **"Add Key"** → **"Create new key"**
12. Seleziona **JSON** → **Create**
13. **Scarica il file JSON** (salva come `credentials.json`)

---

## ✅ Passo 4: Autorizza i Google Sheets

1. Apri `credentials.json` che hai scaricato
2. Copia l'email del service account (tipo: `wash-hub-reader@xxxx.iam.gserviceaccount.com`)
3. Per ogni Google Sheet (Prima Nota, Prenotazioni, Presenze, Abbonamenti, Sospesi):
   - Apri il foglio
   - Clicca **"Condividi"** in alto
   - Incolla l'email del Service Account
   - Dai permesso **"Visualizzatore"**
   - Clicca **"Condividi"**

---

## ✅ Passo 5: Configura Vercel

1. Vai su **https://vercel.com**
2. Accedi con il tuo account
3. Clicca **"New Project"**
4. Seleziona **"Import Git Repository"**
5. Connetti **GitLab**:
   - Clicca "GitLab" nella lista
   - Autorizza Vercel su GitLab
6. Seleziona il progetto **`wash-hub-dashboard`**
7. **Environment Variables:**
   - Clicca **"Environment Variables"**
   - **Nome:** `GOOGLE_CREDENTIALS`
   - **Valore:** Copia tutto il contenuto di `credentials.json` (il JSON completo)
   - Clicca **"Add"**
8. Clicca **"Deploy"**
9. Aspetta 2-3 minuti
10. **Avrai il link della dashboard!** 🎉

---

## ✅ Passo 6: Test

1. Apri il link che ti da Vercel
2. Dovresti vedere la dashboard con i KPI
3. Clicca "Aggiorna Dati" per testare l'API

---

## ⚠️ TROUBLESHOOTING

### "Module not found"
- Su GitLab assicurati che la struttura delle cartelle sia corretta
- Vercel dovrebbe riconoscere automaticamente un progetto Next.js

### "API Error"
- Controlla che il JSON di `credentials.json` sia incollato correttamente in Vercel
- Verifica che i Google Sheets siano condivisi con il Service Account

### "No data showing"
- Assicurati che il foglio **"FEBBRAIO 2026"** esista nella Prima Nota
- Controlla i nomi dei fogli nei SHEET_IDS dentro `api/sheets.js`

---

## 📞 Se hai problemi:

1. Controlla che tutti i file siano su GitLab con i nomi esatti
2. Verifica che `credentials.json` sia incollato correttamente in Vercel
3. Riavvia il deploy da Vercel: vai al progetto → clicca il deploy → "Redeploy"

---

**Quando è pronto, avrai una dashboard bellissima che legge LIVE i tuoi Google Sheets!** 🚀

