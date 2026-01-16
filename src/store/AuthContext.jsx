import { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/auth.service';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [session, setSession] = useState(null);
    const [userRole, setUserRole] = useState(undefined);
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        // Función auxiliar para cargar usuario en segundo plano sin bloquear UI
        const loadUsuario = async (userId) => {
            try {
                const data = await authService.getUsuario(userId);
                if (mounted) {
                    setUsuario(data);
                    // Si no hay perfil, establecemos null para detener el "Cargando..."
                    setUserRole(data?.rol || null);
                }
            } catch (e) {
                console.error("Background user fetch failed:", e);
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
                loadUsuario(session.user.id);
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
                loadUsuario(session.user.id);
            } else {
                setUserRole(null);
                setUsuario(null);
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
        usuario,
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
