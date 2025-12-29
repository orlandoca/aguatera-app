import React, { useState, useEffect } from 'react';
import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ClientsPage from './pages/ClientsPage';
import HistoryPage from './pages/HistoryPage';
import { authService } from './services/auth.service';
import './App.css'; // Importing CSS if needed, or rely on index.css

export default function App() {
  const [session, setSession] = useState(null);
  const [view, setView] = useState("dashboard");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    authService.getSession().then((session) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for changes
    const subscription = authService.onAuthStateChange((_event, session) => {
      setSession(session);
      // Reset view on login? Not strictly necessary but good practice
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-400">Cargando Sistema...</div>;

  if (!session) {
    return <LoginPage />;
  }

  return (
    <MainLayout session={session} activeView={view} onViewChange={setView}>
      {view === 'dashboard' && <DashboardPage />}
      {view === 'clientes' && <ClientsPage />}
      {view === 'historial' && <HistoryPage />}
    </MainLayout>
  );
}