import React, { useState, useEffect } from 'react';
// AGREGADO: Calendar e Historial en las importaciones
import { LayoutDashboard, Users, UserPlus, Calendar } from 'lucide-react';
import Dashboard from './components/Dashboard.jsx';
import ListaClientes from './components/ListaClientes.jsx';
import Formulario from './components/Formulario.jsx';
import Login from './components/Login.jsx';
import Historial from './components/Historial.jsx';
import { supabase } from './supabaseClient';
import FormularioConexion from './components/FormularioConexion.jsx';

export default function App() {
  const [vista, setVista] = useState("dashboard");
  const [busqueda, setBusqueda] = useState("");
  const [clienteEdicion, setClienteEdicion] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [pagos, setPagos] = useState([]);
  const [clienteParaConexion, setClienteParaConexion] = useState(null); // Nuevo estado
  const [pagosConexion, setPagosConexion] = useState([]); // Nuevo estado


  const generarDeudasMensuales = async () => {
  // 1. Obtener la fecha de hoy en formato texto (ej: "2023-10-24")
  const hoy = new Date().toISOString().split('T')[0];
  const ultimaCarga = localStorage.getItem('ultima_facturacion');

  // 2. Validar si ya se hizo hoy
  if (ultimaCarga === hoy) {
    alert("⚠️ ¡Atención! Ya has generado las cuotas del mes hoy. No es necesario hacerlo de nuevo para evitar duplicar deudas.");
    return;
  }

  const confirmar = confirm("¿Deseas cargar la cuota de Gs. 33.000 a todos los clientes?");
  if (!confirmar) return;

  setCargando(true);
  try {
    const { data: listaClientes, error: errFetch } = await supabase
      .from('clientes')
      .select('id, deuda');

    if (errFetch) throw errFetch;

    const promesas = listaClientes.map(cliente => {
      return supabase
        .from('clientes')
        .update({ deuda: Number(cliente.deuda) + 33000 })
        .eq('id', cliente.id);
    });

    await Promise.all(promesas);

    // 3. Si todo sale bien, guardamos la fecha del éxito
    localStorage.setItem('ultima_facturacion', hoy);

    alert(`¡Éxito! Se actualizaron ${listaClientes.length} clientes.`);
    await cargarTodo(); 
  } catch (error) {
    alert("Error: " + error.message);
  }
  setCargando(false);
};

  // --- FUNCIÓN PARA PAGO DE CONEXIÓN ---
const registrarPagoConexion = async (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  
  const pagoData = {
    cliente_id: Number(clienteParaConexion.id),
    monto: Number(fd.get("monto")),
    metodo_pago: fd.get("metodo"),
    referencia: fd.get("referencia"),
    fecha_pago: new Date().toISOString()
  };

  try {
    const { error } = await supabase.from('pagos_conexion').insert([pagoData]);
    if (error) throw error;

    alert("¡Conexión registrada con éxito!");
    setVista("clientes");
    setClienteParaConexion(null);
    await cargarTodo(); 
  } catch (err) {
    alert("Error: " + err.message);
  }
};

  // --- FUNCIÓN UNIFICADA PARA CARGAR DATOS ---
 const cargarTodo = async () => {
    setCargando(true);
    try {
      // 1. Obtener Clientes
      const { data: dataClientes } = await supabase
        .from('clientes')
        .select('*')
        .order('nombre', { ascending: true });
      setClientes(dataClientes || []);

      // 2. Obtener Pagos Mensuales
      const { data: dataPagos } = await supabase
        .from('pagos')
        .select('*, clientes(nombre)')
        .order('fecha_pago', { ascending: false });
      setPagos(dataPagos || []);

      // --- CÓDIGO ACTUALIZADO PARA EL HISTORIAL ---
      // 3. Obtener Pagos de Conexión CON NOMBRE DEL CLIENTE
      const { data: dataConexiones } = await supabase
        .from('pagos_conexion')
        .select('*, clientes(nombre)') // <--- IMPORTANTE: Agregamos clientes(nombre)
        .order('fecha_pago', { ascending: false });
      
      setPagosConexion(dataConexiones || []);
      // --------------------------------------------

    } catch (error) {
      console.error("Error cargando datos:", error);
    }
    setCargando(false);
  };

  useEffect(() => {
    cargarTodo();
  }, []);

  // --- LÓGICA DE LOGIN ---
  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem("aguatera_admin");
    return saved ? JSON.parse(saved) : null;
  });
  const [sesionIniciada, setSesionIniciada] = useState(false);

  // --- ESTADÍSTICAS ---
  const totalCobrado = clientes.filter(c => Number(c.deuda) === 0).length * 50000;
  const morosos = clientes.filter(c => Number(c.deuda) > 0);
  const totalPendiente = morosos.reduce((acc, c) => acc + Number(c.deuda), 0);

  // --- FUNCIONES CRUD ---
  const gestionarGuardar = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const clienteData = {
      nombre: fd.get("nombre"),
      tel: fd.get("tel"),
      deuda: Number(fd.get("deuda")),
      cedula: fd.get("cedula")
    };

    if (clienteEdicion) {
      await supabase.from('clientes').update(clienteData).eq('id', clienteEdicion.id);
    } else {
      await supabase.from('clientes').insert([clienteData]);
    }
    
    await cargarTodo(); // Corregido: antes decía obtenerClientes
    setVista("clientes");
    setClienteEdicion(null);
  };

  const registrarPago = async (cliente) => {
    if (!cliente) return;
    if (confirm(`¿Confirmar cobro de Gs. ${cliente.deuda} para ${cliente.nombre}?`)) {
      try {
        const { error: errorInsert } = await supabase
          .from('pagos')
          .insert([{ 
            cliente_id: cliente.id, 
            monto: cliente.deuda, 
            metodo_pago: 'Efectivo' 
          }]);
        if (errorInsert) throw errorInsert;

        await supabase.from('clientes').update({ deuda: 0 }).eq('id', cliente.id);
        
        alert("¡Pago registrado!");
        await cargarTodo(); 
      } catch (err) {
        alert("Error técnico: " + err.message);
      }
    }
  };

  const eliminarCliente = async (id) => {
    if (confirm("¿Eliminar permanentemente?")) {
      await supabase.from('clientes').delete().eq('id', id);
      await cargarTodo();
    }
  };

  // --- PROTECCIÓN DE LOGIN ---
  if (!sesionIniciada) {
  return <Login 
    adminExistente={admin !== null} 
    onLogin={async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const user = fd.get("usuario");
      const pass = fd.get("pass");

      // BUSCAR EN SUPABASE
      const { data, error } = await supabase
        .from('perfiles_admin')
        .select('*')
        .eq('usuario', user)
        .eq('password_hash', pass) // Comparamos usuario y contraseña
        .single();

      if (data) {
        setAdmin(data);
        setSesionIniciada(true);
      } else {
        alert("Usuario o contraseña incorrectos");
      }
    }} 
    onRegister={async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const nuevoAdmin = { 
        usuario: fd.get("usuario"), 
        password_hash: fd.get("pass"),
        nombre_aguatera: "Tanque Tres Bocas" 
      };

      // GUARDAR EN SUPABASE
      const { data, error } = await supabase
        .from('perfiles_admin')
        .insert([nuevoAdmin])
        .select()
        .single();

      if (error) {
        alert("Error al registrar: " + error.message);
      } else {
        setAdmin(data);
        setSesionIniciada(true);
        alert("Cuenta creada en la nube con éxito");
      }
    }} 
  />;
}

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans text-slate-900">
    <header className="bg-blue-700 text-white p-6 shadow-md sticky top-0 z-20">
  <div className="max-w-md mx-auto flex justify-between items-center">
    {/* Ahora muestra el nombre personalizado o 'Sistema' si no hay datos */}
    <h1 className="text-xl font-black italic tracking-tighter uppercase">
      {admin?.nombre_aguatera || "Agua-Control"}
    </h1>
    <button 
      onClick={() => setSesionIniciada(false)} 
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
            {vista === "dashboard" && <Dashboard totalCobrado={totalCobrado} morososCount={morosos.length} totalPendiente={totalPendiente} onGenerarMensualidades={generarDeudasMensuales} />}
            
            {vista === "clientes" && (
              <>
                <button onClick={() => { setClienteEdicion(null); setVista("formulario"); }} className="w-full mb-4 p-4 bg-blue-100 text-blue-700 rounded-2xl font-bold flex justify-center items-center gap-2 border-2 border-dashed border-blue-300 italic">
                  + REGISTRAR NUEVO VECINO
                </button>
                <ListaClientes 
                  clientes={clientes} busqueda={busqueda} setBusqueda={setBusqueda} 
                  onEdit={(c) => { setClienteEdicion(c); setVista("formulario"); }} 
                  onDelete={eliminarCliente} 
                  onPay={registrarPago} 
                  onConexion={(c) => { setClienteParaConexion(c); setVista("conexion"); }}
                  pagosConexion={pagosConexion}
                />
              </>
            )}

            {vista === "historial" && <Historial pagos={pagos} pagosConexion={pagosConexion} />}

            {vista === "formulario" && <Formulario clienteEdicion={clienteEdicion} onGuardar={gestionarGuardar} onCancelar={() => setVista("clientes")} />}
            {vista === "conexion" && (
        <FormularioConexion 
          nombreCliente={clienteParaConexion?.nombre} 
          onGuardar={registrarPagoConexion} 
          onCancelar={() => setVista("clientes")} 
        />
      )}
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