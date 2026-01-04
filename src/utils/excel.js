import * as XLSX from 'xlsx';

export const exportToExcel = (pagos) => {
    if (pagos.length === 0) {
        alert("No hay pagos registrados para exportar.");
        return;
    }

    const datosExcel = pagos.map(p => ({
        Fecha: new Date(p.created_at || p.fecha_pago).toLocaleDateString('es-PY'),
        Cliente: p.clientes?.nombre_completo || 'Desconocido',
        Tipo: p.tipo || 'OTRO',
        Monto: p.monto,
        Metodo: p.metodo || 'Efectivo',
        Referencia: p.referencia || ''
    }));

    const hoja = XLSX.utils.json_to_sheet(datosExcel);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Pagos del Mes");

    const fechaHoy = new Date().toISOString().split('T')[0];
    XLSX.writeFile(libro, `Reporte_Pagos_${fechaHoy}.xlsx`);
};
