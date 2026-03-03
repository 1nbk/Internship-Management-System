import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loader"></div>
            </div>
        );
    }

    if (!user) {
        // Not logged in, redirect to login
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Logged in but doesn't have the right role
        // Redirect to their default dashboard based on their actual role
        const defaultPath = user.role === 'admin' ? '/dashboard/admin' :
            user.role === 'supervisor' ? '/dashboard/supervisor' :
                '/dashboard/student';
        return <Navigate to={defaultPath} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
