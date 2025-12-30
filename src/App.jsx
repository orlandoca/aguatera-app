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
  const [userRole, setUserRole] = useState(null);
  const [view, setView] = useState("dashboard");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    authService.getSession().then(async (session) => {
      setSession(session);
      if (session?.user?.id) {
        try {
          const profile = await authService.getProfile(session.user.id);
          setUserRole(profile?.rol);
        } catch (e) {
          console.error("Error fetching profile", e);
        }
      }
      setLoading(false);
    });

    // Listen for changes
    const subscription = authService.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user?.id) {
        try {
          const profile = await authService.getProfile(session.user.id);
          setUserRole(profile?.rol);

        } catch (e) {
          console.error("Error fetching profile", e);
        }
      } else {
        setUserRole(null);
      }
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
      {view === 'clientes' && <ClientsPage session={session} userRole={userRole} />}
      {view === 'historial' && <HistoryPage />}
    </MainLayout>
  );
}