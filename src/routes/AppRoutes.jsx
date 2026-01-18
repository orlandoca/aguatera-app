import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import MainLayout from '../layouts/MainLayout';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import ClientsPage from '../pages/ClientsPage';
import HistoryPage from '../pages/HistoryPage';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) return <div>Cargando...</div>; // Opcional: Spinner mientras verifica sesión

    if (!isAuthenticated) {
        // Redirigir al login guardando la ubicación actual
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default function AppRoutes() {
    const { isAuthenticated } = useAuth();
    // Usamos un componente wrapper para la lógica de redirección del login
    // para poder acceder a useLocation()
    const LoginRedirect = () => {
        const location = useLocation();
        const from = location.state?.from?.pathname || "/";
        return !isAuthenticated ? <LoginPage /> : <Navigate to={from} replace />;
    };

    return (
        <Routes>
            <Route path="/login" element={<LoginRedirect />} />

            <Route path="/" element={
                <ProtectedRoute>
                    <MainLayout>
                        <DashboardPage />
                    </MainLayout>
                </ProtectedRoute>
            } />

            <Route path="/clientes" element={
                <ProtectedRoute>
                    <MainLayout>
                        <ClientsPage />
                    </MainLayout>
                </ProtectedRoute>
            } />

            <Route path="/historial" element={
                <ProtectedRoute>
                    <MainLayout>
                        <HistoryPage />
                    </MainLayout>
                </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
