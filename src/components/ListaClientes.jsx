import React from 'react';
import { Search, Pencil, Trash2, MessageCircle, Droplets } from 'lucide-react';

// 1. Agregamos onConexion a las llaves de los props
export default function ListaClientes({ clientes, busqueda, setBusqueda, onEdit, onDelete, onPay, onConexion }) {
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
        {clientes.filter(c => c.nombre.toLowerCase().includes(busqueda.toLowerCase())).map(c => (
          <div key={c.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-slate-800">{c.nombre}</h3>
                <div className="flex gap-2">
                  <p className="text-xs text-slate-400 font-mono text-[10px]">TEL: {c.tel}</p>
                  {/* 2. Mostramos la cédula si el cliente la tiene */}
                  {c.cedula && (
                    <p className="text-xs text-blue-400 font-mono text-[10px]">C.I.: {c.cedula}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-1">
                {/* 3. BOTÓN NUEVO: Icono de gota para el pago de conexión */}
                <button 
                  onClick={() => onConexion(c)} 
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Registrar Conexión"
                >
                  <Droplets size={16}/>
                </button>

                <button onClick={() => onEdit(c)} className="p-2 text-blue-500"><Pencil size={16}/></button>
                <button onClick={() => onDelete(c.id)} className="p-2 text-slate-300"><Trash2 size={16}/></button>
              </div>
            </div>
            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl">
              <p className={`text-sm font-black ${c.deuda > 0 ? 'text-red-500' : 'text-green-500'}`}>
                {c.deuda > 0 ? `DEBE Gs. ${c.deuda.toLocaleString()}` : 'AL DÍA'}
              </p>
              {c.deuda > 0 ? (
                <button onClick={() => onPay(c)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md">COBRAR</button>
              ) : (
                <button onClick={() => {
                  const msg = `*RECIBO AGUA*%0A${c.nombre}: PAGADO ✅`;
                  window.open(`https://wa.me/${c.tel}?text=${msg}`);
                }} className="bg-green-500 text-white p-2 rounded-lg shadow-md"><MessageCircle size={16}/></button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}