import React, { useEffect, useState } from 'react';
import Dashboard from '../components/Dashboard.jsx';
import { paymentsService } from '../services/payments.service';

export default function DashboardPage() {
    const [pagos, setPagos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetch() {
            try {
                const data = await paymentsService.getAll();
                setPagos(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        fetch();
    }, []);

    const totalCobrado = pagos.reduce((acc, p) => acc + Number(p.monto), 0);

    if (loading) return <div>Cargando...</div>;

    return <Dashboard totalCobrado={totalCobrado} />;
}
