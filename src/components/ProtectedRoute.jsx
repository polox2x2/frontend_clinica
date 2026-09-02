import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Protege rutas requiriendo autenticación y opcionalmente roles específicos
const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Si no tiene permiso, lo mandamos a la ruta según su rol
    if (user.role === 'ADMIN') return <Navigate to="/dashboard" replace />;
    if (user.role === 'DOCTOR') return <Navigate to="/dashboard/mis-citas" replace />;
    if (user.role === 'PATIENT') return <Navigate to="/dashboard/mi-portal" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
