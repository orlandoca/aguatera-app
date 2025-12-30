import React from 'react';
import { Search, Pencil, Trash2, Banknote } from 'lucide-react';

export default function ListaClientes({
  clientes,
  busqueda,
  setBusqueda,
  onEdit,
  onDelete,
  onPay,
  canEdit = true
}) {

  return (
    <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-300">
      <div className="relative">
        <Search className="absolute left-4 top-4 text-slate-400" size={18} />
        <input
          type="text" placeholder="Buscar vecino..."
          className="w-full p-4 pl-12 rounded-2xl border-none shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <div className="space-y-3">
        {clientes.filter(c => c.nombre_completo?.toLowerCase().includes(busqueda.toLowerCase())).map(c => {

          return (
            <div key={c.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h3 className="font-bold text-slate-800">{c.nombre_completo}</h3>
                  <div className="flex gap-2">
                    <p className="text-xs text-slate-400 font-mono text-[10px]">TEL: {c.telefono}</p>
                    {c.cedula && <p className="text-xs text-blue-400 font-mono text-[10px]">C.I.: {c.cedula}</p>}
                  </div>
                </div>

                <div className="flex gap-1">
                  {canEdit && (
                    <>
                      <button onClick={() => onEdit(c)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Pencil size={16} /></button>
                      <button onClick={() => onDelete(c.id)} className="p-2 text-slate-300 hover:bg-red-50 hover:text-red-500 rounded-lg"><Trash2 size={16} /></button>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl">
                <div className="flex gap-2 w-full">
                  <button
                    onClick={() => onPay(c)}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md flex items-center justify-center gap-2 hover:bg-blue-700 transition"
                  >
                    <Banknote size={16} /> REGISTRAR PAGO
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}