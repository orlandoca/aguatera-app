import React, { useEffect, useState } from 'react';
import Historial from '../components/Historial.jsx';
import { paymentsService } from '../services/payments.service';
import { exportToExcel } from '../utils/excel';

export default function HistoryPage() {
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

    if (loading) return <div>Cargando...</div>;

    return (
        <>
            <div className="flex justify-end mb-4">
                <button
                    onClick={() => exportToExcel(pagos)}
                    className="bg-green-600 text-white px-4 py-2 rounded shadow text-xs font-bold"
                >
                    DESCARGAR EXCEL
                </button>
            </div>
            <Historial pagos={pagos} />
        </>
    );
}
