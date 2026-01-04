import React, { useState } from 'react';
import { Search, LayoutGrid, List, Filter } from 'lucide-react';
import ClientCard from './ClientCard';
import ClientTable from './ClientTable';
import { CLIENT_FILTERS, filterClientsByStatus } from '../utils/client.utils';

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
  const [filterMode, setFilterMode] = useState(CLIENT_FILTERS.ALL);

  // 1. Filtrar por estado
  const statusFiltered = filterClientsByStatus(clientes, filterMode);

  // 2. Filtrar por búsqueda
  const filteredClients = statusFiltered.filter(c =>
    c.nombre_completo?.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.cedula?.includes(busqueda)
  );

  const FilterButton = ({ mode, label }) => (
    <button
      onClick={() => setFilterMode(mode)}
      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filterMode === mode
          ? 'bg-blue-600 text-white shadow-md'
          : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
        }`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-300">

      {/* Controles Principales */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Buscar por nombre o cédula..."
              className="w-full p-4 pl-12 rounded-2xl border-none shadow-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="flex bg-slate-200/50 p-1 rounded-xl gap-1 self-end md:self-auto">
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

        {/* Barra de Filtros */}
        <div className="flex flex-wrap gap-2 items-center pb-2 overflow-x-auto no-scrollbar">
          <span className="text-slate-400 text-xs font-bold mr-2 flex items-center gap-1">
            <Filter size={14} /> FILTRAR:
          </span>
          <FilterButton mode={CLIENT_FILTERS.ALL} label="Todos" />
          <FilterButton mode={CLIENT_FILTERS.ACTIVE} label="Al Día" />
          <FilterButton mode={CLIENT_FILTERS.DEBT} label="Con Deuda" />
          <FilterButton mode={CLIENT_FILTERS.INACTIVE} label="Inactivos/Cortados" />
        </div>
      </div>

      {/* Resultados */}
      <div className="mt-2 text-xs text-slate-400 font-medium px-1">
        Mostrando {filteredClients.length} vecino{filteredClients.length !== 1 && 's'}
      </div>

      <div>
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

      {filteredClients.length === 0 && (
        <div className="text-center py-16 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
          <div className="mx-auto w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
            <Search className="text-slate-300" />
          </div>
          <p className="text-slate-500 font-medium">No se encontraron clientes</p>
          <p className="text-slate-400 text-xs mt-1">Intenta cambiar los filtros o el término de búsqueda</p>
        </div>
      )}
    </div>
  );
}
