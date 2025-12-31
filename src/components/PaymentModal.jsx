import React, { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, CreditCard, CheckCircle } from 'lucide-react';
import { paymentsService } from '../services/payments.service';

export default function PaymentModal({ client, isOpen, onClose, onSave }) {
    if (!isOpen || !client) return null;

    const [loading, setLoading] = useState(false);
    const [checkingConnection, setCheckingConnection] = useState(true);
    const [hasConnectionPayment, setHasConnectionPayment] = useState(false);

    const [formData, setFormData] = useState({
        tipo: 'mensualidad', // 'conexion' | 'mensualidad'
        monto: '',
        metodo: 'efectivo', // 'efectivo' | 'transferencia' | 'qr'
        periodo: new Date().toISOString().slice(0, 7), // YYYY-MM
        referencia: '',
    });

    useEffect(() => {
        // Al abrir el modal, verificar si ya pagó conexión
        const check = async () => {
            setCheckingConnection(true);
            try {
                const alreadyPaid = await paymentsService.checkConnectionPayment(client.id);
                setHasConnectionPayment(alreadyPaid);
                // Si ya pagó conexión, forzar mensualidad. Si no, quizá pre-seleccionar conexión?
                // El requerimiento dice: "Conexión (único, no repetible)"
                if (alreadyPaid) {
                    setFormData(prev => ({ ...prev, tipo: 'mensualidad' }));
                }
            } catch (err) {
                console.error("Error verificando conexión:", err);
            } finally {
                setCheckingConnection(false);
            }
        };
        check();
    }, [client]);

    // Pre-llenar referencia con estado del cliente
    useEffect(() => {
        // "Estado del cliente (al día / en deuda)"
        // Asumiendo que client.estado tiene ese valor, o calculándolo.
        // Si no está en el objeto cliente, usaremos el valor que tenga.
        const estadoCliente = client.estado || 'Desconocido';
        // Agregamos el estado actual a la referencia por defecto si está vacía
        setFormData(prev => ({
            ...prev,
            referencia: prev.referencia || `Estado cliente: ${estadoCliente}`
        }));
    }, [client]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Validaciones
            if (formData.tipo === 'conexion' && hasConnectionPayment) {
                throw new Error("Este cliente ya tiene un pago de conexión registrado.");
            }
            if (!formData.monto || Number(formData.monto) <= 0) {
                throw new Error("El monto debe ser mayor a 0.");
            }

            // Preparar payload
            // Para mensualidad, tomamos el periodo. Para conexión, el periodo es la fecha actual (o null si la DB lo permite, pero la DB dice 'date')
            const periodoDate = formData.tipo === 'mensualidad' ? `${formData.periodo}-01` : new Date().toISOString().split('T')[0];

            const paymentData = {
                tipo: formData.tipo,
                monto: Number(formData.monto),
                metodo: formData.metodo,
                referencia: formData.referencia, // Aquí va el estado del cliente concatenado si el usuario no lo borró
                periodo_cubierto: periodoDate,
                // fecha_pago se pone en el servicio o backend (default now()), pero aquí podemos mandarlo si queremos
                fecha_pago: new Date().toISOString(),
                cobrado_por: null, // Se llenará en la página padre con el userProfile, o lo pasamos aquí. 
                // Mejor devolver los datos y que el padre agregue el userProfile.
            };

            await onSave(paymentData);
            onClose();
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Registrar Pago</h2>
                        <p className="text-sm text-slate-500">{client.nombre_completo}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition">
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">

                    {/* Tipo de Pago */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tipo de Pago</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                disabled={hasConnectionPayment || checkingConnection}
                                onClick={() => setFormData(prev => ({ ...prev, tipo: 'conexion' }))}
                                className={`p-3 rounded-xl border-2 flex items-center justify-center gap-2 transition relative
                                    ${formData.tipo === 'conexion'
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-slate-100 text-slate-500 hover:border-slate-300'}
                                    ${(hasConnectionPayment || checkingConnection) ? 'opacity-50 cursor-not-allowed' : ''}
                                `}
                            >
                                <span className="font-bold">Conexión</span>
                                {hasConnectionPayment && <CheckCircle size={14} className="text-green-500 absolute top-2 right-2" />}
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, tipo: 'mensualidad' }))}
                                className={`p-3 rounded-xl border-2 flex items-center justify-center gap-2 transition
                                    ${formData.tipo === 'mensualidad'
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-slate-100 text-slate-500 hover:border-slate-300'}
                                `}
                            >
                                <span className="font-bold">Mensualidad</span>
                            </button>
                        </div>
                        {hasConnectionPayment && (
                            <p className="text-xs text-green-600 bg-green-50 p-2 rounded-lg">
                                ✓ Cliente ya abonó la conexión
                            </p>
                        )}
                    </div>

                    {/* Periodo (Solo mensualidad) */}
                    {formData.tipo === 'mensualidad' && (
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Mes Correspondiente</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 text-slate-400" size={18} />
                                <input
                                    type="month"
                                    name="periodo"
                                    value={formData.periodo}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                                />
                            </div>
                        </div>
                    )}

                    {/* Monto */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Monto (Gs)</label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-3 text-slate-400" size={18} />
                            <input
                                type="number"
                                name="monto"
                                value={formData.monto}
                                onChange={handleChange}
                                placeholder="0"
                                required
                                min="1"
                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-lg font-bold text-slate-700"
                            />
                        </div>
                    </div>

                    {/* Método de Pago */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Método</label>
                        <div className="relative">
                            <CreditCard className="absolute left-3 top-3 text-slate-400" size={18} />
                            <select
                                name="metodo"
                                value={formData.metodo}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white"
                            >
                                <option value="efectivo">Efectivo</option>
                                <option value="transferencia">Transferencia Bancaria</option>
                                <option value="qr">QR</option>
                            </select>
                        </div>
                    </div>

                    {/* Referencia */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Referencia / Observación</label>
                        <input
                            type="text"
                            name="referencia"
                            value={formData.referencia}
                            onChange={handleChange}
                            placeholder="Ej: Pago adelantado..."
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        />
                    </div>

                    {/* Actions */}
                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading || checkingConnection}
                            className="flex-1 px-4 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 disabled:opacity-50"
                        >
                            {loading ? 'Registrando...' : 'Confirmar Pago'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
