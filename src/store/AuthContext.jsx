import { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/auth.service';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [session, setSession] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch initial session
        authService.getSession().then(async (session) => {
            setSession(session);
            if (session?.user?.id) {
                try {
                    const profile = await authService.getProfile(session.user.id);
                    setUserProfile(profile);
                    setUserRole(profile?.rol);
                } catch (e) {
                    console.error("Error fetching profile", e);
                }
            }
            setLoading(false);
            setLoading(false);
        }).catch(err => {
            console.error("Error checking session:", err);
            setLoading(false);
        });

        // Subscribe to changes
        const { unsubscribe } = authService.onAuthStateChange(async (_event, session) => {
            setSession(session);
            if (session?.user?.id) {
                try {
                    const profile = await authService.getProfile(session.user.id);
                    setUserProfile(profile);
                    setUserRole(profile?.rol);
                } catch (e) {
                    console.error("Error fetching profile", e);
                }
            } else {
                setUserRole(null);
                setUserProfile(null);
            }
        });

        return () => unsubscribe();
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
