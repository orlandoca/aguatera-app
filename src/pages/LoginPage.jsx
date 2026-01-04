import React from 'react';
import Login from '../components/Login';
import { authService } from '../services/auth.service';

export default function LoginPage() {
    const handleLogin = async (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const email = fd.get("email");
        const password = fd.get("password");

        try {
            await authService.login(email, password);
        } catch (error) {
            alert("Error al iniciar sesión: " + error.message);
        }
    };

    return <Login onLogin={handleLogin} />;
}
