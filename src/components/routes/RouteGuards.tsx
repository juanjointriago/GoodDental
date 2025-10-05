import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store';
import { type Role } from '../../interfaces/users.interface';
import { APP_ROUTES } from '../../types/routes';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles: Role[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles,
}) => {
  const { user, loading } = useAuthStore();

  // Mostrar loading si la autenticación está en proceso
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-goodent-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Redirigir a auth si no hay usuario
  if (!user) {
    return <Navigate to={APP_ROUTES.AUTH} replace />;
  }

  // Verificar roles si se especifican
  if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
    return <Navigate to={APP_ROUTES.DASHBOARD} replace />;
  }

  return <>{children}</>;
};

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { user, loading } = useAuthStore();

  // Mostrar loading si la autenticación está en proceso
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-goodent-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Si ya está autenticado, redirigir al dashboard
  if (user) {
    return <Navigate to={APP_ROUTES.DASHBOARD} replace />;
  }

  return <>{children}</>;
};