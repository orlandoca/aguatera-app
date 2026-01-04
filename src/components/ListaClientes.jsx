import React, { useState } from 'react';
import { Search, LayoutGrid, List } from 'lucide-react';
import ClientCard from './ClientCard';
import ClientTable from './ClientTable';

export default function ListaClientes({
  clientes,
  busqueda,
  setBusqueda,
  onEdit,
  onDelete,
  onPay,
  canEdit = true
}) {
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'

  const filteredClients = clientes.filter(c =>
    c.nombre_completo?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Buscar vecino..."
            className="w-full p-4 pl-12 rounded-2xl border-none shadow-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="flex bg-slate-200/50 p-1 rounded-xl gap-1">
          <button
            onClick={() => setViewMode('cards')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'cards'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
              }`}
            title="Vista de Tarjetas"
          >
            <LayoutGrid size={20} />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'table'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
              }`}
            title="Vista de Tabla"
          >
            <List size={20} />
          </button>
        </div>
      </div>

      <div className="mt-6">
        {viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClients.map(client => (
              <ClientCard
                key={client.id}
                client={client}
                onEdit={onEdit}
                onDelete={onDelete}
                onPay={onPay}
                canEdit={canEdit}
              />
            ))}
          </div>
        ) : (
          <ClientTable
            clients={filteredClients}
            onEdit={onEdit}
            onDelete={onDelete}
            onPay={onPay}
            canEdit={canEdit}
          />
        )}
      </div>

      {filteredClients.length === 0 && viewMode === 'cards' && (
        <div className="text-center py-12 text-slate-400">
          No se encontraron resultados para "{busqueda}"
        </div>
      )}
    </div>
  );
}
