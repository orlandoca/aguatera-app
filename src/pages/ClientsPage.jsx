import React, { useState, useEffect } from 'react';
import ListaClientes from '../components/ListaClientes.jsx';
import Formulario from '../components/Formulario.jsx';
import PaymentModal from '../components/PaymentModal.jsx'; // Importado
import { clientsService } from '../services/clients.service';
import { paymentsService } from '../services/payments.service';
import { useAuth } from '../store/AuthContext';

export default function ClientsPage() {
    const { userRole, userProfile } = useAuth();
    // Verificamos rol pasado globalmente
    const canEdit = userRole !== 'cobrador';
    console.log("userRole", userRole);

    const [view, setView] = useState("list"); // 'list' | 'form'
    const [clients, setClients] = useState([]);
    const [search, setSearch] = useState("");
    const [editingClient, setEditingClient] = useState(null);
    const [paymentClient, setPaymentClient] = useState(null); // Estado para el modal de pagos
    const [loading, setLoading] = useState(true);

    const fetchClients = async () => {
        setLoading(true);
        try {
            // Timeout de 10 segundos
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Tiempo de espera agotado. Verifique su conexión.")), 10000)
            );

            const data = await Promise.race([
                clientsService.getAll(),
                timeoutPromise
            ]);

            setClients(data);
        } catch (error) {
            console.error("Error fetching clients:", error);
            alert("Error cargando clientes: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        if (!canEdit) {
            alert("No tienes permisos para realizar esta acción.");
            return;
        }
        const fd = new FormData(e.target);
        const clientData = {
            nombre_completo: fd.get("nombre"),
            telefono: fd.get("tel"),
            cedula: fd.get("cedula"),
            direccion: fd.get("direccion"),
        };

        try {
            if (editingClient) {
                await clientsService.update(editingClient.id, clientData);
            } else {
                // Estado por defecto: inactivo
                await clientsService.create({ ...clientData, estado_servicio: 'inactivo' });
            }
            await fetchClients();
            setView("list");
            setEditingClient(null);
        } catch (err) {
            alert("Error al guardar: " + err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!canEdit) {
            alert("No tienes permisos para eliminar.");
            return;
        }
        if (window.confirm("¿Eliminar permanentemente?")) {
            try {
                await clientsService.delete(id);
                await fetchClients();
            } catch (err) {
                alert("Error al eliminar: " + err.message);
            }
        }
    };

    const handlePay = (client) => {
        setPaymentClient(client);
    };

    const handlePaymentSubmit = async (paymentData) => {
        try {
            await paymentsService.create({
                ...paymentData,
                cliente_id: paymentClient.id,
                cobrado_por: userProfile?.id
            });

            // Auto-activación: Si el cliente no está activo, se activa al pagar
            if (paymentClient.estado_servicio !== 'activo') {
                await clientsService.update(paymentClient.id, { estado_servicio: 'activo' });
            }

            await fetchClients(); // Refrescar lista para ver el nuevo estado
            alert("¡Pago registrado correctamente!");
            setPaymentClient(null);
        } catch (err) {
            alert("Error registrando pago: " + err.message);
        }
    };

    if (view === "form") {
        return (
            <Formulario
                clienteEdicion={editingClient}
                onGuardar={handleSave}
                onCancelar={() => { setView("list"); setEditingClient(null); }}
            />
        );
    }

    if (loading) return <div>Cargando...</div>;

    return (
        <>
            {canEdit && (
                <button
                    onClick={() => { setEditingClient(null); setView("form"); }}
                    className="w-full mb-4 p-4 bg-blue-100 text-blue-700 rounded-2xl font-bold flex justify-center items-center gap-2 border-2 border-dashed border-blue-300 italic"
                >
                    + REGISTRAR VECINO
                </button>
            )}
            <ListaClientes
                canEdit={canEdit}
                clientes={clients}
                busqueda={search}
                setBusqueda={setSearch}
                onEdit={(c) => { setEditingClient(c); setView("form"); }}
                onDelete={handleDelete}
                onPay={handlePay}
            />

            <PaymentModal
                client={paymentClient}
                isOpen={!!paymentClient}
                onClose={() => setPaymentClient(null)}
                onSave={handlePaymentSubmit}
            />
        </>
    );
}
