import React, { useState, useEffect } from 'react';
// AGREGADO: Calendar e Historial en las importaciones
import { LayoutDashboard, Users, Calendar } from 'lucide-react';
import Dashboard from './components/Dashboard.jsx';
import ListaClientes from './components/ListaClientes.jsx';
import Formulario from './components/Formulario.jsx';
import Login from './components/Login.jsx';
import Historial from './components/Historial.jsx';
import { supabase } from './supabaseClient';
import * as XLSX from 'xlsx';


export default function App() {
  const [vista, setVista] = useState("dashboard");
  const [busqueda, setBusqueda] = useState("");
  const [clienteEdicion, setClienteEdicion] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [pagos, setPagos] = useState([]);


  const exportarExcelPagos = () => {
    if (pagos.length === 0) {
      alert("No hay pagos registrados para exportar.");
      return;
    }

    // 1. Preparamos los datos con nombres de columnas claros
    const datosExcel = pagos.map(p => ({
      Fecha: new Date(p.created_at || p.fecha_pago).toLocaleDateString('es-PY'),
      Cliente: p.clientes?.nombre_completo || 'Desconocido',
      Monto: p.monto,
      Metodo: p.metodo || 'Efectivo',
      Referencia: p.referencia || ''
    }));

    // 2. Creamos el libro y la hoja de Excel
    const hoja = XLSX.utils.json_to_sheet(datosExcel);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Pagos del Mes");

    // 3. Descargamos el archivo
    const fechaHoy = new Date().toISOString().split('T')[0];
    XLSX.writeFile(libro, `Reporte_Pagos_${fechaHoy}.xlsx`);
  };


  // --- FUNCIÓN UNIFICADA PARA CARGAR DATOS ---
  const cargarTodo = async () => {
    setCargando(true);
    try {
      // 1. Obtener Clientes (Mapeando nombres de columnas de la BD)
      const { data: dataClientes, error: errorClientes } = await supabase
        .from('clientes')
        .select('*')
        .order('nombre_completo', { ascending: true });

      if (errorClientes) throw errorClientes;
      setClientes(dataClientes || []);
      console.log("dataClientes", dataClientes);

      // 2. Obtener Pagos
      const { data: dataPagos, error: errorPagos } = await supabase
        .from('pagos')
        .select('*, clientes(nombre_completo)')
        .order('fecha_pago', { ascending: false });

      if (errorPagos) throw errorPagos;
      setPagos(dataPagos || []);

    } catch (error) {
      console.error("Error cargando datos:", error);
    }
    setCargando(false);
  };

  useEffect(() => {
    cargarTodo();
  }, []);

  // --- LÓGICA DE LOGIN CON SUPABASE ---
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // --- ESTADÍSTICAS ---
  // Ya no calculamos deuda ni morosos porque no existe ese campo
  const totalCobrado = pagos.reduce((acc, p) => acc + Number(p.monto), 0);

  // --- FUNCIONES CRUD ---
  const gestionarGuardar = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const clienteData = {
      nombre_completo: fd.get("nombre"),
      telefono: fd.get("tel"),
      cedula: fd.get("cedula"),
      direccion: fd.get("direccion"),
      // estado: 'Activo' // Podríamos poner un default
    };

    try {
      if (clienteEdicion) {
        const { error } = await supabase.from('clientes').update(clienteData).eq('id', clienteEdicion.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('clientes').insert([clienteData]);
        if (error) throw error;
      }

      await cargarTodo();
      setVista("clientes");
      setClienteEdicion(null);
    } catch (err) {
      alert("Error al guardar: " + err.message);
    }
  };

  const registrarPago = async (cliente) => {
    if (!cliente) return;

    // Al no haber deuda fija, preguntamos el monto
    const montoStr = prompt(`Ingrese el monto a cobrar a ${cliente.nombre_completo}:`, "33000");
    if (!montoStr) return;

    const monto = Number(montoStr);
    if (isNaN(monto) || monto <= 0) {
      alert("Monto inválido");
      return;
    }

    try {
      const { error: errorInsert } = await supabase
        .from('pagos')
        .insert([{
          cliente_id: cliente.id,
          monto: monto,
          tipo: 'Mensualidad', // Valor por defecto
          metodo: 'Efectivo',
          fecha_pago: new Date().toISOString()
        }]);

      if (errorInsert) throw errorInsert;

      alert("¡Pago registrado!");
      await cargarTodo();
    } catch (err) {
      alert("Error técnico: " + err.message);
    }
  };

  const eliminarCliente = async (id) => {
    if (confirm("¿Eliminar permanentemente?")) {
      await supabase.from('clientes').delete().eq('id', id);
      await cargarTodo();
    }
  };

  // --- PROTECCIÓN DE LOGIN ---
  // --- PROTECCIÓN DE LOGIN ---
  if (!session) {
    return (
      <Login
        onLogin={async (e) => {
          e.preventDefault();
          const fd = new FormData(e.target);
          const email = fd.get("email");
          const password = fd.get("password");

          const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            alert("Error al iniciar sesión: " + error.message);
          }
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans text-slate-900">
      <header className="bg-blue-700 text-white p-6 shadow-md sticky top-0 z-20">
        <div className="max-w-md mx-auto flex justify-between items-center">
          {/* Ahora muestra el nombre personalizado o 'Sistema' si no hay datos */}
          <h1 className="text-xl font-black italic tracking-tighter uppercase">
            {session.user.email}
          </h1>
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-[10px] opacity-60 font-bold underline"
          >
            SALIR
          </button>
        </div>
      </header>

      <main className="p-4 max-w-md mx-auto">
        {cargando ? (
          <p className="text-center font-bold text-slate-400 py-10">Conectando a la nube...</p>
        ) : (
          <>
            {vista === "dashboard" && <Dashboard totalCobrado={totalCobrado} />}

            {vista === "clientes" && (
              <>
                <button onClick={() => { setClienteEdicion(null); setVista("formulario"); }} className="w-full mb-4 p-4 bg-blue-100 text-blue-700 rounded-2xl font-bold flex justify-center items-center gap-2 border-2 border-dashed border-blue-300 italic">
                  + REGISTRAR VECINO
                </button>
                <ListaClientes
                  clientes={clientes} busqueda={busqueda} setBusqueda={setBusqueda}
                  onEdit={(c) => { setClienteEdicion(c); setVista("formulario"); }}
                  onDelete={eliminarCliente}
                  onPay={registrarPago}
                />
              </>
            )}

            {vista === "historial" && <Historial pagos={pagos} />}

            {vista === "formulario" && <Formulario clienteEdicion={clienteEdicion} onGuardar={gestionarGuardar} onCancelar={() => setVista("clientes")} />}
          </>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200 flex justify-around p-3 z-30">
        <button onClick={() => setVista("dashboard")} className={`flex flex-col items-center p-2 ${vista === 'dashboard' ? 'text-blue-600' : 'text-slate-400'}`}>
          <LayoutDashboard size={24} /><span className="text-[10px] font-bold">RESUMEN</span>
        </button>

        <button onClick={() => setVista("clientes")} className={`flex flex-col items-center p-2 ${vista === 'clientes' ? 'text-blue-600' : 'text-slate-400'}`}>
          <Users size={24} /><span className="text-[10px] font-bold">CLIENTES</span>
        </button>

        <button onClick={() => setVista("historial")} className={`flex flex-col items-center p-2 ${vista === 'historial' ? 'text-blue-600' : 'text-slate-400'}`}>
          <Calendar size={24} /><span className="text-[10px] font-bold">HISTORIAL</span>
        </button>
      </nav>
    </div>
  );
}