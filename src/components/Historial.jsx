import React from 'react';
import { Calendar, ArrowLeft, DollarSign } from 'lucide-react';

export default function Historial({ pagos }) {
  // Calcular el total de la lista actual
  const totalRecaudado = pagos.reduce((acc, p) => acc + Number(p.monto), 0);

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-black text-slate-400 text-xs uppercase tracking-widest">Registros de Cobranza</h2>
        <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-md">
          {pagos.length} PAGOS
        </span>
      </div>

      {/* Resumen de Caja Rápido */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
        <div className="bg-green-500 p-3 rounded-2xl text-white">
          <DollarSign size={24} />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase leading-none mb-1">Total en Caja</p>
          <p className="text-2xl font-black text-slate-800">Gs. {totalRecaudado.toLocaleString()}</p>
        </div>
      </div>

      {/* Lista de Movimientos */}
      <div className="space-y-2">
        {pagos.length === 0 ? (
          <p className="text-center py-10 text-slate-400 italic text-sm">No hay pagos registrados aún.</p>
        ) : (
          pagos.map((p) => (
            <div key={p.id} className="bg-white p-4 rounded-2xl flex justify-between items-center border border-slate-50 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="bg-slate-100 p-2 rounded-xl text-slate-500">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm leading-tight">
                    {p.clientes?.nombre || 'Cliente eliminado'}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium lowercase">
                    {new Date(p.fecha_pago).toLocaleString('es-PY')}
                  </p>
                </div>
              </div>
              <p className="font-black text-green-600 text-sm">
                + {Number(p.monto).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}