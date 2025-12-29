import React, { useState, useEffect } from 'react';
import ListaClientes from '../components/ListaClientes.jsx';
import Formulario from '../components/Formulario.jsx';
import { clientsService } from '../services/clients.service';
import { paymentsService } from '../services/payments.service';

export default function ClientsPage() {
    const [view, setView] = useState("list"); // 'list' | 'form'
    const [clients, setClients] = useState([]);
    const [search, setSearch] = useState("");
    const [editingClient, setEditingClient] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchClients = async () => {
        setLoading(true);
        try {
            const data = await clientsService.getAll();
            setClients(data);
        } catch (error) {
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
                await clientsService.create(clientData);
            }
            await fetchClients();
            setView("list");
            setEditingClient(null);
        } catch (err) {
            alert("Error al guardar: " + err.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Eliminar permanentemente?")) {
            try {
                await clientsService.delete(id);
                await fetchClients();
            } catch (err) {
                alert("Error al eliminar: " + err.message);
            }
        }
    };

    const handlePay = async (client) => {
        if (!client) return;
        const montoStr = prompt(`Ingrese el monto a cobrar a ${client.nombre_completo}:`, "33000");
        if (!montoStr) return;
        const monto = Number(montoStr);

        if (isNaN(monto) || monto <= 0) {
            alert("Monto inválido");
            return;
        }

        try {
            await paymentsService.create({
                cliente_id: client.id,
                monto: monto,
                tipo: 'Mensualidad',
                metodo: 'Efectivo',
                fecha_pago: new Date().toISOString()
            });
            alert("¡Pago registrado!");
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
            <button
                onClick={() => { setEditingClient(null); setView("form"); }}
                className="w-full mb-4 p-4 bg-blue-100 text-blue-700 rounded-2xl font-bold flex justify-center items-center gap-2 border-2 border-dashed border-blue-300 italic"
            >
                + REGISTRAR VECINO
            </button>
            <ListaClientes
                clientes={clients}
                busqueda={search}
                setBusqueda={setSearch}
                onEdit={(c) => { setEditingClient(c); setView("form"); }}
                onDelete={handleDelete}
                onPay={handlePay}
            />
        </>
    );
}
