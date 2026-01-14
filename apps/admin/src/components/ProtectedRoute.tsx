import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const token = localStorage.getItem('token');

    // In a real app, we might also want to verify token expiration here
    // But for now, simple existence check is enough
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}
