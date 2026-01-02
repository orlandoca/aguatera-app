import { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/auth.service';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [session, setSession] = useState(null);
    const [userRole, setUserRole] = useState(undefined);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        // Función auxiliar para cargar perfil en segundo plano sin bloquear UI
        const loadProfile = async (userId) => {
            try {
                const profile = await authService.getProfile(userId);
                if (mounted) {
                    setUserProfile(profile);
                    setUserRole(profile?.rol);
                }
            } catch (e) {
                console.error("Background profile fetch failed:", e);
                // No bloqueamos la app, el usuario sigue logueado pero sin rol extra
            }
        };

        // 1. Initial Session Check
        authService.getSession().then((session) => {
            if (!mounted) return;
            setSession(session);
            // DESBLOQUEO INMEDIATO: La app carga ya, el perfil llegará después
            setLoading(false);

            if (session?.user?.id) {
                loadProfile(session.user.id);
            }
        }).catch((err) => {
            console.error("Session check error:", err);
            setLoading(false); // Asegurar desbloqueo incluso en error
        });

        // 2. Subscribe to changes
        const { unsubscribe } = authService.onAuthStateChange(async (_event, session) => {
            if (!mounted) return;
            setSession(session);

            // Si hubo cambio de sesión (login/logout), actualizamos UI inmediatamente
            setLoading(false);

            if (session?.user?.id) {
                loadProfile(session.user.id);
            } else {
                setUserRole(null);
                setUserProfile(null);
            }
        });

        return () => {
            mounted = false;
            unsubscribe();
        };
    }, []);

    const value = {
        session,
        userRole,
        userProfile,
        loading,
        isAuthenticated: !!session
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-slate-500">Cargando aplicación...</div>;
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
