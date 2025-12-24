import React from 'react';
import { LayoutDashboard, Check, X, CalendarClock } from 'lucide-react';

export default function Dashboard({ totalCobrado, morososCount, totalPendiente, onGenerarMensualidades }) {
  
  // --- LÓGICA DE VALIDACIÓN ---
  // Obtenemos la fecha de hoy (formato AAAA-MM-DD)
  const hoy = new Date().toISOString().split('T')[0];
  // Verificamos si en la memoria del navegador ya figura que se cargó hoy
  const yaSeCargoHoy = localStorage.getItem('ultima_facturacion') === hoy;

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <h2 className="font-black text-slate-400 text-xs uppercase tracking-widest">Estado de Caja</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
          <div className="bg-green-100 w-10 h-10 rounded-2xl flex items-center justify-center text-green-600 mb-3">
            <Check size={20} />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase">Cobrado</p>
          <p className="text-xl font-black text-slate-800">Gs. {totalCobrado.toLocaleString()}</p>
        </div>

        <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
          <div className="bg-red-100 w-10 h-10 rounded-2xl flex items-center justify-center text-red-600 mb-3">
            <X size={20} />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase">Morosos</p>
          <p className="text-xl font-black text-slate-800">{morososCount}</p>
        </div>
      </div>

      <div className="bg-blue-600 p-6 rounded-3xl shadow-xl text-white">
        <p className="text-xs font-bold opacity-80 uppercase">Total por Recaudar</p>
        <p className="text-3xl font-black">Gs. {totalPendiente.toLocaleString()}</p>
      </div>

      {/* --- SECCIÓN: FACTURACIÓN MENSUAL CON VALIDACIÓN --- */}
      <div className="bg-slate-50 p-6 rounded-3xl border-2 border-dashed border-slate-200 mt-4">
        <div className="flex items-center gap-3 mb-3">
          <div className={`p-2 rounded-xl ${yaSeCargoHoy ? 'bg-slate-200 text-slate-400' : 'bg-blue-100 text-blue-600'}`}>
            <CalendarClock size={20} />
          </div>
          <div>
            <h3 className={`font-bold text-sm ${yaSeCargoHoy ? 'text-slate-400' : 'text-slate-800'}`}>
              {yaSeCargoHoy ? 'Facturación Completada' : 'Inicio de Mes'}
            </h3>
            <p className="text-[10px] text-slate-500 font-medium">
              {yaSeCargoHoy ? 'Vuelve el próximo mes' : 'Carga masiva de cuotas fijas'}
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600 mb-4 leading-relaxed">
          {yaSeCargoHoy 
            ? "Las cuotas de Gs. 33.000 ya han sido aplicadas a todos los vecinos hoy correctamente."
            : "Al presionar el botón, se sumarán Gs. 33.000 a la deuda de todos los vecinos registrados."
          }
        </p>

        <button 
          onClick={onGenerarMensualidades}
          disabled={yaSeCargoHoy} // BLOQUEA EL BOTÓN
          className={`w-full font-black py-4 rounded-2xl transition-all flex justify-center items-center gap-2 ${
            yaSeCargoHoy 
            ? 'bg-slate-100 text-slate-400 border-2 border-slate-200 cursor-not-allowed' 
            : 'bg-white hover:bg-blue-50 text-blue-600 border-2 border-blue-600 active:scale-95 shadow-sm'
          }`}
        >
          {yaSeCargoHoy ? 'CUOTAS YA GENERADAS HOY' : 'GENERAR CUOTAS (33.000)'}
        </button>
      </div>
    </div>
  );
}