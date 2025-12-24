import React from 'react';

export default function Formulario({ clienteEdicion, onGuardar, onCancelar }) {
  return (
    <form onSubmit={onGuardar} className="space-y-4 animate-in zoom-in-95 duration-200">
      <h2 className="font-black text-xl">{clienteEdicion ? 'Actualizar Datos' : 'Registrar Vecino'}</h2>
      <div className="space-y-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        
        {/* Nuevo campo: Cédula */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Número de Cédula</label>
          <input 
            name="cedula" 
            defaultValue={clienteEdicion?.cedula} 
            placeholder="Ej: 1.234.567" 
            required 
            className="w-full p-4 bg-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
          />
        </div>

        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Nombre Completo</label>
          <input name="nombre" defaultValue={clienteEdicion?.nombre} placeholder="Ej: Juan Pérez" required className="w-full p-4 bg-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">WhatsApp</label>
          <input name="tel" defaultValue={clienteEdicion?.tel} placeholder="Ej: 5959..." required className="w-full p-4 bg-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Deuda Gs.</label>
          <input name="deuda" type="number" defaultValue={clienteEdicion?.deuda || 0} placeholder="0" className="w-full p-4 bg-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div className="flex gap-2 pt-2">
          <button type="button" onClick={onCancelar} className="flex-1 p-4 font-bold text-slate-400">Cancelar</button>
          <button type="submit" className="flex-1 p-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg">Guardar</button>
        </div>
      </div>
    </form>
  );
}