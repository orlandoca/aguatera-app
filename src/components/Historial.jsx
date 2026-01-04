import React from 'react';
import { Calendar, ReceiptText, Zap, CalendarRange } from 'lucide-react';

export default function Historial({ pagos }) {

  // Cálculos de totales
  const totalMensual = pagos.reduce((acc, p) => acc + Number(p.monto), 0);

  // --- FUNCIÓN PARA EXPORTAR ---


  const getPaymentStyle = (tipo) => {
    switch (tipo) {
      case 'conexion':
        return {
          bg: 'bg-purple-50',
          text: 'text-purple-600',
          icon: <Zap size={18} />,
          label: 'CONEXIÓN'
        };
      case 'mensualidad':
        return {
          bg: 'bg-blue-50',
          text: 'text-blue-600',
          icon: <CalendarRange size={18} />,
          label: 'MENSUAL'
        };
      default:
        return {
          bg: 'bg-slate-50',
          text: 'text-slate-500',
          icon: <Calendar size={18} />,
          label: 'PAGO'
        };
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500">

      {/* CABECERA */}
      <div className="flex justify-between items-center px-1">
        <h2 className="font-black text-slate-800 text-lg uppercase tracking-tight">Historial</h2>
      </div>

      {/* Resumen */}
      <div className="p-6 rounded-3xl shadow-sm border border-slate-100 bg-white flex items-center gap-4">
        <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg">
          <ReceiptText size={24} />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase leading-none mb-1">
            Total Recaudado
          </p>
          <p className="text-2xl font-black text-slate-800">
            Gs. {totalMensual.toLocaleString()}
          </p>
        </div>
      </div>

      <h2 className="font-black text-slate-400 text-[10px] uppercase tracking-widest ml-2">
        Movimientos Recientes ({pagos.length})
      </h2>

      {/* Lista de Movimientos */}
      <div className="space-y-2 pb-10">
        {pagos.length === 0 ? (
          <p className="text-center py-10 text-slate-400 italic text-sm">No hay registros.</p>
        ) : (
          pagos.map((p) => {
            const style = getPaymentStyle(p.tipo);
            return (
              <div key={p.id} className="bg-white p-4 rounded-2xl flex justify-between items-center border border-slate-50 shadow-sm hover:border-slate-200 transition-all">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${style.bg} ${style.text}`}>
                    {style.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${style.bg} ${style.text} uppercase`}>
                        {style.label}
                      </span>
                      <p className="font-bold text-slate-800 text-sm leading-tight">
                        {p.clientes?.nombre_completo || 'Pago registrado'}
                      </p>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium mt-1">
                      {new Date(p.created_at || p.fecha_pago).toLocaleString('es-PY')}
                      {p.referencia && <span className="block text-slate-500 font-bold uppercase mt-0.5">Ref: {p.referencia}</span>}
                    </p>
                  </div>
                </div>
                <p className="font-black text-sm text-blue-600">
                  + {Number(p.monto).toLocaleString()}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}