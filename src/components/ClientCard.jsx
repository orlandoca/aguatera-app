import React from 'react';
import { Pencil, Trash2, Banknote, ShieldCheck, AlertCircle } from 'lucide-react';

export default function ClientCard({ client, onEdit, onDelete, onPay, canEdit }) {
    const getClientStatus = (c) => {
        // Lógica de estado: Si está cortado, inactivo, o tiene deuda > 0 -> Rojo
        if (c.estado_servicio === 'cortado' || c.estado_servicio === 'inactivo' || (c.deuda && Number(c.deuda) > 0)) {
            return {
                color: 'text-red-500 bg-red-50',
                icon: <AlertCircle size={14} />,
                label: c.estado_servicio === 'inactivo' ? 'INACTIVO' : 'DEUDA / CORTADO'
            };
        }
        return {
            color: 'text-green-600 bg-green-50',
            icon: <ShieldCheck size={14} />,
            label: 'AL DÍA'
        };
    };

    const status = getClientStatus(client);

    return (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-slate-800">{client.nombre_completo}</h3>
                        <span className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-black ${status.color}`}>
                            {status.icon} {status.label}
                        </span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-xs text-slate-400 font-mono text-[10px]">TEL: {client.telefono}</p>
                        {client.cedula && <p className="text-xs text-blue-400 font-mono text-[10px]">C.I.: {client.cedula}</p>}
                        <p className="text-xs text-slate-500 truncate max-w-[200px]">{client.direccion}</p>
                    </div>
                </div>

                <div className="flex gap-1">
                    {canEdit && (
                        <>
                            <button
                                onClick={() => onEdit(client)}
                                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Editar"
                            >
                                <Pencil size={16} />
                            </button>
                            <button
                                onClick={() => onDelete(client.id)}
                                className="p-2 text-slate-300 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"
                                title="Eliminar"
                            >
                                <Trash2 size={16} />
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl mt-4">
                <div className="flex gap-2 w-full">
                    <button
                        onClick={() => onPay(client)}
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md flex items-center justify-center gap-2 hover:bg-blue-700 transition transform active:scale-95"
                    >
                        <Banknote size={16} /> REGISTRAR PAGO
                    </button>
                </div>
            </div>
        </div>
    );
}
