import React from 'react';
import { Calendar, Download, ReceiptText } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function Historial({ pagos }) {

  // Cálculos de totales
  const totalMensual = pagos.reduce((acc, p) => acc + Number(p.monto), 0);

  // --- FUNCIÓN PARA EXPORTAR ---
  const exportarExcel = () => {
    if (pagos.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }

    const datosExcel = pagos.map(p => ({
      Fecha: new Date(p.created_at || p.fecha_pago).toLocaleString('es-PY'),
      Cliente: p.clientes?.nombre_completo || 'Sin Nombre',
      Monto: Number(p.monto),
      Metodo: p.metodo,
      Referencia: p.referencia || '-'
    }));

    const hoja = XLSX.utils.json_to_sheet(datosExcel);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Reporte");

    const nombreArchivo = `Reporte_Pagos_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(libro, nombreArchivo);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500">

      {/* CABECERA CON BOTÓN DE EXPORTAR */}
      <div className="flex justify-between items-center px-1">
        <h2 className="font-black text-slate-800 text-lg uppercase tracking-tight">Historial</h2>
        <button
          onClick={exportarExcel}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-2xl text-[10px] font-black hover:bg-green-700 transition-all shadow-md active:scale-95"
        >
          <Download size={14} />
          BAJAR EXCEL
        </button>
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
          pagos.map((p) => (
            <div key={p.id} className="bg-white p-4 rounded-2xl flex justify-between items-center border border-slate-50 shadow-sm hover:border-slate-200 transition-all">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-500">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm leading-tight">
                    {p.clientes?.nombre_completo || 'Pago registrado'}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {new Date(p.created_at || p.fecha_pago).toLocaleString('es-PY')}
                    {p.referencia && <span className="block text-blue-500 font-bold uppercase mt-0.5">Ref: {p.referencia}</span>}
                  </p>
                </div>
              </div>
              <p className="font-black text-sm text-blue-600">
                + {Number(p.monto).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}