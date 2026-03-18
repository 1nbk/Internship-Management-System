import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('ims_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = (email, password) => {
        // Simple mock logic: email determines role for testing
        let role = 'student';
        if (email.includes('admin')) role = 'admin';
        else if (email.includes('supervisor')) role = 'supervisor';

        const mockUser = {
            id: Math.random().toString(36).substr(2, 9),
            email,
            role,
            name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
            ...(role === 'student' ? {
                institution: 'University of Ghana (UG)',
                program: 'B.Sc. Computer Science'
            } : {})
        };
        setUser(mockUser);
        localStorage.setItem('ims_user', JSON.stringify(mockUser));
        return true;
    };

    const signup = (userData) => {
        // Mock signup logic
        const newUserData = {
            id: Math.random().toString(36).substr(2, 9),
            ...userData
        };
        setUser(newUserData);
        localStorage.setItem('ims_user', JSON.stringify(newUserData));
        return true;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('ims_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
