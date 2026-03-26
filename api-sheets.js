export default async function handler(req, res) {
  try {
    // IDs dei tuoi Google Sheets
    const SHEET_IDS = {
      primaNotaId: "1ctYH5gMGfqsg3TBbvfaf8QDtC8pIRletZBuPNIalzGI",
    };

    // Funzione per leggere da Google Sheets tramite CSV export
    const fetchSheetData = async (sheetId, sheetName) => {
      const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Errore lettura foglio: ${response.status}`);
      
      const csv = await response.text();
      const lines = csv.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) throw new Error('Foglio vuoto o non accessibile');
      
      const headers = lines[0].split('\t').map(h => h.trim());
      const rows = [];
      
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
          const values = lines[i].split('\t').map(v => v.trim());
          const row = {};
          headers.forEach((header, idx) => {
            row[header] = values[idx] || '';
          });
          rows.push(row);
        }
      }
      
      return { headers, rows };
    };

    // Leggi Prima Nota (FEBBRAIO 2026)
    const primaNotaData = await fetchSheetData(SHEET_IDS.primaNotaId, 'FEBBRAIO 2026');
    
    let lavaggoEntrate = 0, lavaggoUscite = 0;
    let parcheggioEntrate = 0, parcheggioUscite = 0;
    let sospesiTot = 0;

    // Parse Prima Nota
    primaNotaData.rows.forEach(row => {
      const centro = (row['CENTRO DI COSTO'] || '').toUpperCase();
      const entrata = parseFloat((row['ENTRATA'] || '').toString().replace(/[€\s]/g, '').replace(',', '.')) || 0;
      const uscite = parseFloat((row['USCITE'] || '').toString().replace(/[€\s]/g, '').replace(',', '.')) || 0;
      const sospeso = parseFloat((row['SOSPESO'] || '').toString().replace(/[€\s]/g, '').replace(',', '.')) || 0;

      if (centro.includes('LAVAGGIO')) {
        lavaggoEntrate += entrata;
        lavaggoUscite += uscite;
      } else if (centro.includes('PARCHEGGIO') || centro.includes('ABBONAMENTO')) {
        parcheggioEntrate += entrata;
        parcheggioUscite += uscite;
      }
      
      sospesiTot += sospeso;
    });

    const entraateTot = lavaggoEntrate + parcheggioEntrate;
    const usciteTot = lavaggoUscite + parcheggioUscite;
    const utileNetto = entraateTot - usciteTot;
    const margine = entraateTot > 0 ? ((utileNetto / entraateTot) * 100).toFixed(1) : 0;

    const kpi = {
      lavaggio: { 
        entrate: Math.round(lavaggoEntrate * 100) / 100, 
        uscite: Math.round(lavaggoUscite * 100) / 100 
      },
      parcheggio: { 
        entrate: Math.round(parcheggioEntrate * 100) / 100, 
        uscite: Math.round(parcheggioUscite * 100) / 100 
      },
      entraateTotale: Math.round(entraateTot * 100) / 100,
      usciteTotale: Math.round(usciteTot * 100) / 100,
      utileNetto: Math.round(utileNetto * 100) / 100,
      margine: margine,
      sospesi: Math.round(sospesiTot * 100) / 100,
      timestamp: new Date().toLocaleString('it-IT'),
      source: 'FEBBRAIO 2026'
    };

    res.status(200).json(kpi);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: error.message,
      note: 'Assicurati che i Google Sheets siano pubblici "chiunque con il link"'
    });
  }
}
