import React from 'react';
import { LayoutDashboard, Check, X } from 'lucide-react';

export default function Dashboard({ totalCobrado, morososCount, totalPendiente }) {
  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <h2 className="font-black text-slate-400 text-xs uppercase tracking-widest">Estado de Caja</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
          <div className="bg-green-100 w-10 h-10 rounded-2xl flex items-center justify-center text-green-600 mb-3">
            <Check size={20} />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase">Cobrado</p>
          <p className="text-xl font-black">Gs. {totalCobrado.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
          <div className="bg-red-100 w-10 h-10 rounded-2xl flex items-center justify-center text-red-600 mb-3">
            <X size={20} />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase">Morosos</p>
          <p className="text-xl font-black">{morososCount}</p>
        </div>
      </div>
      <div className="bg-blue-600 p-6 rounded-3xl shadow-xl text-white">
        <p className="text-xs font-bold opacity-80 uppercase">Total por Recaudar</p>
        <p className="text-3xl font-black">Gs. {totalPendiente.toLocaleString()}</p>
      </div>
    </div>
  );
}