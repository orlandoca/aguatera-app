import React, { useState } from 'react';

export default function FormularioConexion({ clienteId, nombreCliente, onGuardar, onCancelar }) {
  return (
    <form onSubmit={onGuardar} className="space-y-4 animate-in fade-in duration-300">
      <div className="bg-blue-50 p-4 rounded-2xl mb-4">
        <p className="text-blue-600 text-xs font-bold uppercase">Pago de Conexión Única</p>
        <p className="font-black text-slate-700">{nombreCliente}</p>
      </div>

      <div className="space-y-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        {/* Monto Variable */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Monto Gs. (Variable)</label>
          <input 
            name="monto" 
            type="number" 
            min="1200000" 
            max="2000000"
            defaultValue="1200000"
            required 
            className="w-full p-4 bg-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-lg" 
          />
        </div>

        {/* Método de Pago */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Método de Pago</label>
          <select name="metodo" className="w-full p-4 bg-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500">
            <option value="Efectivo">Efectivo</option>
            <option value="Transferencia">Transferencia</option>
          </select>
        </div>

        {/* Referencia / Observación */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Referencia / Comprobante</label>
          <textarea 
            name="referencia" 
            placeholder="Ej: Nro de transferencia o detalle de distancia..." 
            className="w-full p-4 bg-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 h-24"
          />
        </div>

        <div className="flex gap-2 pt-2">
          <button type="button" onClick={onCancelar} className="flex-1 p-4 font-bold text-slate-400">Cancelar</button>
          <button type="submit" className="flex-1 p-4 bg-green-600 text-white rounded-xl font-bold shadow-lg">Registrar Conexión</button>
        </div>
      </div>
    </form>
  );
}