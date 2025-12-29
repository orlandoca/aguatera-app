import React, { useState } from 'react';
import { Lock, Mail, Droplets } from 'lucide-react';

export default function Login({ onLogin }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onLogin(e);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-blue-700 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 animate-in zoom-in duration-300">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-100 p-4 rounded-full text-blue-600 mb-4">
            <Droplets size={40} />
          </div>
          <h2 className="text-2xl font-black text-slate-800">
            Bienvenido
          </h2>
          <p className="text-slate-400 text-sm text-center mt-2">
            Ingresa tus credenciales para continuar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-4 text-slate-400" size={20} />
            <input
              name="email"
              type="email"
              placeholder="Correo Electrónico"
              required
              className="w-full p-4 pl-12 bg-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-4 text-slate-400" size={20} />
            <input
              name="password"
              type="password"
              placeholder="Contraseña"
              required
              className="w-full p-4 pl-12 bg-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full p-4 rounded-2xl font-bold shadow-lg transition-all bg-blue-600 hover:bg-blue-700 text-white active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar al Sistema'}
          </button>
        </form>
      </div>
    </div>
  );
}