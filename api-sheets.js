import { google } from 'googleapis';

const SHEET_IDS = {
  primaNotaId: "1ctYH5gMGfqsg3TBbvfaf8QDtC8pIRletZBuPNIalzGI",
  prenotazioniId: "1hcbb9IK0b50aKJ_InvhgXEN4EhKIcIGDBccTTRZL918",
  presenzeId: "160wdLfAWtJxWOzv_CRlDsTwaw2bKigLeAzjgpKA6Ydk",
  abbonatiId: "1KnYJvzhvnip-erZU5RGexsNwTH33erP0POCfIuvy5Ic",
  sospesiId: "1AkZ_PJ6_1vaOb5-qLyCBmyZUwf4kCqs"
};

export default async function handler(req, res) {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS || '{}'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Read Prima Nota (latest month)
    const primaNotaResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_IDS.primaNotaId,
      range: 'FEBBRAIO 2026!A:H',
    });

    const primaNotaValues = primaNotaResponse.data.values || [];
    
    let lavaggoEntrate = 0, lavaggoUscite = 0;
    let parcheggioEntrate = 0, parcheggioUscite = 0;
    let sospesiTot = 0;

    // Parse Prima Nota
    for (let i = 1; i < primaNotaValues.length; i++) {
      const row = primaNotaValues[i];
      if (!row || row.length < 6) continue;

      const centro = (row[1] || '').toString().toUpperCase();
      const entrata = parseFloat((row[4] || '').toString().replace('€', '').replace(',', '.')) || 0;
      const uscite = parseFloat((row[5] || '').toString().replace('€', '').replace(',', '.')) || 0;
      const sospeso = parseFloat((row[7] || '').toString().replace('€', '').replace(',', '.')) || 0;

      if (centro.includes('LAVAGGIO')) {
        lavaggoEntrate += entrata;
        lavaggoUscite += uscite;
      } else if (centro.includes('PARCHEGGIO')) {
        parcheggioEntrate += entrata;
        parcheggioUscite += uscite;
      }
      sospesiTot += sospeso;
    }

    const entraateTot = lavaggoEntrate + parcheggioEntrate;
    const usciteTot = lavaggoUscite + parcheggioUscite;
    const utileNetto = entraateTot - usciteTot;
    const margine = entraateTot > 0 ? ((utileNetto / entraateTot) * 100).toFixed(1) : 0;

    const kpi = {
      lavaggio: { entrate: lavaggoEntrate, uscite: lavaggoUscite },
      parcheggio: { entrate: parcheggioEntrate, uscite: parcheggioUscite },
      entraateTotale: entraateTot,
      usciteTotale: usciteTot,
      utileNetto: utileNetto,
      margine: margine,
      sospesi: sospesiTot,
      timestamp: new Date().toLocaleString('it-IT')
    };

    res.status(200).json(kpi);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message });
  }
}
