import React from 'react';
import { LayoutDashboard, Users, Calendar } from 'lucide-react';
import { authService } from '../services/auth.service';

export default function MainLayout({ children, session, activeView, onViewChange }) {
    const handleLogout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20 font-sans text-slate-900">
            <header className="bg-blue-700 text-white p-6 shadow-md sticky top-0 z-20">
                <div className="max-w-md mx-auto flex justify-between items-center">
                    <h1 className="text-xl font-black italic tracking-tighter uppercase">
                        {session?.user?.email || 'Sistema'}
                    </h1>
                    <button
                        onClick={handleLogout}
                        className="text-[10px] opacity-60 font-bold underline"
                    >
                        SALIR
                    </button>
                </div>
            </header>

            <main className="p-4 max-w-md mx-auto">
                {children}
            </main>

            <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200 flex justify-around p-3 z-30">
                <button
                    onClick={() => onViewChange("dashboard")}
                    className={`flex flex-col items-center p-2 ${activeView === 'dashboard' ? 'text-blue-600' : 'text-slate-400'}`}
                >
                    <LayoutDashboard size={24} /><span className="text-[10px] font-bold">RESUMEN</span>
                </button>

                <button
                    onClick={() => onViewChange("clientes")}
                    className={`flex flex-col items-center p-2 ${activeView === 'clientes' ? 'text-blue-600' : 'text-slate-400'}`}
                >
                    <Users size={24} /><span className="text-[10px] font-bold">CLIENTES</span>
                </button>

                <button
                    onClick={() => onViewChange("historial")}
                    className={`flex flex-col items-center p-2 ${activeView === 'historial' ? 'text-blue-600' : 'text-slate-400'}`}
                >
                    <Calendar size={24} /><span className="text-[10px] font-bold">HISTORIAL</span>
                </button>
            </nav>
        </div>
    );
}
