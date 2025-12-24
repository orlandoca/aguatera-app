import React, { useState } from 'react';
import { Lock, User, Droplets, AlertCircle } from 'lucide-react';

export default function Login({ adminExistente, onLogin, onRegister }) {
  const [pass, setPass] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // VALIDACIÓN DE LÓGICA: Si es registro, verificamos los 6 dígitos
    if (!adminExistente && pass.length < 6) {
      alert("❌ La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    
    // Si pasa o si es login normal, ejecutamos la función que viene por props
    if (adminExistente) {
      onLogin(e);
    } else {
      onRegister(e);
    }
  };

  return (
    <div className="min-h-screen bg-blue-700 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 animate-in zoom-in duration-300">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-100 p-4 rounded-full text-blue-600 mb-4">
            <Droplets size={40} />
          </div>
          <h2 className="text-2xl font-black text-slate-800">
            {adminExistente ? 'Bienvenido Admin' : 'Crear Administrador'}
          </h2>
          <p className="text-slate-400 text-sm text-center mt-2">
            {adminExistente ? 'Ingresa tus credenciales para continuar' : 'Configura tu cuenta de acceso'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-4 text-slate-400" size={20} />
            <input 
              name="usuario" 
              placeholder="Nombre de usuario" 
              required 
              className="w-full p-4 pl-12 bg-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-4 text-slate-400" size={20} />
            <input 
              name="pass" 
              type="password" 
              placeholder="Contraseña" 
              required 
              minLength={6} // <-- Validación nativa del navegador
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="w-full p-4 pl-12 bg-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
            />
          </div>

          {/* MENSAJE DE AYUDA VISUAL (solo aparece en registro y si es corta) */}
          {!adminExistente && pass.length > 0 && pass.length < 6 && (
            <div className="flex items-center gap-2 text-red-500 text-[11px] font-bold px-2 animate-pulse">
              <AlertCircle size={14} />
              <span>Mínimo 6 caracteres para mayor seguridad</span>
            </div>
          )}

          <button 
            type="submit" 
            className={`w-full p-4 rounded-2xl font-bold shadow-lg transition-all ${
              !adminExistente && pass.length < 6 
              ? 'bg-slate-300 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95'
            }`}
          >
            {adminExistente ? 'Entrar al Sistema' : 'Finalizar Registro'}
          </button>
        </form>
      </div>
    </div>
  );
}