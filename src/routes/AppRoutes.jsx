import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import MainLayout from '../layouts/MainLayout';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import ClientsPage from '../pages/ClientsPage';
import HistoryPage from '../pages/HistoryPage';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return children;
};

export default function AppRoutes() {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" replace />} />

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
