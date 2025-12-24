import React from 'react';
import { Lock, User, Droplets } from 'lucide-react';

export default function Login({ adminExistente, onLogin, onRegister }) {
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

        <form onSubmit={adminExistente ? onLogin : onRegister} className="space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-4 text-slate-400" size={20} />
            <input 
              name="usuario" placeholder="Nombre de usuario" required 
              className="w-full p-4 pl-12 bg-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-4 text-slate-400" size={20} />
            <input 
              name="pass" type="password" placeholder="Contraseña" required 
              className="w-full p-4 pl-12 bg-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white p-4 rounded-2xl font-bold shadow-lg hover:bg-blue-700 transition-colors">
            {adminExistente ? 'Entrar al Sistema' : 'Finalizar Registro'}
          </button>
        </form>
      </div>
    </div>
  );
}