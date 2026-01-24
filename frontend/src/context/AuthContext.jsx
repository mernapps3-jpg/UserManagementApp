import { createContext, useState, useEffect } from "react";
import api from '../api';


export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // On first load, try to fetch the current user using the stored token.
        async function fetchMe() {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const { data } = await api.get('/api/auth/me');
                setUser(data.user);
            } catch (error) {
                // Token may be invalid/expired; clear it to avoid loops.
                localStorage.removeItem('token');
            } finally {
                setLoading(false);
            }
        }
        fetchMe();
    }, []);

    const login = (token, userData) => {
        localStorage.setItem('token', token);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );

}
