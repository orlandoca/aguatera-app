import React from 'react';
import { Check } from 'lucide-react';

export default function Dashboard({ totalCobrado }) {

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <h2 className="font-black text-slate-400 text-xs uppercase tracking-widest">Resumen General</h2>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase">Total Cobrado (Histórico)</p>
          <p className="text-3xl font-black text-slate-800">Gs. {totalCobrado.toLocaleString()}</p>
        </div>
        <div className="bg-green-100 w-12 h-12 rounded-2xl flex items-center justify-center text-green-600">
          <Check size={24} />
        </div>
      </div>

    </div>
  );
}