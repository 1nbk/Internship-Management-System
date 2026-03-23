import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../api/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const savedUser = localStorage.getItem('ims_user');
                const token = authService.getToken();
                
                if (savedUser && token) {
                    try {
                        setUser(JSON.parse(savedUser));
                    } catch (parseError) {
                        console.error('Failed to parse saved user:', parseError);
                        authService.logout();
                    }
                } else {
                    authService.logout();
                }
            } catch (error) {
                console.error('Auth check failed:', error);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const data = await authService.login(email, password);
            setUser(data.user);
            authService.setToken(data.token);
            localStorage.setItem('ims_user', JSON.stringify(data.user));
            return { success: true };
        } catch (error) {
            console.error('Login failed:', error.message);
            return { success: false, error: error.message };
        }
    };

    const signup = async (userData) => {
        try {
            const data = await authService.signup(userData);
            setUser(data.user);
            authService.setToken(data.token);
            localStorage.setItem('ims_user', JSON.stringify(data.user));
            return { success: true };
        } catch (error) {
            console.error('Signup failed:', error.message);
            return { success: false, error: error.message };
        }
    };

    const logout = () => {
        setUser(null);
        authService.logout();
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
