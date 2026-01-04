import { getClientStatusConfig } from '../utils/client.utils';

export default function ClientTable({ clients, onEdit, onDelete, onPay, canEdit }) {


    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm bg-white">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-xs border-b border-slate-200">
                        <tr>
                            <th className="px-4 py-3">Cliente</th>
                            <th className="px-4 py-3">Contacto</th>
                            <th className="px-4 py-3">Dirección</th>
                            <th className="px-4 py-3 text-center">Estado</th>
                            <th className="px-4 py-3 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {clients.map((client) => {
                            const status = getClientStatusConfig(client);
                            return (
                                <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-4 py-3 font-medium text-slate-800">
                                        {client.nombre_completo}
                                        <div className="text-xs text-slate-400 font-normal md:hidden">
                                            {client.cedula}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="text-slate-600">{client.telefono}</div>
                                        <div className="text-xs text-blue-400 font-mono hidden md:block">{client.cedula}</div>
                                    </td>
                                    <td className="px-4 py-3 text-slate-600 max-w-[200px] truncate" title={client.direccion}>
                                        {client.direccion}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
                                            {status.label}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => onPay(client)}
                                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Registrar Pago"
                                            >
                                                <Banknote size={18} />
                                            </button>
                                            {canEdit && (
                                                <>
                                                    <button
                                                        onClick={() => onEdit(client)}
                                                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Editar"
                                                    >
                                                        <Pencil size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => onDelete(client.id)}
                                                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {clients.length === 0 && (
                <div className="p-8 text-center text-slate-400 text-sm">
                    No se encontraron clientes.
                </div>
            )}
        </div>
    );
}
