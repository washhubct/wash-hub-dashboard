import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const [kpi, setKpi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/sheets');
      const data = await response.json();
      setKpi(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">Caricamento dati...</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-red-500">Errore: {error}</div>;
  if (!kpi) return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">Nessun dato disponibile</div>;

  const chartData = [
    { name: 'Lavaggio', entrate: kpi.lavaggio.entrate, uscite: kpi.lavaggio.uscite },
    { name: 'Parcheggio', entrate: kpi.parcheggio.entrate, uscite: kpi.parcheggio.uscite },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {/* HEADER */}
      <div className="mb-8 pb-6 border-b border-gray-700">
        <h1 className="text-4xl font-bold text-cyan-400">WASH HUB LUNGOMARE</h1>
        <p className="text-gray-400 mt-2">Business Intelligence Dashboard</p>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="text-gray-400 text-sm uppercase tracking-wider mb-2">💰 Ricavi Totali</div>
          <div className="text-3xl font-bold text-cyan-400">€{kpi.entraateTotale?.toFixed(2) || '0'}</div>
          <div className="text-gray-500 text-sm mt-2">Entrate totali</div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="text-gray-400 text-sm uppercase tracking-wider mb-2">📤 Uscite Totali</div>
          <div className="text-3xl font-bold text-red-400">€{kpi.usciteTotale?.toFixed(2) || '0'}</div>
          <div className="text-gray-500 text-sm mt-2">Costi operativi</div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="text-gray-400 text-sm uppercase tracking-wider mb-2">📈 Utile Netto</div>
          <div className="text-3xl font-bold text-green-400">€{kpi.utileNetto?.toFixed(2) || '0'}</div>
          <div className="text-gray-500 text-sm mt-2">Margine {kpi.margine}%</div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="text-gray-400 text-sm uppercase tracking-wider mb-2">⚠️ Sospesi</div>
          <div className="text-3xl font-bold text-yellow-400">€{kpi.sospesi?.toFixed(2) || '0'}</div>
          <div className="text-gray-500 text-sm mt-2">Da riscuotere</div>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CHART 1: Entrate vs Uscite */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Entrate vs Uscite</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip />
              <Legend />
              <Bar dataKey="entrate" fill="#06b6d4" />
              <Bar dataKey="uscite" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* CHART 2: Margine */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Performance</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Lavaggio</span>
                <span className="text-cyan-400 font-bold">{((kpi.lavaggio.entrate - kpi.lavaggio.uscite) / kpi.lavaggio.entrate * 100).toFixed(1)}%</span>
              </div>
              <div className="bg-gray-700 rounded h-2 overflow-hidden">
                <div className="bg-cyan-400 h-full" style={{width: `${((kpi.lavaggio.entrate - kpi.lavaggio.uscite) / kpi.lavaggio.entrate * 100)}%`}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Parcheggio</span>
                <span className="text-orange-400 font-bold">{((kpi.parcheggio.entrate - kpi.parcheggio.uscite) / kpi.parcheggio.entrate * 100).toFixed(1)}%</span>
              </div>
              <div className="bg-gray-700 rounded h-2 overflow-hidden">
                <div className="bg-orange-400 h-full" style={{width: `${((kpi.parcheggio.entrate - kpi.parcheggio.uscite) / kpi.parcheggio.entrate * 100)}%`}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* REFRESH BUTTON */}
      <div className="mt-8 text-center">
        <button 
          onClick={fetchData}
          className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-2 px-6 rounded transition"
        >
          Aggiorna Dati
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
