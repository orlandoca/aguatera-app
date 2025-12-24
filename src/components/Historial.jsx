import React, { useState } from 'react';
import { Calendar, DollarSign, Droplets, ReceiptText } from 'lucide-react';

export default function Historial({ pagos, pagosConexion = [] }) {
  const [tabActual, setTabActual] = useState('mensual'); // 'mensual' o 'conexion'

  // Cálculos de totales
  const totalMensual = pagos.reduce((acc, p) => acc + Number(p.monto), 0);
  const totalConexion = pagosConexion.reduce((acc, p) => acc + Number(p.monto), 0);

  // Seleccionar qué lista mostrar
  const listaAMostrar = tabActual === 'mensual' ? pagos : pagosConexion;
  const totalActual = tabActual === 'mensual' ? totalMensual : totalConexion;

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      
      {/* SELECTOR DE PESTAÑAS */}
      <div className="flex bg-slate-200 p-1 rounded-2xl gap-1">
        <button 
          onClick={() => setTabActual('mensual')}
          className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${tabActual === 'mensual' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
        >
          Mensualidades
        </button>
        <button 
          onClick={() => setTabActual('conexion')}
          className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${tabActual === 'conexion' ? 'bg-white text-green-600 shadow-sm' : 'text-slate-500'}`}
        >
          Conexiones
        </button>
      </div>

      {/* Resumen Dinámico */}
      <div className={`p-6 rounded-3xl shadow-sm border transition-colors flex items-center gap-4 ${tabActual === 'mensual' ? 'bg-white border-slate-100' : 'bg-green-50 border-green-100'}`}>
        <div className={`${tabActual === 'mensual' ? 'bg-blue-600' : 'bg-green-600'} p-3 rounded-2xl text-white shadow-lg`}>
          {tabActual === 'mensual' ? <ReceiptText size={24} /> : <Droplets size={24} />}
        </div>
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase leading-none mb-1">
            Total {tabActual === 'mensual' ? 'Mensualidades' : 'en Conexiones'}
          </p>
          <p className={`text-2xl font-black ${tabActual === 'mensual' ? 'text-slate-800' : 'text-green-700'}`}>
            Gs. {totalActual.toLocaleString()}
          </p>
        </div>
      </div>

      <h2 className="font-black text-slate-400 text-[10px] uppercase tracking-widest ml-2">
        Movimientos Recientes ({listaAMostrar.length})
      </h2>

      {/* Lista de Movimientos */}
      <div className="space-y-2">
        {listaAMostrar.length === 0 ? (
          <p className="text-center py-10 text-slate-400 italic text-sm">No hay registros en esta categoría.</p>
        ) : (
          listaAMostrar.map((p) => (
            <div key={p.id} className="bg-white p-4 rounded-2xl flex justify-between items-center border border-slate-50 shadow-sm hover:border-slate-200 transition-all">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${tabActual === 'mensual' ? 'bg-blue-50 text-blue-500' : 'bg-green-50 text-green-500'}`}>
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm leading-tight">
                    {/* Para conexión necesitamos buscar el nombre si no viene en el join */}
                    {p.clientes?.nombre || p.nombre_cliente || 'Registro de Pago'}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {new Date(p.fecha_pago).toLocaleString('es-PY')}
                    {p.referencia && <span className="block text-blue-500 font-bold uppercase mt-0.5">Ref: {p.referencia}</span>}
                  </p>
                </div>
              </div>
              <p className={`font-black text-sm ${tabActual === 'mensual' ? 'text-blue-600' : 'text-green-600'}`}>
                + {Number(p.monto).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}